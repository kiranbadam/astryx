// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file The page ranker behind `build`'s START: which page template an idea
 * should start from.
 *
 * @input A free-text idea and the project's ready page templates (id, display
 *   name, description, `Family - Variant` category), all read from each
 *   template's own descriptor.
 * @output Every template, ranked, with the query terms it matched and whether
 *   the idea names its family; `pickStart` turns that into a template or null.
 * @position Beside kit.mjs (api/build/kit/). Search ranks components, docs,
 *   blocks and pages against short lookups; this ranks only page templates,
 *   against the long descriptions builders actually write ("ops dashboard with
 *   a KPI row, a sortable table and a trend chart"). Search's scorer is left
 *   alone: its callers depend on its scores.
 *
 * Why a separate ranker. Real `build` queries run to fifteen words or more.
 * Search scores a page on its single strongest term plus a garnish, so one
 * incidental word decides: "status" picks the project-status dashboard,
 * "board" picks the kanban board for a game board. Here every matched term
 * counts, weighted by how rare it is among page templates (inverse document
 * frequency), so the page that answers more of the idea — and its rarer words —
 * wins. Two structural signals sit on top:
 *
 * - The head noun. The words before the first "with", ":" or "," name what
 *   the page is ("audit dashboard: dense table with …"); a family word there
 *   outweighs the same word among the parts.
 * - The family base. A template whose id is its family's name (`dashboard`,
 *   `settings`) is that family's default; it wins when no variant's own words
 *   outweigh it.
 *
 * Family words come from the templates themselves — a word in the ids of two
 * or more templates of one family, plus the family's name when a template
 * carries it — never from a list kept here, so an integration's templates join
 * the vocabulary by being named like their family.
 */

import {stem, STOPWORDS, SYNONYMS} from '../../search/search.mjs';

/**
 * How much a term counts by where the template names it. The id and category
 * are the author's own label for what the page is; the description's last
 * sentence lists the ideas it serves; its body describes the layout.
 */
const FIELD_WEIGHT = {
  id: 3,
  variant: 3,
  family: 2,
  display: 2,
  intent: 2,
  body: 1,
};
/** A synonym hit counts at this share of a direct hit. */
const SYNONYM_SHARE = 0.5;
/** Added when the idea's head names the template's family. */
const HEAD_FAMILY = 12;
/** Added when the family is named anywhere else in the idea. */
const BODY_FAMILY = 2;
/** Added to a family's base template when the idea names that family. */
const FAMILY_BASE = 2;
/**
 * The least a start must score, and the evidence it needs: two matched terms,
 * or the idea naming its family. One rare word alone is how a tic-tac-toe game
 * board became a kanban board.
 */
const START_SCORE = 10;
const START_TERMS = 2;

/** Filler that search keeps but that says nothing about a page's layout. */
const FILLER = new Set([
  'per',
  'each',
  'every',
  'using',
  'via',
  'into',
  'onto',
  'about',
  'above',
  'below',
  'across',
  'within',
  'without',
  'between',
  'plus',
  'also',
  'then',
  'them',
  'they',
  'which',
  'while',
  'when',
  'all',
  'any',
  'new',
  'use',
  'used',
  'show',
  'shows',
  'showing',
  'display',
  'displays',
  'displaying',
]);

/**
 * Where an idea's head ends: its first clause, before the parts it lists.
 */
