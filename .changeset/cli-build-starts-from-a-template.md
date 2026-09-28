---
'@astryxdesign/cli': patch
---

[feat] `astryx build "<idea>"` now always names a page template to start from, and says how to adapt it.

A page template carries the page frame, the spacing, and the section rhythm. A page composed from components has to rediscover them. Before, the kit recommended scaffolding only when a template matched almost by name. Other ideas got "use it as a layout reference", which pointed at a 35-line `--skeleton`, and an idea that no template matched got "frame with AppShell, then compose". Now:

- `start` names the template to scaffold, with its `template <name> <path>` command and a `basis`: `direct` (the kit's direct match), `closest` (the page template a new page ranker puts first), or `fallback` (nothing is close enough, so the page starts from the `shell-top-nav` app shell, or `blank` when that is not available). A template that is not ready yet is never the start.
- `start.alternatives` names the next two closest page templates, each with a one-line shape, when the start is not a direct match. The reader judges meaning better than keyword matching does.
- `adapt` says how to turn the template into the page: keep its frame, gap, and padding; replace its content; delete the sections you do not need; put blocks inside sections for the parts it lacks.
- `families` lists every ready page template, grouped by the family its own category names, when the start is not a direct match. A reader who knows a closer layout can pick it without a full `template --list`.
- The page ranker is built for the long ideas builders write ("ops dashboard with a KPI row, a sortable table and a trend chart"). Every matched word counts, weighted by how rare it is among page templates, so one incidental word no longer decides; the words before the first "with", ":" or "," name the page's family; and a family's base template (`dashboard`, `settings`) leads its family unless a variant's own words outweigh it. Family words come from the templates' own ids and categories. `pages` and `directMatch` are unchanged.
- Blocks and components that matched only one description word of a multi-word idea are no longer offered.
- The text output leads with START FROM, NEXT CLOSEST, and ADAPT IT (they replace RECOMMENDED START), lists search's other page templates only beside a direct match, prints only the first sentence of block and component descriptions, and labels the frame and foundation primitives as gap fillers. The recommended command is now `template <name> <path>`, not `template <name> --skeleton` or `component AppShell`.

The `build` playbook, the generated agent docs, and the `working-with-ai` and `layout` guides now start every page from a template.

Compatibility: the `build.kit` JSON only gains fields (`start`, `adapt`, `families`, and `start.alternatives`). Every existing field keeps its shape and meaning. Which blocks and components are listed changes with the raised floor, as ranking results do. The human-readable output is reorganized. Options, exit codes, and the `build.help` shape are unchanged, and `build` still writes nothing.

@josephfarina
