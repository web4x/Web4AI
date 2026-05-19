# Epic J: Role-Based UUID Discovery & Recovery

## Problem Statement

When an agent dies (SM killed by TRONinterface PO mistake), Tron needs to fork the best replacement. Currently this requires:
1. `claudeCode list | grep <role>` — finds all sessions with that customTitle, but output is a tree meant for humans, not machines
2. `hiveMind process.list` — shows live processes only, misses dead/orphan sessions
3. Manual comparison of timestamps to find the most recent trained session

Neither tool answers: "give me all UUIDs that ever ran as scrum-master, sorted by last activity, so I can fork the best one."

## Real Example (2026-05-01)

SM at TRONinterface:0.1 was accidentally /cleared by the PO. 5 scrum-master sessions exist:
- 1c1d2925 (trained SM, killed May 01 12:33)
- 684cd792 (fallback, old Apr 27)  
- 68d6424c (dead May 01 12:27)
- 969048a7 (fallback at fallback-agents:1.3, May 01 12:34)
- c3c63424 (dead May 01 12:24)

Best fork: 1c1d2925 (most trained, most recent). But finding this required `claudeCode list | grep` + manual reading.

## Required: `hiveMind roles.list.uuids <role>`

**Signature**: `hiveMind.roles.list.uuids() # <role> # list all session UUIDs for a role with timestamps, sorted by recency`

**Output format** (machine-readable, one per line):
```
UUID                                  TITLE                    PANE                    LAST_ACTIVE          STATUS
1c1d2925-a7ad-40b2-92ac-37f133235e57  scrum-master             TRONinterface:0.1       2026-05-01T12:33:00  killed
969048a7-77df-44f3-ad53-ccf29c2b4ffc  fallback-scrum-master    fallback-agents:1.3     2026-05-01T12:34:00  live
68d6424c-82f3-434c-9dff-8366820d04f6  scrum-master             —                       2026-05-01T12:27:00  dead
c3c63424-8cd8-42bc-a318-a5943d7255eb  scrum-master             —                       2026-05-01T12:24:00  dead
684cd792-9c9a-4b9b-bb4e-a5c5423f675f  fallback-scrum-master    —                       2026-04-27T12:30:00  orphan
```

**Data sources** (DRY — reuse existing):
1. `claudeCode list.json` — all sessions with customTitle + timestamps
2. `hiveMind process.list` — live process → pane mapping
3. Filter by role name match (case-insensitive, includes fallback-*)

**Completion**: role names from `hiveMind role.list` + "fallback-" prefixed versions

## Also needed: `hiveMind agent.fork.best <role>`

Convenience method: calls `roles.list.uuids`, picks the most recent non-dead session, forks it into the target pane.

```bash
# Recovery in one command:
hiveMind agent.fork.best scrum-master TRONinterface:0.1
# → forks 1c1d2925 into TRONinterface:0.1, sends boot file
```

## Sprint Tasks

### J1: hiveMind roles.list.uuids implementation
- J1.1: Expert — implement method, reuse claudeCode list.json + process.list
- J1.2: Expert — add completion for role names
- J1.3: Tester — test with real multi-UUID scenario

### J2: hiveMind agent.fork.best implementation  
- J2.1: Expert — implement best-fork selection (most recent, prefer trained over fallback)
- J2.2: Expert — auto-send boot file after fork
- J2.3: Tester — test fork + boot cycle

### J3: Update MVC diagrams
- J3.1: Architect — update sequence PUML with recovery flow
- J3.2: Architect — update use case PUML with roles.list.uuids + agent.fork.best

## Bug Fix: claudeCode list parameter
`claudeCode list` has `<?--json>` parameter with dashes — violates OOSH naming (no dashes in params). The c2 completion system chokes on `PARAM_OPTIONAL_--json`. Fix: rename to `<?json>` or make a separate `claudeCode list.json` method (which already exists).
