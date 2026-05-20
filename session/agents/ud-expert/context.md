# ud-expert Context — Save Point 2026-05-15

**Role**: Web4AI Implementation Authority (UpDown QnD multiplayer)
**Status**: Queue empty, standing by
**Machine**: Mac Studio
**Pane**: upDownTeam:0.2

## Team Layout
- upDownTeam:0.0 — ud-po (quality owner)
- upDownTeam:0.1 — ud-architect (specs, analysis)
- upDownTeam:0.2 — ME (ud-expert)
- upDownTeam:0.3 — ud-tester
- upDownTeam:0.4 — expert-shell (Web4 initialized)

## Code Locations
- **Source**: `/Users/Shared/Workspaces/2cuGitHub/UpDown/qnd/`
- **Server**: `src/ts/server/server.ts`, `src/ts/server/GameRoom.ts`
- **Client**: `src/public/ts/MultiplayerUI.ts`, `src/public/ts/LobbyUI.ts`, `src/public/ts/WebSocketClient.ts`
- **Shared**: `src/ts/shared/MessageTypes.ts`, `CardUtils.ts`, `ScoreCalculator.ts`, `SpecialCardInfo.ts`
- **HTML pages**: `src/public/index.html`, `index-js.html`, `index-ts.html`, `multiplayer.html`
- **CSS**: `src/public/multiplayer.css`
- **Profiles**: `data/profiles.json`
- **Task files**: `scrum.pmo/sprints/sprint-3-qnd-multiplayer-game/`

## Build Commands
```bash
npm run build    # esbuild client bundles
npm run stop     # stop server
npm start        # build + start server
npx vitest run   # ~9 min, WS integration tests
```

## Vitest Baseline
- 58-60 tests across 15 files
- 2-3 pre-existing flaky failures (uc-r7 join-full, uc-r9 join-rejected, occasionally uc-p1 early-resolution, uc-s1 spectator)
- NEVER restart server mid-vitest — causes 15-40 false failures

## Completed Tasks This Session

### Sprint 3 Features
| Task | Summary |
|------|---------|
| T43 | Share link includes room name |
| T44 | Finished rooms show Remove button for all players |
| T45 | Stale room auto-disposal (tightened criteria + broadcast) |
| T56 | Chat duplication fix (moved 5 client.on to constructor) |
| T58 | Split card chooser (suit + value pickers), avatar preview |
| T59 | Profile photo fixes (upload quota, self avatar in player list + popup) |
| T60 | Player identity token (UUID, dedup, client avatar to server) |
| T62 | Device tracking (IDENTIFY message, profiles.json, device list in popup) |
| T67 | Button press feedback + double-press protection (guardClick utility) |
| T68 | HOST_CHANGED re-renders game controls mid-game |
| T69 | Ghost player purge in resetForReplay() |
| T70 | Back to lobby cleans URL params |
| T71 | Header click cleans URL before reload |
| T78 | Home button (🏠) + fullscreen button (⛶) in headers |
| T79 | Version display, version-click project nav, /docs markdown renderer |
| T81 | Player level shown above special cards |
| T82 | Highscore leaderboard (/leaderboard page, /api/leaderboard, game result recording) |
| T83 | Host elimination auto-enables countdown |
| T84 | Chat multiline (white-space pre-wrap, XSS fix, lorem test) |
| T85 | Leaderboard own page with REST API |
| T86 | User profile page (/profile), 4-digit secret code, device consolidation, TOKEN_REDIRECT |
| T87 | Bug report button → otmux send to PO (execFile, sanitize, fallback) |
| T87.2 | Bug report includes reporter UUID |

### DRY Refactoring
| Task | Summary |
|------|---------|
| T29 | shared/CardUtils.ts (suitSymbol, cardColor, cardToHtml, cardText) |
| T30 | shared/ScoreCalculator.ts (calculateScore, calculateDiamonds) |
| T31 | shared/SpecialCardInfo.ts (SPECIAL_CARD_CATALOG, CARD_INFO_MAP) |

### Bug Fixes
| Bug | Summary |
|-----|---------|
| Keybinding Game 2 | eliminated flag one-way in ROUND_START — now derived each round |
| Enforce Result | Click handler hardcoded innerHTML — now calls renderGame() |
| Eliminated host deadlock | New branch for eliminated host with countdown off |
| Room name stale | Create Room button refreshes room name input |
| Private room keys | Share links + auto-join include room key |
| BR-001 | Secret code editable in lobby + /profile |
| BR-002 | Pre-T86 profiles backfilled with secretCodes on load |
| BR-003 | /profile: full token, device IP, code propagation |

## Key Patterns
- `guardClick(btn, asyncFn)` — disable+loading during execution, re-enable in finally
- `localAvatarHtml(size)` — reads localStorage avatar for self player rendering
- `createChatBubble()` — XSS-safe chat rendering via textContent
- Server pages (/profile, /leaderboard, /bug-report) are inline HTML in server.ts route handlers
- `execFile` (not exec) for bug report → otmux send (injection-safe)
- Self-report via: `otmux send upDownTeam:0.0 "T{N} DONE — ..." Enter`
