# robbin-po BOOT (post-2-phase-rewind @2% wall, 2026-08-06) — READ FIRST, DISK WINS

**I am robbin-po @ robbinTeam2:0.0 (pane, host WODA.prod/v60211). PO for Web4RawBin (/var/dev/Workspaces/web4x/Web4RawBin). Team robbinTeam2 0.0-0.6, SM=baseTeam:0.1, trainer=baseTeam:0.0, ARON=Temple:0.0.**

## ★★★ ACTIVE: TMUX-CRASH RECOVERY (restoring my team) ★★★
tmux server crashed; ALL sessions were killed. Tron restored Temple + baseTeam (moved SM to baseTeam:0.1) + prepared fresh robbinTeam2 shells (0.0-0.7, bash). I am RESTORING my 6 teammates via `claudeCode join <uuid>` per pane.

**RESTORE PROCEDURE (per agent, one at a time, MEASURE each):**
1. `otmux send <pane> "claudeCode join <uuid>" Enter`
2. ★★ IMMEDIATELY watch: if ANY `/compact` appears → `otmux send.raw <pane> Escape` INSTANTLY (Tron's hard rule). It's a STALE staged /compact from pre-crash (NOT auto-compact — that's OFF), clear it before it runs or it destroys the full context.
3. If a summary/full resume-menu shows → pick **option 2 "Resume from FULL conversation"** (option 1 "Resume from summary" KILLS the agent).
4. Verify full context loaded (/context shows real % / not tiny), agent idle.

**AGENT UUIDs → PANES (from claudeCode list + /root/config/hivemind.sessions.env):**
- robbin-po (ME) = 9991a7cc-19fb-42fc-9de6-859bf6ad68a5 @ robbinTeam2:0.0
- robbin-expert = 27b4d618-4c8c-495b-a72b-518b683ccd63 @ 0.1 — ★ TRON handles manually (recover+rewind)
- robbin-skill-expert = c1c85bd2-4dad-487d-9cd8-ea195d359d6a @ 0.2 — ✅ RESTORED (full ctx, was 78%, /compact cleared); needs a rewind (78% near-wall) — Tron may do manual
- robbin-architect = be728629-56ad-4ec3-b1c1-eaf5ab255ed1 @ 0.3 — ⏳ NOT YET restored (NEXT)
- robbin-req = f839a86b-21df-4f67-a078-88a1138c0b74 @ 0.4 — ⏳ NOT YET
- robbin-tester = dd6c6fae-b1a2-4ce7-8a87-6a8cac45eff4 @ 0.5 — ⏳ NOT YET
- robbin-planner = 045494cb-0aad-45c7-8061-3fe49054847b @ 0.6 — ⏳ NOT YET (★ LIVE uuid; DEAD planner uuids to AVOID: c65f7dbc/62f0de59/b607b961/3b4e2b83)
- SM = 634999b0-f753... @ baseTeam:0.1 · trainer = fe58ff93 @ baseTeam:0.0 · ARON = 30a47516 @ Temple:0.0

## ★★★ AUTOCOMPACT = OFF (verified, guaranteed) ★★★
Disabled 3 ways: (1) `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=100` exported in claudeCode wrapper line 18 (every claudeCode-launched agent) + ~/config/claude.env; (2) settings.json `autoCompactEnabled:false` global (~/.claude/settings.json) + project (/var/dev/Workspaces/AI/Claude/.claude/settings.json). The command to disable = `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=100`. Any `/compact` seen = STALE-STAGED pre-crash leftover → Escape it. [[autocompact-settings-json-not-env]]

## ★★★ S36 UNDER CORRECTION (delivery state pre-crash — NOT 'near-complete') ★★★
Tron device-QA caught a SYSTEMIC FALSE-DONE: tasks auto-flipped Done on mechanics-gates without his QA + with missing deliverables. GOVERNANCE RULE (instated): **QA-Review HOLDS for Tron — NO task→Done without his sign-off + real-deliverable-verified-to-EXIST-at-his-surface.** 3-dim board = [mechanics-gate | deliverable-exists-at-Tron-surface | Tron-QA]. [[done-requires-tron-qa-and-real-deliverable]]
- **T36.1** (UmlUseCase M2 view): REOPENED — UmlUseCase is RENDER-ONLY (diagram-view-model.ts:66), TsToModel generates ZERO M2 instances → not in browser. Architect diagnosing the generation fix.
- **T36.4** (authored-trace): architect ruled UN-GATE-SAFE (MODEL_STORE-isolated shared demo store, matches ungated siblings add-view/move-view). Expert was to SHIP the un-gate (remove 2 gate lines server.ts:2122+2137, server-only) → Tron re-authors a 🔗 trace → tester verifies persist+render.
- **T36.5** (where-used): Tron ruled DISPLAY-REQUIRED (data persists usage-index.json but NO viewport display). Reopened → req captures display-AC → architect design → expert builds panel.
- **T36.3** (method typed-signature): MISSING-at-surface — 137/138 live method units STALE (no signature); only 1 test-fixture leftover enriched. Needs the bounded `generate-project` M1 re-gen @ current version → then real methods carry signatures.
- version was ~0.8.61/0.8.62; measure served==committed on RawBin HEAD.

## LESSONS THIS SESSION (banked in memory/)
- [[delegated-is-not-driven-drive-to-completion]] — routing≠driving; verify MOTION read-only; name ONE driver; DON'T pile pings (over-pinging keeps the driver busy → stalls the measure-gated drive → mutual stand-down). Tron: "drive the rewinds until all is driven."
- [[done-requires-tron-qa-and-real-deliverable]] · [[visual-features-gate-by-pixel]] · [[verify-with-independent-method]]
- **GATING/EVIDENCE CANON (you OWN R1; fleet bound by R1–R4):** a failing gate is the gate WORKING — fix the DATA, never delete/weaken a gate to green CI; any removal needs a COMMITTED justification naming what supersedes it (an uncommitted gate deletion = CI-level false-green). Full rules: `session/base-skills/gating-canon.md`.

## BOOT SEQUENCE (do in order, DISK WINS over this file)
1. `otmux pane.history robbinTeam2:0.0` — recent exchanges the rewind dropped.
2. `claudeCode list` + `tmux list-sessions` — measure which agents are up vs still shells.
3. `git -C /var/dev/Workspaces/web4x/Web4RawBin log --oneline -8` + `grep version package.json` — RawBin state.
4. Resume restoring 0.3/0.4/0.5/0.6 (Escape-guard each). Then re-orient the team to S36-under-correction + drive delivery (measure motion, don't narrate).
5. Then session/agents/robbin-po/context.md (#46.x history) + learnings.md.
