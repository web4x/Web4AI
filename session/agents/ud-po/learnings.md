# ud-po Learnings — 2026-05-04

## Process

### 1. Permission Prompts — #1 Velocity Killer
Agents blocked every 2-3 minutes. "Allow all edits during this session" resets per new file target. Spent ~40% of PO time approving permissions.
**Mitigation:** Respond to SM PERMISSION reports immediately. Don't wait for background monitors.

### 2. Sprint Task Files = CMM3 (Non-Negotiable)
Started with chat-only directives — CMM1. Created 57 task files for Sprint 1, 9 task files for Sprint 3 vitest. Every task in planning.md MUST have a file with UUID, status, acceptance criteria.

### 3. 42 Peer = SM at TRONinterface:0.1
Always check SM before halting. Respond to SM reports immediately — agents die waiting.

### 4. Never Compact Other Agents
Agents own their context lifecycle. PO never compacts or /clears them.

### 5. Web4 Shell Init
`cd /Users/Shared/Workspaces/AI/Claude.All/UpDown && bash --init-file source.env`

### 6. Pane Splits Target the Agent Pane
Split BELOW the agent, not from PO pane. Wrong splits push agents down.

### 7. Don't File False Bug Reports
Pre-created rooms = stable slugs. User rooms = random UUIDs that expire. Check code before filing.

### 8. Use TaskCreate for Queue, sleep for Wakeups
Never /loop — blinds Tron interface. Queue with TaskCreate, wake with `sleep N && echo`.

## Architecture

### 9. ADR-001: npm exports Field
Eliminates ~50 re-export files. `@web4x/ucp/Model` not `@web4x/ucp/dist/ts/layer3/...`. POC passed.

### 10. ADR-002: Version Mapping
X.Y.Z.W → X.Y.Z-W in package.json. Directory names stay 4-part.

### 11. @web4x/cli Component
DefaultCLI + DelegationProxy shared. Fixes "CLI back-reference not set" blocker for all 14 components.

### 12. Traceability Chain
PUML(UUID) → task file → impl(file:method) → vitest. Matrix = single source of truth. Don't pollute source files.

## Testing

### 13. Vitest Migration
47 tests, 9 files, 9 UC categories. Serialized execution for WebSocket tests.

### 14. Game-End Bot Edge Case
Bot protective shell (30%) survives many rounds. Test must handle bot-solo-against-deck scenario.

## Sprint History
- Sprint 1: 9/9 tasks, 14 components at 0.3.23.1, server parity verified
- Sprint 3: 26 tasks + 11 bugs + DRY + vitest migration, 47/47 PASS
- Sprint 2: NOT STARTED (UpDown in ONCE + Lit Views)
