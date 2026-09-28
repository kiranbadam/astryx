// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file build command — thin wrapper with a stable result summary.
 *
 *   astryx build                  → the PLAYBOOK (how to build a page)
 *   astryx build "<what>"         → the TEMPLATE TO START FROM (always one: the
 *                                   closest page, or the app shell), how to adapt
 *                                   it, and the blocks and components around it.
 *
 * All grouping/scoring lives in api/build; this file only parses flags and
 * renders. Command strings are prefixed for the caller's package manager here
 * (never in the API payload) via formatCliCommand/getCliInvocation.
 */

import {
  getCliInvocation,
  formatCliCommand,
} from '../../../foundation/env/package-manager.mjs';
import {jsonOut} from '../../../foundation/response/json.mjs';
import {resultSet, resultSetOf} from '../../../foundation/debug/index.mjs';
import {
  emit,
  section,
  text,
  list,
  record,
  records,
} from '../formatters/index.mjs';
import {cliError} from '../lib/cli-error.mjs';
import {defineCommand} from '../lib/define-command.mjs';
import {build as buildApi} from '../../../api/build/build.mjs';
import {doc as buildCommand} from './build.doc.mjs';
import {doc as buildFn} from '../../../api/build/build.doc.mjs';

/**
 * Playbook commands as records whose field names are the JSON keys, so a
 * reader can grep `^command:`. The command is run with the caller's invocation.
 * @type {import('../formatters/index.mjs').RecordOptions}
 */
const COMMAND_RECORDS = {
  fields: ['command', 'purpose'],
  format: {command: command => formatCliCommand(command)},
};

/**
 * What to do with the start, by why it was chosen. It follows the kit's own
 * one-sentence `start.reason` in the START FROM heading.
 * @type {Record<'direct' | 'closest' | 'fallback', string>}
 */
const START_NEXT = {
  direct:
    'Scaffold it (replace <path> with the file or folder to write it to), then adapt it.',
  closest:
    'Start from it anyway: a close template keeps the frame and spacing that composing from components loses. If its shape is wrong, scaffold one from OTHER PAGE TEMPLATES or ALL PAGE TEMPLATES instead.',
  fallback:
    'The shell is a page frame with navigation and empty content. Fill it with blocks. If a template under ALL PAGE TEMPLATES has a closer layout, scaffold that one instead.',
};

/**
 * The first sentence of a description. Component descriptions run to
 * paragraphs; in a kit the reader needs what the thing is, and `--verbose` or
 * `component <Name>` has the rest. A period after "e.g" or "i.e" does not end
 * the sentence.
 * @param {string} description
 */
function firstSentence(description) {
  const flat = String(description ?? '').replace(/\s+/g, ' ').trim();
  const ends = /[.!?](?=\s|$)/g;
  for (let m = ends.exec(flat); m; m = ends.exec(flat)) {
    if (!/\b(e\.g|i\.e)$/i.test(flat.slice(0, m.index))) {
      return flat.slice(0, m.index + 1);
    }
  }
  return flat;
}

/**
 * One family as a line: `Dashboard: dashboard (Analytics), dashboard-scorecard, ...`.
 * The variant is dropped when the template's id already says it, so the line
 * carries only what the id does not.
 * @param {import('../../../api/build/build.type.mjs').BuildTemplateFamily} family
 */
function familyLine({family, templates}) {
  const names = templates.map(({name, variant}) => {
    const idWords = new Set(name.toLowerCase().split(/[^a-z0-9]+/));
    const redundant = variant
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .every(word => idWords.has(word));
    return redundant ? name : `${name} (${variant})`;
  });
  return `${family}: ${names.join(', ')}`;
}

/**
 * Emit the build playbook (shown when `build` is run with no query) — a
 * projection of the `build.help` data, so text and JSON carry the same steps.
 * @param {import('../../../api/build/build.type.mjs').BuildHelpResponse['data']} playbook
 */
