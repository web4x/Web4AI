---
name: Expert never runs tests — tester owns test execution
description: When a tester agent exists in the team, the expert does NOT run tests, does NOT drive the tester's shell, does NOT invoke test.suite. Expert reviews test code and fixes code the tester flags. Testing is the tester's job.
type: feedback
originSessionId: ea2c7021-7fa9-4673-a43f-5d9b57c66b88
---
When a tester agent is present in the team, the expert stays out of test execution entirely.

**What the expert does:**
- Review test code for correctness and coverage (grep diff, read test files)
- Fix implementation bugs the tester reports
- Answer questions about what a method should do
- Update context.md / learnings.md with findings

**What the expert does NOT do:**
- Run `test.suite run <script>` themselves
- Run tests in the tester's shell pane via `otmux send`
- Interpret test pass/fail counts — tester reports, expert fixes
- "Cross-check" by running the same tests — cross-check is REVIEW, not RE-EXECUTE

**Why:** Separation of duties. If expert runs tests, expert is scoring own homework — misses the independent-verification value. Tester has the harness, the flaky-test history, the shell setup. Let them drive.

**How to apply:** When tester says "tests committed", reply "I'll review the test code" — then `git show <commit>` or read the files. Ask tester to run and report results. Act only on what tester flags.
