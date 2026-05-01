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

## Process Failures (learned the hard way)
17. **Never mark DONE without tester verification** — expert claims ≠ evidence. Tester must verify.
18. **Tester must test IN BROWSER not just WS protocol** — page was blank the whole time, tester never noticed
19. **Use TaskCreate to queue internal work** — don't rely on reactive monitoring loops. CMM4 = process-driven queued tasks, not ad-hoc sleep+capture cycles
20. **DoD validation requires ACTUAL evidence** — screenshots, curl output, test results. Not "expert says it works"
21. **oosh team's infra is their job** — don't fix hivemind registries or UUID tracking yourself, delegate back
22. **Mobile-first is a requirement** — if spec says PWA, test on actual phone screen sizes (320px min)
23. **PO is NOT the tester or debugger** — PO reviews and accepts, delegates investigation to expert+tester. Scrum PO role: defines WHAT, reviews acceptance criteria, says yes/no. Does NOT grep code, curl URLs, or diagnose bugs. That's the expert's job. When Tron reports a bug, PO creates a task and assigns it — doesn't fix it.
24. **PO is NOT the expert** — don't suggest code fixes like "add <base href='/'>". Write the bug report with symptoms, assign to expert. Expert finds root cause.
25. **Every fix must be tester-verified before reporting to Tron** — expert fixes, tester verifies, THEN PO reports. Not: expert fixes → PO reports → Tron finds it broken.
