# ud-tester Context — 2026-05-18

## Identity
**ud-tester** — testing authority for UpDown/Web4AI. 42 pair with ud-expert.

## Team Layout (upDownTeam)
- 0.0 = ud-po | 0.1 = ud-architect | 0.2 = ud-expert | 0.3 = ud-expert-shell
- 0.4 = ME (ud-tester) | 0.5 = ud-tester-shell (server runs here)

## Base Paths
- Components: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`
- QnD game: `/Users/Shared/Workspaces/AI/Claude/workspaces/UpDown/qnd/`
- Scrum: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/scrum.pmo/`

## Playwright Setup
- Installed in qnd/: `@playwright/test` + Chromium headless
- Screenshots: `qnd/test/visual/screenshots/`
- Run: `cd qnd && npx playwright test test/visual/css-consistency.spec.ts --reporter=list`
- Persistent context for token tests: `chromium.launchPersistentContext('/tmp/playwright-xxx', {...})`
- enterGame: "Create Room" → "Create" nth(1) → "Add Bot" → "Start Game"
- Chat send button outside viewport — use `page.evaluate()` to click, not Playwright click
- Home button 🏠: `a[href="/"]` in header
- Room join: `button.btn-join[data-room="2p"]`

## Completed Verifications

### Sprint 1 — De-monolithization
- Phase 6 T1-T8: ALL PASS (13 @web4x components)
- Tootsie tests: Persistence + W4TSC import — PASS
- Task 7 (TypeM3, tsUnitCreate, PumlUnitConverter, GitTextIOR, tsc) — ALL PASS
- Task 6.7 PUML SVG: 12/13 PASS
- Task 2.3 CLI self-register: 13/13 PASS
- Task 4.3 info+links: PASS

### Sprint 3 — QnD Multiplayer
- Task 32.6 UUID traceability: 5/5 PASS
- Task 34.2 Share links: 7/7 PASS
- Task 35.5 Room replay: 6/6 PASS (chat fix verified)
- Task 36 Bot replay: 2/3 PASS (isBot flag missing)
- Task 38.14.3 Persistent feedback: PASS
- Task 38.20 Visual CSS (Playwright): 6/6 PASS
- Task 38.21 Text color: 3/3 verifiable PASS
- Task 42 Card played mode: 5/7 PASS (step 6 inconclusive — game ends round 1)
- Task 43 Share link room name: PASS
- Task 44 Remove button: PASS
- Task 45 Stale cleanup: INCONCLUSIVE
- Task 49.5 Card played protocol: 2/2 PASS
- Task 56 Keyboard single-fire: PASS (3 games)
- Task 57 WS status dot: 3/3 PASS (green→red→click→green)
- Task 58 Profile edit: PASS (✏️ panel with name/phone/url/card avatars)
- Task 60.5 Device tracking: 2/3 PASS (profile popup works, device list shows)
- Task 62.6 Device tracking popup: PASS (💻 Mac 414x896 · MacIntel · 3x)
- Task 69 Leave/rejoin dedup: PASS (vitest)
- Task 70 Leave URL clean: PASS
- Task 71 Header reload clean URL: PASS
- Task 78 Home button: PASS (🏠 in lobby+game → /)
- Task 79 Landing page: PASS (version+branch, JS/TS/MP buttons, docs nav)
- Task 81 Player level: PASS (Lv.2 visible)
- Task 82 Leaderboard: PASS (🏆→/leaderboard, ranked players with 💎/W/G)
- Task 83 Host elimination: PASS (countdown auto-enables, spectator view, game continues)
- Task 84 Multi-line chat: PASS (line breaks render)
- Task 85 Leaderboard page: PASS (/leaderboard with back button, medals)
- BR-002 Secret code: 2/3 PASS (profile shows code, editor editable, link account FAIL)

### Vitest Suite
- Latest: 54-55/58 PASS
- Pre-existing FAIL: R7 full room, R9 join during countdown, bot isBot flag, P1 early resolution
- Test file created: `uc-r10-leave-rejoin-dedup.test.ts` — PASS

## Key Learnings
- P25: Tootsie tests for components, vitest OK for QnD protocol tests
- P15: NEVER filter output
- Playwright fresh contexts have no persistent token — use launchPersistentContext for identity tests
- DefaultWeb4Requirement: `await req.init({model: {...}})` not direct assignment
- Chat send button outside viewport — use evaluate, not click
- `button.btn-join[data-room="2p"]` for preset room join
- `.mp-clickable` for player pill click (not generic player selector)
- Game often ends round 1 with bots — add multiple bots or use countdown OFF + Enforce for multi-round tests
- CMM4: report "Task XX VERIFIED — [what], gameplay unaffected, vitest XX/XX"
- If regression found that expert vitest missed → process finding, not just bug
