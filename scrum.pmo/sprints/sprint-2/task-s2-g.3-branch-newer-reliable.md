> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.3: dev vs macos.latest — newer / more-reliable + reconcile
[task:uuid:ec3af15e-ae9c-4ef9-ad5d-61826c8fdbae]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**Role: architect (analysis) → PO (reconcile decision).** Tron: "check if macos.latest is newer or more reliable." Determine per-capability (not global — see the layer-specific learning): commit recency, which branch leads on otmux-send / c2 / boot / install; where macos.latest is more reliable, plan the port TO dev (and vice-versa). Feeds the eventual S3 dev↔macos.latest merge (currently parked pending Tron a/b).

## Definition of Done
- per-capability newer/more-reliable verdict (otmux-send, c2, boot, install) with commit evidence
- reconcile direction per capability (port macos→dev or dev→macos)
- informs S3 merge decision

## ARCHITECT PER-CAPABILITY ANALYSIS (oosh-architect, 2026-07-02) — measured
**Headline: dev is CANONICAL on every capability. macos.latest is 966 commits BEHIND (4 unique). "macos.latest is more reliable" is FALSE globally — its apparent reliability is the reliability of being OLDER/SIMPLER (fewer moving parts to break), not superiority. Reconcile direction is uniformly dev→macos.latest, gated on dev's in-flight fixes being green.**

### Commit evidence
- `dev` ahead of `macos.latest`: **966 commits**. `macos.latest` ahead of `dev`: **4**. merge-base `d45031a` (env-pure-state).
- Per-capability last-touched (dev vs macos): otmux **07-02 vs 06-28** · c2 **06-27 vs 06-22** · this **06-29 vs 06-23** · config **07-02 vs 06-23** · oo **07-02 vs 04-02 (3 months)** · init/oosh **07-02 vs 06-10**. Dev is newer on ALL, by days to months.

### Per-capability verdict + reconcile direction
| Capability | Newer | Reliable TODAY | Direction | Evidence / note |
|---|---|---|---|---|
| **otmux-send** | dev | dev for *verified* claude-dispatch; macos "reliable" ONLY because its old send has no verify→can't hang | **dev→macos, AFTER g.1 fix** | dev = OTR-1 + BUG7 pane.self; macos = old send (no verify/poke) + `$TMUX_PANE`. Port after the g.1 non-claude fix lands, else you port the regression. |
| **c2** | dev (d83907b) | dev (test-proven T-C2-QUOTE 3/3) | **dev→macos** | g.2: 3 fixes macos lacks (`'''`-crash guard, `bash -n`-before-source, param-completion). |
| **boot/config** | dev | dev | **dev→macos** | Whole sprint-constructor-contract + config-selfheal on dev (pure-state env, config.validate/repair, HOME discovery); macos at merge-base. Boot HOOK (`pre-compress.sh`, shared Claude repo) gets the C.3 fix. |
| **install (SETUP_SERVER)** | dev | dev (only branch that RUNS the 32-62 server tail; macos STUBS it → `return 0`) | **dev→macos** | S-A finding: macos stubs server-setup, so nothing to port FROM it; dev is the real exerciser (5 bugs, BUG5 done). |

### The "vice-versa" — the ONLY reverse-port candidates: the 4 macos-unique commits
macos.latest's 4 unique commits must be PRESERVED through the merge AND reviewed for any fix dev lacks: `04b54a5` send **Escape-before-Enter (SSH TUI)** ← **REVIEW vs dev's send** (may be relevant to g.1's ssh/non-claude Escape handling — could be a real macos→dev port), `9971ad7` parameter.completion.client, `3249104` team.sweep monitor.switch, `2cca6f8` MVC adoption. Only these 4 are reverse-port candidates; everything else is dev→macos.

### S3 merge implication
It is a **dev→macos.latest FORWARD merge** (dev 966 ahead), NOT a cherry-pick-from-macos. Matches the clean-boot S3 plan. **Gate: dev GREEN first** (g.1 send fix + C.2/C.3 impl + tester passes), **preserve the 4 macos-unique commits** (review the SSH-send one for a dev-ward port), then merge → `macos.latest = dev + the 4 macos-specifics`.

**The "not global" learning holds:** don't infer "macos more reliable" from anecdote — measured, dev leads everywhere; macos's reliability = simplicity/age. Reconcile is dev→macos per capability, gated on dev's fixes landing.

## Report-back
- Architect (per-capability analysis): **DONE 2026-07-02** — dev canonical on ALL (otmux/c2/boot/install); dev 966 ahead, macos 4 unique. macos "reliability" = older/simpler, not superior. Direction: **dev→macos per capability, gated on dev-green** (g.1 fix + C.2/C.3). Reverse-port candidates = ONLY the 4 macos-unique commits (esp. `04b54a5` SSH-send Escape-before-Enter — review vs dev send). S3 = forward merge dev→macos, preserve the 4.
- PO (reconcile plan):
