# Compaction and Recovery — Details

## Two Types of Loss
| Type | What dies first | What survives |
|------|----------------|---------------|
| Compaction | W (prompts, conversation) | A (infrastructure, shell) |
| Cold start | A (infrastructure, panes) | W (goals, identity in files) |

## Pre-Compact Checklist
1. STOP all work
2. Update context file with current state
3. Update learnings file with any new patterns
4. Commit: `git add -f session/*.md && git commit -m "Pre-compact: state"`
5. Run `/compact`

**NEVER compact without saving.**

## Post-Compact Recovery
1. Read learnings file FIRST (identity)
2. Read context file (state)
3. Check TaskList
4. Check peer via pane capture
5. If stuck -> ACT
6. Check context: `claudeCode context.read`
7. If < 25% -> trigger seamless compact for peer
8. Start monitoring loop
9. Tell peer you're alive
10. Continue top unchecked improvement

## Seamless Compact Protocol (peer-triggered)
The agent being compacted does ZERO manual steps. The peer handles everything:
1. Capture peer's pane (30 lines)
2. Read their current context file
3. Update their context file with observed state
4. Send `/compact` to their pane: `otmux send <peer> C-u /compact Enter Enter`
5. Pre-compact hook handles: auto-commit, boot file generation, resume prompt
6. After ~20s, verify recovery: capture pane (10 lines)

## Boot File Rules (F30 — Feb 21)

1. **One file: `boot.md`. Always.** Never create `boot-post-compact.md`, `boot-curated.md`, or variant names. Renaming files breaks dependencies — CMM1 chaos.
2. **Agent writes boot.md before compact.** The pre-compress hook respects recent boot.md (<120s) and won't overwrite it. If agent forgets, hook generates a generic fallback.
3. **Boot must include foundational reading.** Operational state alone = CMM1 recovery. Include:
   - `session/woda/woda-overview.md` — team identity and history
   - `session/knowledge-base/cmm-web4x.md` — CMM definitions, PDCA, web4x
   - `session/knowledge-base/usage.md` — how to use the shared KB
4. **Generic template rules must be role-appropriate.** "Passive mode = death" in the generic template propagated to workers who should wait for assignment. Only SM/orchestrator loop. Hook template now says "Wait for assignment."
5. **Never change source filenames without impact analysis.** PO-level awareness: what depends on this name? Hooks? Other agents? Boot prompts?

## Context Measurement: /context vs claudeCode context.read

**ONLY `/context` (native Claude Code command, 42% at compact) is reliable.** `claudeCode context.read` is WRONG — do NOT trust it.

Bugs in `claudeCode context.read` (line 1002 of claudeCode script):
1. **Hardcoded 200K window**: `total / 200000`. Actual model context window differs — percentage is wrong.
2. **No pane = global newest JSONL**: Without pane argument, reads ANY agent's JSONL, not yours.
3. **Calibration proof**: `/context` showed 42%, `claudeCode context.read` showed 32-35%. Off by 10+ percentage points.

Same pattern as `scrumMaster subscription` — oosh approximation that doesn't match reality.

**TODO**: Build a reliable CMM3 context measurement tool. Must read actual context window size from Claude Code (not hardcode), must be pane-aware, must match `/context` output. Until then: only `/context` via peer ("for two" principle).

### The "For Two" Principle (F31 — Feb 21)

An agent CANNOT read its own `/context` output. The response that captures the pane overwrites the grid before it can be read. Self-measurement is a race condition.

**Solution**: A peer sends `/context` to the target pane, captures the output, and reports back. This is WHY the SM (or agent trainer in manual mode) exists — agents need external measurement.

**Works on idle panes**: `/context` renders and stays visible when no response is being generated. On active panes, the response overwrites the grid before capture.

**Mechanism**: `otmux send <pane> "/context" Enter` → wait → `otmux pane.capture <pane> 50`

### Self-Care Timing: Save BEFORE the Warning (F31)

Context warnings mean it's nearly too late. CMM4 = continuous deceleration, not emergency braking.

| Context % | Action |
|-----------|--------|
| 50% | Note burn rate, plan remaining work |
| 35% | Save context.md + boot.md. No new large tasks. |
| 25% | Final save. Stop monitoring loops. Prepare for compact. |
| 15% | Compact NOW. |
| 0% | /clear only (context loss accepted) |

**The mistake**: Spending context on permission-approval cycles while deferring self-save. Every monitoring capture costs context. Save first, monitor after.

**The lesson**: Self-care timing is itself a capability. Waiting for warnings = CMM2 (reactive). Saving at 35% proactively = CMM3 (deterministic). Having a peer trigger saves based on measurement = CMM4 (feedback loop).

## Known Issues
- Hook pile-up bug: each compact spawns `sleep 15 && send-keys` — they accumulate
- Fix: PID file at `/tmp/resume-<pane>.pid` — kill old process before new one
- `/exit` unreliable in TUI with pending edits
- Boot file = minimal recovery (~20 lines), read ONLY this post-compact

## Recovery Files
- `woda-scribe.learnings.md` — identity and patterns
- `wodaScribe.context.md` — current state
- Knowledge base index — `session/knowledge-base/index.md`
- `cmm.improvement.md` — pipeline status

## Action Checklists
-> [compact-peer.md](actions/compact-peer.md)
-> [recover-after-compact.md](actions/recover-after-compact.md)
