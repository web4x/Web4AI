# robbin-expert Context — Save Point 2026-06-01 (SM 710k warning)

**Role**: Web4RawBin Implementation Authority
**Status**: T142-T146 shipped. Standing by.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.42 (pushed). 834/834 tests pass.

## Latest commits
- 48eb52a v0.5.42 T145 follow-up: ViewBus subscribers (3 components)
- f549114 v0.5.41 T145: User 9th class + ViewBus singleton
- 7fbfd8e T146: requirement NAME-first + <details> + validator
- 6f5cf89 v0.5.40 T143 AC2: chain links → speaking-name hrefs (SlugResolver)
- 4e79afa v0.5.39 T143 AC2: TraceNode.slug field
- 0101980 v0.5.38 T144 AC2: 🔗 href → /edit/
- 5da4054 v0.5.36 T144: file-browser 3 fixes
- 84f3915 v0.5.37 T143: trace-tree module + clickable links
- dc9187f v0.5.35 T142: vCard upload + drag-drop
- Earlier: T128.2 (S2-S9 migration), T128.4 (impl markers), T138-T141, T132-T136

## Scenario module (src/ts/scenario/)
types · classes (9: +User) · index-store (5-level) · templates (9 templates + renderStatusHtml + renderChainSection + SlugResolver) · generator · ior-resolver · task-fsm · trace-link · skills · source-location · trace-tree

## Client additions
- ViewBus.ts: pub/sub singleton (subscribe/publish by class+uuid)
- vcard-parse.ts: RFC 6350 FN/TEL/URL/PHOTO parser
- ProfileEditor: vCard import + viewBus.publish on save
- rb-member-badge: viewBus.subscribe → live name update
- ProfileSheet: viewBus.subscribe on open
- RoomBrowser: viewBus.subscribe → lobby name input

## Standing rules
- Planner stands up T-numbers first
- Version bump #66 on surface changes; STATIC_SHELL #67 on bundle hash change
- impl:uuid markers: ALWAYS // or inside /** */ (NEVER bare *)
- implementing [x] before commit; report to robbinTeam:0.0
- Re-generate views after template changes
- Task files = single source of truth (CMM4)
- Findings INTO task files, reference file path in chat

## Deploy
otmux send iphone:0.1 C-c (x2) → git stash; git pull; npm run build; npm run dev → /api/health
