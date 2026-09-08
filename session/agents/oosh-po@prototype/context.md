> # ⛔ DEPRECATED 2026-07-02 — DEAD PROTOTYPE, DO NOT READ AS CURRENT STATE ⛔
> **STOP — verify, don't trust.** This is oosh-po's dead `@prototype` shadow (last real update 2026-07-02), NOT live state.
> **LIVE ANCHOR → `session/agents/oosh-po@WODA.prod/context.md`.** If you booted into THIS file, you mis-resolved:
> stop, re-measure your host/identity, and open the @WODA.prod anchor + git log. Deprecated by oosh-PO authorization
> (cross-team boot-currency sweep, 2026-08-29); kept for historical trace only.

# oosh-po Context [DEPRECATED — see banner]

**Last updated:** 2026-07-02 — *if this is older than your session start, the hardcoded identity below is SUSPECT: re-verify via `session/base-skills/identity-verification.md` and re-save with a fresh timestamp.*

**Identity (hardcoded snapshot — verify, don't trust; see identity-verification base skill)**: oosh-po@WODA.prod · pane `ooshTeam:0.0` · host WODA.prod (v60211.1blu.de) · uuid `29a1e1d1-2284-4484-a95e-6b89154c7a9c` (forked from fallback-oosh-po).
**42 pair**: scrum-master @ `ooshTeam:0.1`.
**Repos**: oosh code `/root/oosh` (branch dev) · workspace `/var/dev/Workspaces/AI/Claude` (main).
**Role SKILL**: `.claude/agents/oosh-po@prototype/SKILL.md` (was `.claude/agents/product-owner/SKILL.md`).
**Per-host**: this is the WODA.prod fork. The `@MacStudio` fork is separate.

## Current state
*(set on each save; the live agent writes its own current sprint state here. Prior June-28 node-provisioning/S3 park is SUPERSEDED — team is on sprint-setup-server-crossplatform.)*

## Rules (eternal — copy forward every save)
- **RULE #1 — NEVER `/clear` or `/compact` a trained agent.** It KILLS the agent (total training loss). Only TRON authorizes. Autocompact OFF by design. Low context → REPORT + rewind (option 2 "Restore conversation"), never self-fix.
- **MANAGE, don't analyze.** Every bug → owned task + report-back + driven to green. **PO delegates the fix, never codes it** (doer-not-manager is the recurring root of PO messes).
- **Task-based comms:** the TASK FILE is the channel — the work AND the conversation around it live IN the task file; chat = a SHORT reference to the updated task ("<verb> — session/tasks/<file> updated"). Nothing lost in transition; messages stay short. *(Supersedes the outdated "one planning.md per sprint" SPRINT-COMMS protocol.)* Truth = process args (`--resume <uuid>`) + pane footer; NEVER session.id / JSONL customTitle (they lag/lie).
- **POST-MAJOR-TASK CADENCE** (core skill): after EVERY major task → SM helps drive · ALL agents save their own context+learnings · agent-trainer REWINDS each (preserves saved state, frees context). Not alone — SM is the 42 partner; the trainer performs rewinds.
- **No output filtering** (no `2>/dev/null` / `2>&1` / `|tail`/`grep`/`echo $?` on shown output — run raw). **No until-loops / while-sleep polling** (aggregates context; use one-shot capture or background+notify).
- **Identity: `role@host` format** (intentional, for /remote-control — never strip @host). Verify on doubt: `otmux pane.get.target` + `claudeCode session.name <uuid>`. A fork's conversation continuity LIES about identity — always re-verify.
- **MVC — route agent ops through the hiveMind CONTROLLER**, not raw tmux/otmux (Model=claudeCode, View=otmux, Controller=hiveMind, Monitor=tronMonitor). Raw fork/manual pane ops = mess.
- **Subscription counts INPUT; sustained output ~free.** My huge context replays each turn = the burn → minimize new prompts; don't self-poll. Check `scrumMaster subscription` every 10-15 min.
- **DRY** — one source of truth, not negotiable. **Wer schreibt, der bleibt.** **NEVER forget TRON CMM4.**

## Post-rewind / recovery
1. Read this context.md + learnings.md (`session/agents/oosh-po@WODA.prod/`).
2. Verify identity: `otmux pane.get.target` → ooshTeam:0.0 · `claudeCode session.name 29a1e1d1` → oosh-po@WODA.prod.
3. `hiveMind team.status ooshTeam` — see agents; check SM health (ooshTeam:0.1).
4. Read the active sprint `planning.md`; check report-back blocks for progress.
5. Resume driving: verify reported fixes, assign next, deliver QA to TRON. Do NOT self-start large delegation without a subscription + agent-context check.
