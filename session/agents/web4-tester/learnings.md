# ud-tester Learnings

## Testing Patterns
- WebSocket tests need self-contained state per it() — no shared variables across tests (rooms get cleaned up)
- collectFor() with short timeouts fails under parallel load — use fileParallelism: false in vitest config
- Bot has 30% shield chance — can survive many rounds. For game-end tests, let human timeout (get eliminated) and let bot play solo until deck exhausts
- Game server TUI needs foreground — can't run with & (backgrounding). Use npm start, not npx tsx &
- Server at wss://localhost:3443, self-signed cert → rejectUnauthorized: false

## Protocol Discoveries
- welcome message type is lowercase 'welcome' (not 'WELCOME')
- Room name field is 'roomName' in CREATE_ROOM but server returns 'name' in room object
- ROUND_RESULT has 'revealedCard' (not 'nextCard' or 'currentCard')
- Pre-created rooms have hostId='server' until first player joins
- LEAVE_ROOM should trigger ROOM_LIST auto-send (was a bug, now fixed)
- Bot names have 🤖 prefix + personality emoji + name (e.g. "🤖 ⚖️ Mirror")
- PLAY_SPECIAL is a separate message from PLAY_CARD
- Spectator joins via SPECTATE_ROOM → gets SPECTATE_JOINED

## Bugs Found (Sprint 3)
- BUG: ROUND_RESULT missing score/streak fields → expert fixed
- BUG: Protective Shell not working → expert fixed
- BUG: roomName ignored (all rooms "Game Room") → expert fixed
- BUG: SERVER_CONFIG missing → expert added shareDomain
- BUG: Pre-created room hostId stays "server" → expert fixed
- BUG: LEAVE_ROOM doesn't send ROOM_LIST → expert fixed
- BUG: Bot unkillable (always shielded) → expert fixed
- BUG: /mp?name= routing fails → expert fixed base href

## Process Rules
- I am the TESTER — report bugs, don't fix production code
- P15: NEVER filter output with | head | tail | grep
- Cannot test browser UI — only CLI/WebSocket protocol
- Each vitest it() = one AC from architect task file
- Each test file links to UC UUID via @uc:uuid comment
- Update traceability-matrix.md after each test file created