function printPlaybook(playbook) {
  emit(
    section(playbook.title),
    ...playbook.steps.flatMap((step, i) => [
      section(`${i + 1}. ${step.title}`),
      records(step.commands, COMMAND_RECORDS),
      step.returns ? record({returns: step.returns}) : null,
    ]),
    section(`${playbook.steps.length + 1}. Rules (keep it on-system)`),
    list(playbook.rules),
    ...(playbook.related.length > 0
      ? [section('Related'), records(playbook.related, COMMAND_RECORDS)]
      : []),
  );
}

/**
 * @param {import('commander').Command} program
 */
export function registerBuild(program) {
  defineCommand(program, buildCommand, {
    fn: buildFn,
    action: async (
      /** @type {string | undefined} */ query,
      /** @type {{type?: import('../../../api/search/search.type.mjs').SearchDomain, limit?: string, verbose?: boolean}} */ options,
    ) => {
      const run = getCliInvocation();
      const json = program.opts().json || false;

      // No query → the playbook. Still routed through the API for the envelope.
      if (!query || !String(query).trim()) {
        const result =
          /** @type {import('../../../api/build/build.type.mjs').BuildHelpResponse} */ (
            await buildApi(undefined, {cwd: process.cwd()})
          );
        // The playbook is a document, not a lookup: one doc, always the same
        // one. Counting it as a result keeps "what did this run answer with"
        // true for the no-argument form too.
        const playbook = resultSet({count: 1, resultKind: 'doc'});
        if (json) {
          jsonOut(result);
          return playbook;
        }
        printPlaybook(result.data);
        return playbook;
      }

      // Arg validation stays in the CLI.
      // Parse --limit to a number; the API validates it (positive integer) and
      // throws ERR_INVALID_ARGUMENT, so we pass NaN through rather than
      // pre-rejecting with a generic code here (parity with `search`).
      const limit =
        options.limit != null ? Number.parseInt(options.limit, 10) : 60;

      /** @type {import('../../../api/build/build.type.mjs').BuildKitResponse} */
      let result;
      try {
        result =
          /** @type {import('../../../api/build/build.type.mjs').BuildKitResponse} */ (
            await buildApi(query, {
              cwd: process.cwd(),
              type: options.type,
              limit,
            })
          );
      } catch (e) {
        const err =
          /** @type {import('../../../api/error.mjs').AstryxError} */ (e);
        return cliError(err.message, {
          suggestions: err.suggestions,
          code: err.code,
        });
      }

      const {
        query: q,
        hasResults,
        matchCount,
        directMatch,
        start,
        adapt,
        pages,
        blocks,
        domain,
        families,
        frame,
        foundation,
        hint,
      } = result.data;
      // The kit spans domains, so its kind comes from the pieces themselves.
      // `start` (which may be the fallback shell), `families`, `frame` and
      // `foundation` are deliberately excluded: they are not what the query
      // matched.
      const answered = resultSetOf([...pages, ...blocks, ...domain], {
        count: matchCount,
        empty: !hasResults,
        directMatch,
        fallbackKind: options.type ?? 'mixed',
      });

      if (json) {
        jsonOut(result);
        return answered;
      }

      if (!hasResults && !start) {
        emit(
          text(`No matches for "${q}".`),
          text(`Try a broader term, or browse: ${run} component --list`),
        );
        return answered;
      }

      // Same JSON->text projection as search, but leaner: the section header
      // already says the kind, so drop `domain`/`import` by default (they're in
      // --json and under --verbose). Keeps each item to name/displayName/desc/cmd.
      const fields = options.verbose
        ? [
            'name',
            'domain',
            'displayName',
            'score',
            'reason',
            'import',
            'description',
            'command',
          ]
        : ['name', 'displayName', 'description', 'command'];
      // Pages keep their whole description: it is the layout, which is what a
      // reader compares. Blocks and components keep their first sentence.
      /** @type {import('../formatters/index.mjs').RecordOptions} */
      const pageOpts = {fields, format: {command: formatCliCommand}};
      /** @type {import('../formatters/index.mjs').RecordOptions} */
      const partOpts = options.verbose
        ? pageOpts
        : {
            fields,
            format: {command: formatCliCommand, description: firstSentence},
          };

      // A fallback start means search's pages were too weak to lead, so they
      // are not offered as alternatives — unless one was a direct match that
      // is not ready yet, which a reader who named it still needs to see.
      const otherPages =
        start && (start.basis !== 'fallback' || directMatch)
          ? pages.filter(p => p.name !== start.name)
          : [];

      // A short legend up top: what this output is, how to use it, and the exact
      // order of the sections below (only the ones actually present) so it reads
      // clearly and parses predictably.
      const sectionsOrder = start ? ['START FROM', 'ADAPT IT'] : [];
      if (otherPages.length) sectionsOrder.push('OTHER PAGE TEMPLATES');
      if (families?.length) sectionsOrder.push('ALL PAGE TEMPLATES');
      if (blocks.length) sectionsOrder.push('BLOCKS');
      if (domain.length) sectionsOrder.push('DOMAIN COMPONENTS');
      sectionsOrder.push('FRAME + FOUNDATION');
      // The legend promises the complete order, so a section emitted after it
      // has to be in it.
      if (hint) sectionsOrder.push('FEW MATCHES');

      /** @type {import('../formatters/index.mjs').Block[]} */
      const out = [
        section(`Build kit for "${q}"`),
        text(
          (start
            ? 'Start from a page template: it already has the page frame, spacing, and section rhythm. ' +
              'Scaffold the START FROM template into your project, then adapt it. Do not compose the page from components. ' +
              'Changing a page you already have? Keep it, and use the blocks and components below.\n'
            : 'This kit is narrowed by --type, so it names no page template to start from.\n') +
            `Sections in order: ${sectionsOrder.join(', ')}.`,
        ),
      ];

      if (start) {
        out.push(
          section('START FROM', `${start.reason} ${START_NEXT[start.basis]}`),
          record(start, {
            fields: ['name', 'displayName', 'description', 'command'],
            format: {command: formatCliCommand},
          }),
          section('ADAPT IT', 'Turn the scaffolded template into your page:'),
          list(adapt),
        );
      }
      if (otherPages.length) {
        out.push(
          section(
            'OTHER PAGE TEMPLATES',
            `If the start is the wrong shape, scaffold one of these instead: ${formatCliCommand('template <name> <path>')}`,
          ),
          records(otherPages, pageOpts),
        );
      }
      if (families?.length) {
        out.push(
          section(
            'ALL PAGE TEMPLATES',
            'Every page template, by family. Match on layout, not topic: numbers and charts are a Dashboard, rows of records a Table, long-form reading Content, a sequence of inputs a Form. ' +
              `If one has a closer layout than the start, scaffold it instead: ${formatCliCommand('template <name> <path>')}`,
          ),
          list(families.map(familyLine)),
        );
      }
      if (blocks.length) {
        out.push(
          section(
            'BLOCKS',
            'Drop-in patterns for parts the template lacks. Put each one inside a section.',
          ),
          records(blocks, partOpts),
        );
      }
      if (domain.length) {
        out.push(
          section(
            'DOMAIN COMPONENTS',
            'Components for what is left. Read their props before you use them.',
          ),
          records(domain, partOpts),
        );
      }

      // Last before the hint: every page template already uses these, so they
      // are for filling a gap, never for laying out the page.
      out.push(
        section(
          'FRAME + FOUNDATION',
          'Already inside every page template. Reach for them only to fill a gap.',
        ),
        record({frame, foundation}),
      );

      // Last, so it is the line the reader leaves with — and only when the kit
      // was thin enough that "the package has nothing" is the wrong conclusion.
      // The commands arrive bare and are rendered through the project's own
      // invocation, so they are runnable as printed.
      if (hint) {
        out.push(
          section(
            'FEW MATCHES',
            `${hint.reason}\nBrowse instead:\n${hint.commands
              .map(c => formatCliCommand(c))
              .join('\n')}`,
          ),
        );
      }

      emit(...out);
      return answered;
    },
  });
}
