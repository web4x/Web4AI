# robbin-po Context — clean snapshot 2026-06-05 (save #4)

**Role:** PO | **Pane:** robbinTeam:0.0 | **Project:** RawBin | **Repo:** /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
**Server:** https://home.donges.it:4444 — **v0.5.87 LIVE** (iphone:0.1), uptime ~5.4h, 9 real rooms.
**Tron:** iphone:0.0 | SM TRONinterface:0.1 (monitors me) | agent-trainer baseTeam:0.0
**Team:** 0.1 architect | 0.2 expert | 0.3 tester | 1.0 planner | 1.1 req — ALL legitimately idle (blocked on Tron, not drift).

## SPRINT 17 — Scenario Units / IOR / Traceability Browser — DEV DONE + VERIFIED
- **Chain LOCKED, 7-step:** requirement→task→usecase(s)→class→method→implementation→test(s). 1:N at plural hops. Atomic one-sentence reqs are ROOTS. FORWARD-ONLY (no back-refs).
- **Storage:** scenario/index/<5-deep char dirs>/<uuid>.scenario.json · scenario/sprints.json/ (ln tree, speaking names) · scenario/sprints.md/ (generated views). Unit shape: {ior=class-loader, model={attrs+children IOR arrays}, ownerIor}.
- **Verified strict (per-Test 7-hop + live UX repro, not API-only):** T178 keystone 44/44 (every test reachable from Req root), T179 SW auto-activation E2E 4/4, T181/T184 forward-only (0 back-keys), T185 (38/38 method:uuid + 14/14 class exact), T186 tree lazy-load (live 7-level expand), T128.1 Sprint-1 exemplar + T128.2 S10-S16 migration, file-browser symlink support.

## ONLY 2 ITEMS LEFT — BOTH TRON (nothing else in flight)
1. **HTTPS cert → clears device lockout.** Tron runs on Mac Studio: `sudo certbot certonly` (DNS-01 `--manual --preferred-challenges dns -d home.donges.it` if port80 closed; else `--standalone`) → cert at /etc/letsencrypt/live/home.donges.it/ → `git pull && npm run build && npm run dev` → server logs 'SSL: Let's Encrypt cert' → real-device SW registers → lockout clears. Expert PRE-STAGED auto-detect+self-signed-fallback (bb828692 v0.5.87) = instant pickup. (Real iOS PWA = Safari → Add-to-Home-Screen; Chrome iOS=WebKit.)
2. **Tron QA-signs the batch:** scrum.pmo/tron-qa-batch-2026-06-05.md (29 strict-verified 🧪 + 33 bonus ✅). Recommend: spot-check 3 + single batch-approve commit (S5-S8 precedent). → T129 S17 gate closes.

## HARD RULES (durable)
- #65 NEVER /compact (kills agents); rewind via agent-trainer (silent); NEVER tell an agent its ctx%; "save" = commit current work to context.md+learnings.
- #66 ship = package.json + sw.js CACHE_NAME bump (a+b). #67 new route/bundle → sw.js STATIC_SHELL (c). Report '(a)✓(b)✓(c)'.
- #71 every report → derive + route next; never stop. SM flags idle/stuck → I re-task.
- CMM4 4-role, planner-first: req (atomic 1-sentence + literal capture) → planner (v4-uuid stand-up) → architect (design) → expert (impl) → tester (verify). Chat = pointer + next-delegation only. compound-requirement-source*.md = Tron verbatim captured FIRST. Route EVERY Tron literal to req.
- #17 NEVER fake-suffix uuids — real v4 (uuidgen). Caught repeatedly.
- #27 STRICT VERIFY: "audit clean" ≠ Tron-satisfied. Requires per-Test 7-hop reachability + LIVE headless/tree UX repro. Tron's live-device observation IS the acceptance test.
- Read whole tool output when verifying (no |head/tail/grep that truncates).

## HARNESS TRACKER: #29-57 + T173-186 done. #58 T180 in flight (Track1 Tron-blocked). #37 S17 parent open until T129 gate closes after Tron QA.

## ON RESUME
Team caught up, no manufactured work. Re-task the instant Tron (a) runs cert or (b) signs QA, or any new literal → straight to req. SM monitors; rewind via trainer if near limit.