const HEAD_END =
  /:|,|;|\(|\s[-\u2013\u2014]\s|\b(?:with|showing|listing|for|that|where|plus|including|containing|featuring|which|to|from|of)\b/i;

/**
 * Content terms of a text: lowercase alphanumeric words, stopwords and filler
 * removed, stemmed.
 * @param {string} text
 * @returns {string[]}
 */
function terms(text) {
  return (String(text).toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .filter(t => t.length >= 2 && !STOPWORDS.has(t) && !FILLER.has(t))
    .map(stem);
}

/** @param {string} text */
const normalized = text =>
  (String(text).toLowerCase().match(/[a-z0-9]+/g) ?? []).join(' ');

/** Stemmed synonym lookup built from search's vocabulary, both directions. */
const SYNONYMS_OF = (() => {
  /** @type {Map<string, Set<string>>} */
  const index = new Map();
  /** @param {string} a @param {string} b */
  const add = (a, b) => {
    const set = index.get(a) ?? new Set();
    set.add(b);
    index.set(a, set);
  };
  for (const [key, values] of Object.entries(SYNONYMS)) {
    const k = stem(key);
    for (const value of values) {
      const v = stem(value);
      add(k, v);
      add(v, k);
      for (const other of values) if (other !== value) add(v, stem(other));
    }
  }
  return index;
})();

/**
 * @typedef {import('../_adapter.mjs').PageTemplate} PageTemplate
 * @typedef {{name: string, score: number, hits: number, familyNamed: boolean}} RankedPage
 */

/**
 * Rank page templates against an idea, best first. Ties go to the template
 * with the shorter id (the family's broader page), then by name.
 *
 * @param {string} query
 * @param {PageTemplate[]} pages
 * @returns {RankedPage[]}
 */
export function rankPages(query, pages) {
  const docs = pages.map(page => {
    const [family = '', ...variantParts] = page.category.split(' - ');
    const sentences = page.description.trim().split(/(?<=[.!?])\s+/);
    const intent = sentences.length > 1 ? sentences[sentences.length - 1] : '';
    const body =
      sentences.length > 1
        ? sentences.slice(0, -1).join(' ')
        : page.description;
    /** @type {Record<keyof typeof FIELD_WEIGHT, string>} */
    const fields = {
      id: page.name.replace(/-/g, ' '),
      variant: variantParts.join(' - '),
      family,
      display: page.displayName,
      intent,
      body,
    };
    /** @type {Map<string, number>} */
    const bag = new Map();
    for (const [field, text] of Object.entries(fields)) {
      const weight = FIELD_WEIGHT[/** @type {keyof typeof FIELD_WEIGHT} */ (field)];
      for (const t of terms(text)) bag.set(t, Math.max(bag.get(t) ?? 0, weight));
    }
    return {page, family: family.trim(), bag};
  });

  // Inverse document frequency over page templates: a word every dashboard
  // carries says less than one only the funnel carries.
  /** @type {Map<string, number>} */
  const df = new Map();
  for (const {bag} of docs) for (const t of bag.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const n = docs.length;
  /** @param {string} t */
  const idf = t => {
    const d = df.get(t);
    return d ? Math.log(1 + (n - d + 0.5) / (d + 0.5)) : 0;
  };

  // Family words, from the templates' own ids.
  /** @type {Map<string, Map<string, number>>} */
  const idWords = new Map();
  for (const {page, family} of docs) {
    const counts = idWords.get(family) ?? new Map();
    for (const w of new Set(page.name.split('-'))) {
      if (w.length >= 3) counts.set(stem(w), (counts.get(stem(w)) ?? 0) + 1);
    }
    idWords.set(family, counts);
  }
  /** @type {Map<string, string>} */
  const familyOfWord = new Map();
  for (const [family, counts] of idWords) {
    const heads = [...counts].filter(([, c]) => c >= 2).map(([w]) => w);
    const name = normalized(family).split(' ').pop() ?? '';
    if (name.length >= 3 && counts.has(stem(name))) heads.push(stem(name));
    for (const head of heads) {
      if (!familyOfWord.has(head)) familyOfWord.set(head, family);
      for (const s of SYNONYMS_OF.get(head) ?? []) {
        if (!familyOfWord.has(s)) familyOfWord.set(s, family);
      }
    }
  }
  /** @param {string[]} ts */
  const familiesIn = ts =>
    new Set(ts.filter(t => familyOfWord.has(t)).map(t => familyOfWord.get(t)));

  const queryTerms = [...new Set(terms(query))];
  const headFamilies = familiesIn(terms(String(query).split(HEAD_END)[0] ?? ''));
  const namedFamilies = familiesIn(queryTerms);

  return docs
    .map(({page, family, bag}) => {
      let score = 0;
      let hits = 0;
      for (const t of queryTerms) {
        const direct = idf(t) * (bag.get(t) ?? 0);
        let viaSynonym = 0;
        for (const s of SYNONYMS_OF.get(t) ?? []) {
          if (queryTerms.includes(s)) continue;
          viaSynonym = Math.max(viaSynonym, SYNONYM_SHARE * idf(s) * (bag.get(s) ?? 0));
        }
        const value = Math.max(direct, viaSynonym);
        if (value > 0) {
          score += value;
          hits++;
        }
      }
      const familyNamed = namedFamilies.has(family);
      if (headFamilies.has(family)) score += HEAD_FAMILY;
      else if (familyNamed) score += BODY_FAMILY;
      if (familyNamed && normalized(page.name) === normalized(family)) {
        score += FAMILY_BASE;
      }
      return {name: page.name, score, hits, familyNamed};
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.name.split('-').length - b.name.split('-').length ||
        a.name.localeCompare(b.name),
    );
}

/**
 * The next closest templates after the start, best first: the ones a reader
 * should check the idea against when the start's shape is wrong. Each matched
 * at least one term and scored at least half of what a start needs.
 *
 * @param {RankedPage[]} ranked
 * @param {string} startName
 * @param {number} [count]
 * @returns {RankedPage[]}
 */
export function pickAlternatives(ranked, startName, count = 2) {
  return ranked
    .filter(r => r.name !== startName && r.hits > 0 && r.score >= START_SCORE / 2)
    .slice(0, count);
}

/**
 * The template to start from, or null when the best one has too little
 * evidence to lead and the page should start from the app shell.
 *
 * @param {RankedPage[]} ranked
 * @returns {RankedPage | null}
 */
export function pickStart(ranked) {
  const top = ranked[0];
  if (!top || top.score < START_SCORE) return null;
  return top.hits >= START_TERMS || top.familyNamed ? top : null;
}
