# robbin-expert Context — Save Point 2026-06-01 (pre-rewind)

**Role**: Web4RawBin Implementation Authority
**Status**: T142-T156 shipped. v0.5.54 pushed. Standing by for T157.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.54 (pushed). 834/834 tests pass.

## Session commits (latest first)
- b7f1919 v0.5.54 T156: Retry button connection-failed
- 75af5ea v0.5.53 T155: Requirement bidirectional closure tasks[]+tests[]
- e3ae6ea v0.5.52 T154: Requirement data quality name/description/tasks[]
- a9f9571 v0.5.51 T153 R-resolution: altId on requirements + UC req refs
- 0365ff1 v0.5.50 T153: UC class refs from PUML arrows
- d3ec388 v0.5.48 T151: MD Traceability → JSON arrays (815/815)
- 1b62d75 v0.5.49 T152: UC data quality object/verb + PUML refs + S16
- 1478924 v0.5.46 T149 slug-fix: full UUID tracelinks
- b55abd8 v0.5.45 T149: per-class symlink subdirs
- eec6515 v0.5.44 T148: clickable breadcrumb
- 111f0c8 v0.5.43 T147: scenarioLink on sprints.md/
- 18a28ff v0.5.47 T150: breadcrumb contrast WCAG AA
- 5da4054 v0.5.36 T144: file-browser 3 fixes
- 84f3915 v0.5.37 T143: trace-tree module
- 6f5cf89 v0.5.40 T143 AC2: SlugResolver speaking-name hrefs
- dc9187f v0.5.35 T142: vCard upload + drag-drop
- f549114 v0.5.41 T145: User 9th class + ViewBus
- 48eb52a v0.5.42 T145: ViewBus subscriber wiring
- 7fbfd8e T146: requirement NAME-first + details + validator
- Earlier this session: S16 T110-T117, T118-T141, T125-T128, T132-T140

## Scenario module (src/ts/scenario/)
types · classes (9: +User) · index-store (5-level) · templates (9+TraceLinkTemplate + renderStatusHtml + renderChainSection + SlugResolver + setActiveResolver) · generator · ior-resolver · task-fsm · trace-link · skills · source-location · trace-tree

## Migration scripts (scripts/)
- migrate-to-scenario.ts: --sprint / --fix-uc-quality / --fix-req-quality / --fix-req-closure
- migrate-chain-to-json.ts: MD Traceability → JSON arrays
- test-data-purge.ts / regenerate-views.ts

## Client additions
ViewBus.ts · vcard-parse.ts · ProfileEditor (vCard+viewBus) · rb-member-badge (viewBus sub) · ProfileSheet (viewBus sub) · RoomBrowser (viewBus sub)

## Migrated scenario data
S1+S2-S9+S16+S17 migrated. ~200+ index units. Per-class symlink subdirs. 280+ views.
32 Requirements with altId+name+description+tasks[]+tests[]. 30 UCs with object/verb/classes[]/requirements[]. 92 Tasks with links{up,down,follows,changes}+chain{requirements,useCases,puml,classMethods}.

## Standing rules
- Planner stands up T-numbers first
- Version bump #66 on surface changes; STATIC_SHELL #67 on bundle hash
- impl:uuid: ALWAYS // or inside /** */ (NEVER bare *)
- implementing [x] before commit; report to robbinTeam:0.0
- Re-generate views after template changes
- Task files = single source of truth (CMM4)
- DRY-RUN first for data migrations; refine until 0 mismatches; THEN apply

## Deploy
otmux send iphone:0.1 C-c (x2) → git stash; git pull; npm run build; npm run dev → /api/health
