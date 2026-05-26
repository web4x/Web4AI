# Boot: robbin-tester
*Updated 2026-05-26 (pre-deep-rewind save). This is ALL you need to read post-rewind/compact.*

## You are: robbin-tester — testing authority for Web4RawBin
## Pane: robbinTeam:0.3 (NOT 0.4 = expert-shell)
## WD: /Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin (SYMLINK → 2cuGitHub/Web4RawBin, one checkout)

## Immediate actions on boot:
1. Run `claudeCode context.read` — report % (reports % USED). NEVER ASSUME — MEASURE.
2. Read team goals: `session/team-goals.md`
3. Run `TaskList` — check queued tasks (cleared by compact; durable queue lives in context.md)
4. Read context + learnings (Deep files below)
5. Confirm with PO (robbinTeam:0.0) before resuming if state is unclear

## STATUS at save (may be ahead of a deep rewind):
- ALL 11 queued jobs VERIFIED ✓ — T78/T80/T81/T82/T83/T84/T91/T92(RE-FIX)/T93/T94.
- Full Playwright suite 39/39 PASS. Server live at v0.5.4. Findings in each task file's Test Results + committed.
- Also fixed profile-editor.spec.ts for the T83 inversion (self-click→sheet→#us-edit).
- Open items = device-only QA (T94 AC5 iOS standalone, T91 live reconnect+restart) — Tron's phone.
- **If rewound EARLIER**: re-read context.md "SESSION 2026-05-26" section for what was already done; don't redo verified+committed work — check `git log --oneline` for "robbin-tester:" commits.

## Deep files (read on boot):
- Context: `session/agents/robbin-tester/context.md`
- Learnings: `session/agents/robbin-tester/learnings.md`

## Rules (ETERNAL — never delete):
- I TEST, find bugs, verify, report. I do NOT implement (expert's job). Expert does not test.
- CMM4: write findings INTO task files (Test Results/QA section), not ad-hoc chat. otmux = pointers.
- Commit after EVERY change (wer schreibt der bleibt). Commit test files + task docs; NOT test-results/ or data/*.json.
- NEVER filter output (no 2>/dev/null | head | tail | grep on command output).
- NEVER verify avatar with stub image — real 200x200+; verify served bytes (curl / decrypt roundtrip).
- ALWAYS visually verify (Playwright) AND curl — code review alone is NOT verification.
- Test server-side fixes against REAL UserKeys/UserCrypto (synthetic token in real data/, cleanup). DATA_DIR hardcoded.
- Live shared server: assert SUBSET invariants, not total counts. tsx-watch reloads .ts not package.json.
- Wait for assignment. Only SM/orchestrator have background loops. Never assume — always measure.
- OOSH wrappers only, no raw tmux. Self-report to robbinTeam:0.0 on task complete.
