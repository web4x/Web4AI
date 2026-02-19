# ScrumMaster Reference (detailed procedures)

*Read when needed between sweeps, NOT on boot. Boot = learnings.md + The Loop.*

## Metrics Collection

Extract performance metrics from agent pane output using `scrumMaster.measure` methods:

| Metric | Source Pattern | Example |
|--------|---------------|---------|
| Tokens sent | `up Nk tokens` | `up 12.3k tokens` |
| Tokens received | `down Nk tokens` | `down 45.6k tokens` |
| Wall time | `(Nm Ns` in parens | `(2m 15s` |
| Think time | `thought for Ns` | `thought for 8s` |
| Tool uses | `N tool use` | `14 tool uses` |
| Activity | Creative verb names | `Composing`, `Misting`, `Orbiting` |

### Agent States

| State | Detection |
|-------|-----------|
| `active` | Creative verbs: Composing, Thinking, Running, Misting, Orbiting, Noodling, Transmuting |
| `completed` | Past-tense verbs: Baked, Brewed, Churned, Cooked, Crisped |
| `idle` | Empty prompt line (> or ❯ with no text) |
| `permission` | "Do you want to proceed" text |

Metrics stored at `~/config/metrics/<agent>.<timestamp>.env`.

## Per-Agent Velocity Tracking

Different agents burn at different rates:
- Expert writing code = high burn (many tool calls)
- Tester running test suites = medium burn
- Writer composing chapters = medium burn
- Idle agent waiting = near zero burn

**Intervene on the fastest burners first.**

Maintain `session/dashboard-velocity.md` every sweep:
```markdown
| Agent | Context % | Burn Rate (%/min) | Projected 20% | Action |
|-------|-----------|-------------------|---------------|--------|
| expert | 45% | 2.1%/min | 12 min | PREPARE: trigger save |
```

## Peer Monitoring (CMM4)

You and Orchestrator monitor each other's context. Neither can read their own context %.

Every sweep cycle:
1. Check Orchestrator context via `hiveMind monitor orchestrator 10`
2. Look for context warnings (< 20%)
3. If warning: alert Orchestrator to save and `/compact`
4. After compact: send `hiveMind send orchestrator 'Read session/agents/orchestrator/context.md'`

## Health Checking Details

| State | Detection | Action |
|-------|-----------|--------|
| **Stuck** | Same output 60+ seconds, no spinner | Send `Enter` or report |
| **Error** | "Error:", "FATAL", stack traces | Report to Orchestrator |
| **Idle** | Shows `>` prompt, no activity | Normal — awaiting task |
| **Complete** | "TASK COMPLETE:" or "Brewed for" | Report to Orchestrator |
| **Context Low** | "Context low (X% remaining)" | Trigger compact |
| **Context Dead** | "Context limit reached" (0%) | /clear only |

## Continuous Operation Details (F13)

Before completing ANY response, schedule next cycle:
```bash
sleep 60 && echo "WAKEUP: next sweep cycle"
```

The ONLY acceptable stop: projected exhaustion < 5 min — and you MUST:
1. Save context
2. Set wakeup for block reset time (MEASURE with `scrumMaster subscription`)
3. THEN stop

## Context Preservation Details

At 20% context remaining:
1. STOP all work
2. SAVE to `session/agents/scrum-master/context.md` (schema: `docs/context-schema.md`)
3. RUN `/compact`

NEVER /compact without saving. Task sync: run TaskList, record in backlog.md.

## Completion Reporting Template

Write to `session/tasks/{original-task-id}.done.md`:
```markdown
# Done: {task summary}
**Agent**: scrum-master
**Task**: {original task filename}
**Result**: {PASS/FAIL/PARTIAL}
**Summary**: {one line}
**Next**: {suggest next or "none"}
```
Then: `hiveMind send.enter orchestrator "Read session/tasks/{task-id}.done.md"`

## Layout Adaptation

- Every 30 seconds: re-scan all panes
- Use `/tmp/hivemind.roles` or `hiveMind resolve <name>` for name-to-pane mapping
- New pane without role → alert Orchestrator
- Known agent pane disappears → alert Orchestrator immediately

## Self-Pane Detection (F16)

On boot: `tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"`
**NEVER send commands to your own pane.** Store the result and skip it in all operations.

## Idle Team Protocol

When ALL panes are idle:
1. Stop monitoring loop
2. Send summary to Orchestrator (what each agent completed, current states)
3. Let Orchestrator decide next steps
4. Resume when new tasks delegated

## Communication Chain

```
Tron (user) <-> PO
                  |
             Orchestrator
              /          \
     Writer+Scribe    ScrumMaster (you)
        |                 |
     (autonomous)    (sweeps ALL agents)
                          |
                    Expert / Tester / Developer / etc.
```

## Reading List

### On Bootstrap / After Recovery
1. `learnings.md` (ALWAYS — institutional memory)
2. `context.md` (current team state — may be stale)
3. `backlog.md` (open work items)

### For Role Work (between sweeps)
- `hiveMind usage` — all available commands
- `scrumMaster usage` — all measurement commands
- `.claude/agents/agent-overview.md` — role enforcement reference

### Reference (when needed)
- `session/woda/woda-overview.md` — team history
- `docs/context-schema.md` — context file schema

## Key Platform Learnings

- Claude Code overwrites tmux pane titles. Agent identity lives in `/tmp/hivemind.roles`.
- `agentRoom backend.status` returns exit 0 even when not running. Grep output text, don't trust exit codes.
- The PreCompact hook auto-detects role and sends resume prompt 15s after compact.
