// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file Colocated types for the `build` command — source of truth for the
 * `build.help` (playbook) and `build.kit` (composition kit) JSON responses.
 */

/**
 * A command the playbook tells the caller to run.
 *
 * @typedef {object} BuildPlaybookCommand
 * @property {string} command Bare subcommand with `<placeholder>` arguments (e.g. `template <name> <path>`) and no package-manager prefix — render it with your own CLI invocation.
 * @property {string} [purpose] What running it is for.
 */

/**
 * One step of the page-building workflow.
 *
 * @typedef {object} BuildPlaybookStep
 * @property {string} title What to do.
 * @property {BuildPlaybookCommand[]} commands The commands for this step, in the order to run them.
 * @property {string} [returns] What the step's command gives back, when that decides the next step.
 */

/**
 * astryx --json build (no query) — the "how to build a page" playbook.
 *
 * @typedef {object} BuildHelpResponse
 * @property {'build.help'} type
 * @property {object} data
 * @property {true} data.playbook Always true; marks this envelope as the playbook rather than a result set.
 * @property {string} data.title The playbook's heading.
 * @property {BuildPlaybookStep[]} data.steps The workflow, in order.
 * @property {string[]} data.rules The rules that keep a page on-system.
 * @property {BuildPlaybookCommand[]} data.related Lookups to reach for alongside the workflow.
 */

/**
 * The page template a kit recommends starting from.
 *
 * @typedef {object} BuildStart
 * @property {string} name Template id, as `astryx template <name>` takes it.
 * @property {string} displayName Human-facing template name.
 * @property {string} description What the page is: its layout and the ideas it serves.
 * @property {string} command The scaffold command, `astryx template <name> <path>`: `<path>` is a placeholder for the file or folder to write the template to, and the `astryx` prefix is for the caller to replace with its own invocation.
 * @property {'direct' | 'closest' | 'fallback'} basis Why this template: `direct` when it is the kit's direct match (`directMatch`) and ready; `closest` when the page ranker, which weighs every matched word by how rare it is among page templates and favors the family the idea's head names, puts it first with enough evidence to lead; `fallback` when nothing does and the page starts from the app shell.
 * @property {string} reason One sentence saying the same as `basis`, for a reader.
 */

/**
 * The page templates of one family, named by the text before " - " in each
 * template's own `category`.
 *
 * @typedef {object} BuildTemplateFamily
 * @property {string} family Family name (e.g. `Dashboard`); `Other` for templates without a category.
 * @property {{name: string, variant: string}[]} templates Each template's id and its variant: the text after " - " in its category, or its display name when the category has none.
 */

/**
 * astryx --json build "<idea>" — the page template to start from, and the kit around it.
 *
 * Entries are raw `SearchResultEntry` objects (no package-manager-prefixed
 * command strings — the CLI adds those); `frame`/`foundation` are static
 * component-name arrays surfaced on every kit.
 *
 * @typedef {object} BuildKitResponse
 * @property {'build.kit'} type
 * @property {object} data
 * @property {string} data.query
 * @property {boolean} data.hasResults False when search returned nothing. The kit still names a template in `start`.
 * @property {number} data.matchCount Total ranked search matches for the query — counted before the search `limit`, the kit's score floors, and its per-group caps, so it is never a cap read back.
 * @property {boolean} data.directMatch True when the top page template is a confident direct match.
 * @property {BuildStart | null} data.start The page template to start from: the direct match, else the ranker's closest ready page, else the app shell. Null only when the kit is narrowed to components or hooks (`type`), or when the project has no page template to offer.
 * @property {string[]} data.adapt How to adapt the scaffolded template into the page, in order: what to keep, what to replace, what to delete, and what not to do.
 * @property {import('../search/search.type.mjs').SearchResultEntry[]} data.pages Closest page templates by search (≤3). Each entry's `command` carries `--skeleton` when `directMatch` is false, so it previews the layout; `start.command` is the scaffold.
 * @property {import('../search/search.type.mjs').SearchResultEntry[]} data.blocks Drop-in block patterns covering parts of the idea (≤5).
 * @property {import('../search/search.type.mjs').SearchResultEntry[]} data.domain Idea-specific components/hooks (≤6), excluding frame/foundation.
 * @property {BuildTemplateFamily[]} [data.families] Every ready page template, grouped by family. Present when `start` is not a direct match, so a reader who knows a closer layout than keyword search found can pick it.
 * @property {string[]} data.frame Always-on page-shell component names. Every page template already uses them.
 * @property {string[]} data.foundation Always-on layout/typography/action component names. Every page template already uses them.
 * @property {{reason: string, commands: string[]}} [data.hint] Present only when the kit is thin. `reason` says why, `commands` are bare subcommands (e.g. `component --list`) for the caller to render with its own invocation — so a reader is never handed a command that does not resolve in their project.
 */

/**
 * Options for `build()`.
 * @typedef {object} BuildOptions
 * @property {string} [cwd]
 * @property {import('../search/search.type.mjs').SearchDomain} [type]
 * @property {number} [limit]
 */

export {};
