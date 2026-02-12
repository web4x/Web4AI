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
