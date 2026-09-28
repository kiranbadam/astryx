// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file build.kit leaf — the page template to start from, and the kit around it.
 *
 * Every kit names a page template to START from: the direct match when search
 * finds one, else the page the page ranker (rank.mjs) puts first, else the app
 * shell. A template carries the page frame, the spacing, and the section
 * rhythm; a page composed from components carries none of that, so the kit
 * never recommends composing from scratch while a template exists. Around the
 * start it groups the unified search into the closest page templates, the
 * blocks that cover parts, and the domain components to fill gaps, plus the
 * always-on frame + foundation names.
 *
 * The kit carries RAW `SearchResultEntry` objects and static name arrays only —
 * never pre-formatted command strings. All CLI prefixing (formatCliCommand /
 * getCliInvocation) and the section prose live in the command renderer, so the
 * JSON shape stays package-manager-agnostic and stable across environments.
 *
 * Two commands are the kit's own: `start.command`, the scaffold (`astryx
 * template <name> <path>`, with `<path>` a placeholder), and the `--skeleton`
 * a page entry carries when it is not a direct match, so a loose page reads
 * as a layout preview rather than the thing to build. Neither is prefixing —
 * the invocation stays the renderer's job.
 */

import {search} from '../../search/search.mjs';
import {getResultCoverage} from '../../search/coverage.mjs';
import {loadPageTemplates} from '../_adapter.mjs';
import {pickStart, rankPages} from './rank.mjs';

/** A page at/above this score is a confident direct match. */
const PAGE_DIRECT = 95;
/** Below this a page is too weak to offer at all. */
const PAGE_FLOOR = 50;
/**
 * Below this a block/domain-component match is incidental noise. A single
 * description word in a multi-word idea scores 50 plus at most 7.5 of coverage
 * garnish, so it stays below; a name or keyword hit clears it. `build "weekly
 * brief"` used to offer Toast, Popover and TextInput because their
 * descriptions say "brief".
 */
const DOMAIN_FLOOR = 60;
/**
 * How much of a multi-word query a page must cover to be offered on breadth.
 *
 * Score alone cannot carry this. A page's derived keywords include every
 * component its source renders, so `build "actionable warning banner"` once
 * scored `login`, `contact-form` and `documentation-design` at 95 apiece — an
 * exact hit on "banner" alone, plus the coverage garnish. Matching one of
 * three concepts is not the same claim as matching three.
 */
const PAGE_COVERAGE = 0.5;
/**
 * Fewer offerable results than this and the kit says how to look further.
 *
 * Three is the point below which a kit stops being a starting point. An agent
 * that reads a near-empty kit does not conclude "my wording was wrong" — it
 * concludes the package has nothing and falls back on its own memory of what
 * Astryx contains, which is exactly the failure `build` exists to prevent.
 */
const THIN_KIT = 3;
/**
 * Where a page starts when no page template matched: the first of these the
 * project can scaffold. A top nav over empty, full-width content is the least
 * opinionated frame that still has navigation; `blank` is the floor, with no
 * chrome at all. Either one still hands the reader a page frame and its
 * padding, which composing from components does not.
 */
const FALLBACK_STARTS = ['shell-top-nav', 'blank'];

/**
 * Always-surfaced primitives. Every page needs a shell + layout/typography/
 * action atoms, but these never keyword-match an idea ("dashboard" != "Stack"),
 * so search alone never returns them. Kept here (not the renderer) because they
 * are ALSO used to exclude these names from the idea-specific `domain` group.
 * Every page template already uses them.
 */
const FRAME = ['AppShell', 'TopNav', 'SideNav', 'Layout'];
const FOUNDATION = [
  'VStack',
  'HStack',
  'Grid',
  'StackItem',
  'Card',
  'Section',
  'Text',
  'Heading',
  'Button',
  'Icon',
  'Badge',
  'Divider',
];
const ALWAYS = new Set([...FRAME, ...FOUNDATION]);

/**
 * How to turn the scaffolded template into the page. Carried as data so a
 * JSON caller gets the same guidance the terminal shows. The spacing in a
 * template is the part a reader is most likely to lose by "cleaning up", so
 * the rules say what to keep before what to change.
 */
