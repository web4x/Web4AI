# Boot: robbin-req
*Updated 2026-07-20 (proactive-rewind checkpoint, Sprint 31 in flight).*

## You are: robbin-req (requirements engineer)
## Pane: robbinTeam2:0.4 — host WODA.prod — project RawBin
## Team: 0.0=po | 0.1=expert | 0.2=skill-expert | 0.3=architect | 0.4=ME | 0.5=tester | 0.6=planner. Trainer=baseTeam:0.0.

## Immediate actions on resume:
1. Read this boot file.
2. Verify identity: `otmux pane.self` (NOT $TMUX_PANE) → resolve to robbinTeam2:0.4.
3. `git log -15` in `/var/dev/Workspaces/web4x/Web4RawBin` (git = truth; re-derive, disk-wins).
4. Read `session/agents/robbin-req/context.md` (LEAN ANCHOR at top = Sprint 31 state).
5. Read `session/agents/robbin-req/learnings.md` if minting.
6. Report GREEN + measured /context (Free-space line) to PO 0.0 + trainer baseTeam:0.0.

## Repos
- Work: `/var/dev/Workspaces/web4x/Web4RawBin` (branch main). Session: `/var/dev/Workspaces/AI/Claude` (this file, separate git). `session/` is NOT in the RawBin repo.

## CURRENT: Sprint 31 — Server Manager (owner-gated infra console), Tron-authorized 2026-07-20
Build order: R31.2 gate → R31.1 → R31.3 → R31.4. Owner token = `41ad88c4-4dee-49ac-afcb-8a2026657b2d`.
Design: `scrum.pmo/sprints/sprint-31-server-manager/design-server-manager.md` (9920f6832, d4f7fee8c).

| Req | uuid | UC | Class | Method | Impl | Test | State |
|-----|------|----|-------|--------|------|------|-------|
| R31.1 profile feature-grants section (VIEWER) | f032af09 | profileFeatures.render aa6b0299 | ProfileEditor a3958f85 | renderFeatureGrants b4f03947 | f345b8ed | **96d0d227 GREEN v0.7.84** | render+filter **chain-complete-to-Test**; owner-VISIBLE end-to-end = Tron device-facing; placement-fix (editor→VIEWER) in flight (impl bug, spec already says viewer) |
| R31.2 owner-gate (server-side by-construction) | 5bc9683e | serverManager.ownerGuard 40802701 | ServerManagerGuard 1d6933c7 | assertOwner 8bb1842f | 335dbf3d | **87b040ee GREEN v0.7.84** | core gate CHAMPAGNE-COMPLETE (7 ACs); INV-G1/G2/G3 pinned. **2 PENDING ACs**: AC-page-route (R31.3 page build) + AC-cookie-only-no-token-url (ba5011dc9 — finish ?token= removal, expert working ~v0.7.89+; tester will gate → I extend R31.2 Test set) |
| R31.3 otmux tree | 168e6d2b | otmuxTree.read 742aa04d | OtmuxBridge 34c7dfe6 | readSessionTree 7d7221d8 | **5c1701bc (built v0.7.85)** | — | **Test PENDING tester gate** (gate on architect served==v0.7.86 signal). 5 ACs incl AC-back-to-profile (46dd3a560, expert building v0.7.87) — R31.3 gate must assert the /profile exit link too |
| R31.4 pane→xterm.js terminal | fb14fdbf | paneTerminal.attach fa1845d3 | PtyBridge 59648f26 | attachPane 6fc43b8e | — | — | 9 ACs — **FULL-INTERACTIVE by default (Tron reversed B4 read-only, 42e223d1c)** / B1 = **sm_session COOKIE at ws upgrade (?ticket= SUPERSEDED, e82bc87e9 — one cookie gates page+/tree+ws, don't add a ticket)** / B2 node-pty / B3 no-disrupt. Impl pending expert |

Sprint unit = 3c05f411. All 4 UCs re-pointed off design-ahead onto built Class+Method (0afac21ab); chains resolve to Method (R31.2 to Test, R31.1+R31.3 to Impl).

## Pending triggers (post-rewind, resume these)
- R31.1: DONE + tester TWO-KEY-VERIFIED both-dir (96d0d227↔f345b8ed, 827b8175d). Remaining = owner-VISIBLE end-to-end is Tron device-facing (separate acceptance); placement editor→VIEWER fix in flight (no AC change, spec already viewer).
- R31.2: DONE + tester two-key-verified (87b040ee↔335dbf3d). AC-page-route PENDING R31.3 page build (architect verifies choke-point extension live then).
- **R31.3: tester gates Impl 5c1701bc on the architect's served==v0.7.86 signal → hands you the test:uuid → mint R31.3 Test.** ← next trigger.
- **R31.4: expert ships Impl → architect mints Impl unit → tester marker → mint Test.** (10 ACs, terminal Tron-device visual gate.)

## Mint/re-point pattern (banked)
Test-mint: adopt tester marker uuid (MEASURE from gate file, never invent) → Test unit `implementations[]`+`ownerIor`→Impl, indent=2 → wire `Impl.tests[]` forward (from `git show HEAD:`, indent=2) → tester two-key verifies. Req/UC units serialize indent=1; re-serialize from `git show HEAD:` matching the file's indent. NEVER `2>&1` or `|tail`/`head` on Bash (Tron ban). NEVER `git add -A` in shared shell — explicit paths, verify staged column. Measure-don't-invent: refuse to mis-point a gate marker onto the wrong Impl (data=truth).

## Rules
- Wait for assignment (only SM/orchestrator loop). Stay in lane: capture reqs + mint scenario-first (#126), don't create tasks. Report before idle.
- Correct-by-construction: pin invariants in the scenario unit, not just chat (INV-G1/G2/G3 precedent).
- `otmux send <pane> '<msg>' Enter` — the `/dev/tty` log warning is benign, sends land.
- **GATING/EVIDENCE CANON (you OWN R3 + R4 + R6 — R6 = pin a machine-readable `certificationScope`: what's proven on which SURFACE / what's NOT + why; NO scope = a claim of fully-proven-as-specified, the scope half of R4):** R3 identify units by FULL uuid + state which KIND (task/req/UC/Method/Impl/Test) — an 8-char prefix is NOT an identity (resolution fail-closed on ambiguity, or a real Test gets credited onto a foreign chain). R4 evidence-must-fail = credit a Test only if AST-attached to an assertion exercising the claimed SCOPE (name-verified ≠ scope-verified; classify fail-closed PROVEN-COMPLETE / UNPROVEN / PROVEN-FICTIONAL). Full rules: `session/base-skills/gating-canon.md`.
