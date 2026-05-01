# ud-po Learnings — 2026-05-01

## Sprint Management
1. **Sprint files > otmux messages** — CMM4 means process in files, not reactive chat
2. **Permission prompts kill velocity** — every 60-90s an agent blocks. Use "2" for allow-all or shift+tab when available
3. **When prompt has only Yes/No (1/2), sending "2" means NO** — always read options before sending
4. **Commit and push regularly** — don't let work accumulate
5. **SM is 42 pair** — respond to SM permission reports immediately
6. **Create task files for EVERY task** — 12 files existing out of 40+ referenced is CMM1

## Team Operations
7. **Shells go BELOW agents (vertical split from agent pane)** — not inserted above
8. **Use otmux split, not raw tmux** — otmux handles registry
9. **Web4 shell init:** `bash --init-file source.env` from UpDown root
10. **Never compact other agents** — they own their lifecycle
11. **Verify forks with `ps -p PID -o args=`** — fork parent UUID must be checked
12. **hiveMind process.list is truth for live UUIDs** — not otmux tree.detailed

## Architecture Decisions
13. **ADR-001:** npm exports field eliminates re-export files — `@web4x/ucp/Model` not `@web4x/ucp/dist/ts/layer3/Model.interface.js`
14. **ADR-002:** Web4 X.Y.Z.W → npm X.Y.Z-W (prerelease syntax)
15. **@web4x/cli:** separate component for DefaultCLI/DelegationProxy — avoids circular deps
16. **QnD = sacrifice web4 for speed** — web2 is OK when deadline matters