const ADAPT = [
  "Keep the template's page frame, region widths, and gap and padding values. They are the spacing; do not re-derive them.",
  'Replace the sample data, copy, and section contents with your own. Keep the section order unless your page needs another.',
  'Delete whole sections you do not need. For a part the template lacks, put a block from this kit inside a section.',
  'Do not rebuild the layout from components, and do not add <div> or CSS for spacing.',
];

/**
 * @typedef {import('../../search/search.type.mjs').SearchResultEntry} SearchResultEntry
 * @typedef {import('../build.type.mjs').BuildStart} BuildStart
 * @typedef {import('../build.type.mjs').BuildTemplateFamily} BuildTemplateFamily
 * @typedef {import('../_adapter.mjs').PageTemplate} PageTemplate
 */

/**
 * The page templates grouped by the family their own `category` names (the
 * text before " - "). Derived from each template's descriptor, never from a
 * list kept here, so an integration's templates join their family by
 * declaring it. Templates without a category group under "Other".
 *
 * @param {PageTemplate[]} catalog
 * @returns {BuildTemplateFamily[]}
 */
function familiesOf(catalog) {
  /** @type {Map<string, {name: string, variant: string}[]>} */
  const byFamily = new Map();
  for (const t of catalog) {
    const [head, ...rest] = t.category.split(' - ');
    const family = head.trim() || 'Other';
    const variant = rest.join(' - ').trim() || t.displayName;
    const members = byFamily.get(family) ?? [];
    members.push({name: t.name, variant});
    byFamily.set(family, members);
  }
  return [...byFamily.entries()]
    .sort(
      ([a], [b]) =>
        Number(a === 'Other') - Number(b === 'Other') || a.localeCompare(b),
    )
    .map(([family, templates]) => ({
      family,
      templates: templates.sort((a, b) => a.name.localeCompare(b.name)),
    }));
}

/**
 * The template to start from: search's direct match when there is one, else
 * the ready page the ranker puts first when it has the evidence to lead, else
 * the first fallback shell the project can scaffold. Null only when the
 * project has no page template to offer at all.
 *
 * A direct match leads only when its template is ready. The ranker sees only
 * ready templates, so neither path starts a page from one still marked not
 * ready; such a template stays listed in `pages`, where a reader who asked for
 * it by name still finds it.
 *
 * @param {string} query
 * @param {SearchResultEntry[]} pages
 * @param {boolean} directMatch
 * @param {PageTemplate[]} catalog
 * @returns {BuildStart | null}
 */
function chooseStart(query, pages, directMatch, catalog) {
  if (directMatch && catalog.some(t => t.name === pages[0].name)) {
    const top = pages[0];
    return {
      name: top.name,
      displayName: top.displayName ?? top.name,
      description: top.description,
      command: `astryx template ${top.name} <path>`,
      basis: 'direct',
      reason: 'This page template matches the idea directly.',
    };
  }
  // A direct match that is not ready yet is still named, so the reader knows
  // why the kit starts elsewhere.
  const unready = directMatch ? pages[0].name : null;
  const pick = pickStart(rankPages(query, catalog));
  const closest = pick && catalog.find(t => t.name === pick.name);
  if (closest) {
    return {
      name: closest.name,
      displayName: closest.displayName,
      description: closest.description,
      command: `astryx template ${closest.name} <path>`,
      basis: 'closest',
      reason: unready
        ? `\`${unready}\` matches the idea but is not ready yet; this is the closest ready page template.`
        : 'No page template matches the idea exactly; this one has the closest layout.',
    };
  }
  for (const id of FALLBACK_STARTS) {
    const shell = catalog.find(t => t.name === id);
    if (shell) {
      return {
        name: shell.name,
        displayName: shell.displayName,
        description: shell.description,
        command: `astryx template ${shell.name} <path>`,
        basis: 'fallback',
        reason: unready
          ? `\`${unready}\` matches the idea but is not ready yet, so the page starts from the app shell.`
          : 'No page template matched the idea, so the page starts from the app shell.',
      };
    }
  }
  return null;
}

/**
 * The page template to start from, and the kit around it.
 *
 * @param {string} query what you're building (e.g. "analytics dashboard")
 * @param {{cwd?: string, type?: import('../../search/search.type.mjs').SearchDomain, limit?: number}} [options]
 * @returns {Promise<import('../build.type.mjs').BuildKitResponse>}
 */
