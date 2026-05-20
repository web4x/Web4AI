# ud-expert Learnings — 2026-05-15

## Process
- **Self-report immediately** after every task via `otmux send upDownTeam:0.0 "T{N} DONE — ..." Enter`. Do NOT wait to be asked.
- `otmux send` WORKS from Bash tool — it is NOT tty-sensitive. Use double quotes for message.
- Never restart server while vitest is running — causes 15-40 false failures from killed WS connections.
- Run vitest in background (`run_in_background: true`) — tests take ~9 minutes.
- Always rebuild with `npm run build` before restart. Server uses tsx (live TS) but client needs esbuild.

## Architecture
- Client and server share code via `src/ts/shared/` — MessageTypes, CardUtils, ScoreCalculator, SpecialCardInfo.
- Import paths from `src/public/ts/` to `src/ts/shared/` are `../../ts/shared/X.js` (not `../../shared/`).
- Server-rendered pages (profile, leaderboard, bug-report) are inline HTML in route handlers — no separate HTML files.
- `playerToken` stored directly on RoomPlayer for reliable game result recording — don't rely on tokenToClient reverse lookup (fragile, cleared on disconnect).
- Profiles need field backfilling on load for backward compatibility — `loadProfiles()` adds missing secretCode, consolidatedFrom.

## Common Bugs
- `client.on()` inside `render()`/`setupChat()` stacks duplicate handlers on every re-render — always register in constructor.
- `eliminated` flag was one-way (only set true, never reset) — must derive each ROUND_START.
- `HOST_CHANGED` must call `renderGame()` during active gameplay (round > 0), not just `renderControls()`.
- Click handler `break` inside `for` loop breaks the loop, not the switch case — use `.some()` or flag.
- Profile overlay appended to `document.body` on every `render()` — check existence first.
- `innerHTML` with user text is XSS — use `textContent` or `createTextNode`.
- `localStorage.setItem` can throw QuotaExceededError for large photos — always try/catch.

## Testing
- 2-3 tests are consistently flaky (WS timing): uc-r7, uc-r9, occasionally uc-p1, uc-s1.
- New tests added: chat multiline AC-5 (lorem ipsum with \n).
- Total test count: 60 across 15 files.