export async function buildKit(query, options = {}) {
  const {cwd = process.cwd(), type, limit = 60} = options;
  // search()'s JSDoc @returns widens results to object[]; the SearchResponse
  // shape is the contract (api/search/search.type.mjs). Cast locally rather than
  // tightening the search @returns (a separate follow-up).
  const result =
    /** @type {import('../../search/search.type.mjs').SearchResponse} */ (
      await search(query, {cwd, type, limit})
    );
  const results = result.data.results;
  // The TOTAL number of matches, not the number that survived `limit`. The kit
  // below is deliberately small (≤3 pages, ≤5 blocks, ≤6 components) and
  // `results` is itself capped, so every other count here is a cap; this is the
  // one field that says how much the query actually matched.
  const matchCount = result.data.matchCount;

  /**
   * Did this result answer enough of the query to stand as a page on breadth?
   * Single-concept queries have nothing to cover, so they always pass. Coverage
   * stays in a module-private WeakMap and never enters public search/build JSON.
   * @param {object} r
   */
  const covers = r => {
    const coverage = getResultCoverage(r);
    const total = coverage?.total ?? 1;
    if (total <= 1) return true;
    return (coverage?.matched ?? 0) / total >= PAGE_COVERAGE;
  };

  const matchedPages = results
    .filter(
      r =>
        r.domain === 'template' &&
        r.kind !== 'block' &&
        r.score >= PAGE_FLOOR &&
        covers(r),
    )
    .slice(0, 3);
  const blocks = results
    .filter(
      r =>
        r.domain === 'template' &&
        r.kind === 'block' &&
        r.score >= DOMAIN_FLOOR,
    )
    .slice(0, 5);
  const domain = results
    .filter(
      r =>
        (r.domain === 'component' || r.domain === 'hook') &&
        r.score >= DOMAIN_FLOOR &&
        !ALWAYS.has(r.name),
    )
    .slice(0, 6);
  const directMatch =
    matchedPages.length > 0 && matchedPages[0].score >= PAGE_DIRECT;

  /**
   * On a loose match, a page entry's `command` previews the layout rather
   * than printing the whole template: `--skeleton` gives the shape without
   * presenting the page as the thing to build. The recommendation itself is
   * `start`, which always scaffolds. Copied rather than mutated: these entries
   * come from `search()` and are not this function's to modify.
   */
  const pages = directMatch
    ? matchedPages
    : matchedPages.map(page => ({...page, command: `${page.command} --skeleton`}));

  // A kit narrowed to components or hooks has no page to start from; every
  // other kit does, so the reader is never left to compose a page from scratch.
  const wantsPages = !type || type === 'template';
  const catalog = wantsPages ? await loadPageTemplates(cwd) : [];
  const start = wantsPages
    ? chooseStart(query, matchedPages, directMatch, catalog)
    : null;
  // When the start is not a direct match, the reader may know a closer layout
  // than keyword search found. Name every page template, by family, so that
  // choice is one look away instead of a 2,000-line `template --list`.
  const families =
    start && start.basis !== 'direct' && catalog.length > 0
      ? familiesOf(catalog)
      : undefined;

  // What to try when the kit comes back thin. Keyword search over a design
  // system misses in a predictable way — the reader's words and the package's
  // often do not overlap — so name the two commands that browse rather than
  // search, and say plainly that this is not semantic matching.
  //
  // STRUCTURED, not prose: `commands` are bare subcommands, because the API
  // cannot know how the caller invokes the CLI. Baking `astryx component
  // --list` into the text hands a pnpm-workspace reader a command that does
  // not resolve — the same defect `getCliInvocation` exists to prevent, and
  // the renderer applies it. A JSON caller gets the parts, not a sentence.
  const hint =
    pages.length + blocks.length + domain.length < THIN_KIT
      ? {
          reason:
            'Few matches. This is keyword search, not semantic — try other wordings.',
          commands: ['component --list', 'template --list'],
        }
      : undefined;

  return {
    type: 'build.kit',
    data: {
      query: result.data.query,
      // Distinguishes "search found nothing" from a weak-but-non-empty result
      // set. Either way the kit still names a template to start from.
      hasResults: matchCount > 0,
      matchCount,
      directMatch,
      start,
      adapt: ADAPT,
      pages,
      blocks,
      domain,
      families,
      frame: FRAME,
      foundation: FOUNDATION,
      hint,
    },
  };
}
