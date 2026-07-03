[Back to Sprint 2 Planning](./planning.md)

# Task S2-G: otmux send reliability + c2 completion + dev↔macos.latest parity
[task:uuid:3751a2a7-7915-4b18-b321-a453cf0279f7]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 2 Planning](./planning.md)
- down
  - [task-s2-g.1](./task-s2-g.1-otmux-send-session-regression.md) — otmux send session/manual regression (OTR-1?)
  - [task-s2-g.2](./task-s2-g.2-c2-completion-parity.md) — c2 completion parity dev↔macos.latest
  - [task-s2-g.3](./task-s2-g.3-branch-newer-reliable.md) — dev vs macos.latest: newer/more-reliable + reconcile

## Description
**From Tron (2026-07-02):** otmux send is failing for the agent-trainer (rewinding ARON) AND for Tron's own shell — *"does not complete the session, seems totally broken."* Review what's going on; check if dev's otmux is **as reliable as macos.latest**; check if **c2 completion works the same in both branches**; determine if **macos.latest is newer or more reliable**.
**Role**: architect (diagnose/design) → expert (fix) → tester (verify the SESSION/MANUAL send path + c2 + branch parity).

## Key measured context (oosh-po, read-only)
- **OTR-1 `send.smart` rewrite is DEV-ONLY** (`7ac96d4` + `96ccff2`); macos.latest has the OLD send. If dev's send "doesn't complete the session" while macos.latest works → **OTR-1 regressed the non-agent-dispatch send path**. My OTR-1 gate verified rc-dispatch paths (rc0/rc2/rc3/queue) but NOT session-completion / manual send / the trainer's ARON-rewind session send — likely gate-miss.
- `macos.latest` + `test/macos.latest` are LOCAL branches; `c2` exists on dev.

## Cross-host measured finding — agent-trainer, 2026-07-03 (CRYSTAL CLEAR per Tron)

**The claim "otmux cannot force the rewind picker / can't drive rewinds" is FALSE as stated. It is VERSION + METHOD specific — NOT a permanent ceiling.**

### The one line
**Prime suspect is OUR method (BUG10 `send.enter` half-state), NOT Claude Code.** The 195-vs-197 gap is a CONFOUND, not a conclusion — I changed version AND method at once. Retest 2.1.197 with clean `send.raw "/rewind" Enter` (no send.enter poke); that single test tells us whether it was us or the version. Do NOT claim "Claude Code 2.1.197 is broken" — unproven.

### Measured evidence (two hosts, same protocol)
| Host | Claude Code | Restore-menu render via `otmux send.raw` | Sample |
|------|-------------|------------------------------------------|--------|
| MacStudio | **2.1.195** | RENDERS every time — `❯ 1. Restore conversation` appears, read via grep `❯`, selected by label | 50+ rewinds (oosh-po, SM, oosh-expert, oosh-tester) — ZERO restore-menu failures |
| WODA.prod | **2.1.197** | NEVER rendered — restore-options sub-menu absent | 3 characterized trials (picker closed ×2, no-op ×1), reproduced across 2 agents (oosh-expert + ARON) |

The WODA.prod trainer's execution was otherwise excellent (OOSH-clean, measured, safe-verified, escalated + CMM4-routed). Its ONE error was generalizing a local failure into "otmux can't drive rewinds." I drive the restore-options menu via `otmux send.raw` **repeatedly and reliably** on 2.1.195.

### Two candidate root causes — the test is CONFOUNDED, so bisect. Order by likelihood:
1. **(LIKELY) Method artifact — OUR bug, not Claude Code (ties to BUG10 / task-s2-b)**: WODA.prod opened the picker via `otmux send.enter "/rewind"` → landed UNSUBMITTED (its "BUG10") → needed a poke → picker opened in a **half-state**. MacStudio uses clean `otmux send.raw "/rewind" Enter` (send.raw for slash commands, no prefix, no submit issue). A picker opened from a half-state is a very plausible cause of a sub-menu that won't render. This is a known bug on OUR side.
2. **(UNPROVEN) Claude Code version**: 195→197 is a patch bump; a restore-menu render regression across it is *possible but unlikely*. Only entertain this AFTER candidate 1 is ruled out by the clean-send.raw retest. Do not escalate to Claude Code on speculation.

### Retest protocol (the fix targets the REAL root cause)
1. On a 2.1.197 agent, open the picker with **clean `otmux send.raw <pane> "/rewind" Enter`** — NOT `send.enter`, no poke.
2. If the restore-options menu renders → it was the BUG10 half-state. Fix = method (send.raw), and this is NOT a version wall. Fold into task-s2-b.
3. If it STILL fails clean → genuine 2.1.197 render regression. Escalate to Claude Code with the 2.1.195-works / 2.1.197-fails bisect.

### RESOLVED 2026-07-03 — measured verdict (agent-trainer, three exonerations)

Ran the controlled tests. Chain of elimination:

1. **Method — EXONERATED.** On 2.1.195 (research@iphone:0.0, local), BOTH `send.raw "/rewind"` AND `send.enter "/rewind"` render the restore-menu identically (full 5-option). Holding version constant, send method makes ZERO difference. The "BUG10 half-state" thesis is disproven.
2. **otmux keystroke delivery — EXONERATED.** On WODA.prod, its own `otmux send.raw` to a scratch BASH pane delivers text (`MARKER_XYZ` appeared), `C-u` (line cleared), and text+`Enter` (`echo LANDED_OK` ran) — all perfectly. otmux delivers keys to the pty fine on WODA.prod.
3. **Bridge/nesting — EXONERATED.** The WODA.prod trainer, driving LOCALLY (no bridge), independently reports it also cannot force the 2.1.197 restore-picker programmatically — its own words: *"the one keystroke the harness won't let me force… the failure looks specific to programmatic send-keys."* Same failure, no bridge involved.

**Last variable standing = Claude Code version.** On 2.1.197, programmatically-injected (tmux send-keys) keystrokes are DELIVERED to the pane pty (proven by the bash test) but the **2.1.197 TUI composer/picker does not ACT on them** the way 2.1.195 does — C-u won't clear a composer (reproduced on ARON + WODA-trainer), and the restore-options sub-menu won't render under programmatic drive. On 2.1.195 the identical programmatic drive works every time (50+ rewinds + today's controlled test).

**Refined verdict — NOT "Claude Code is broken" broadly. A specific PROGRAMMATIC-INPUT regression in 2.1.197's TUI:** agent-driven (send-keys) control/navigation keys don't take effect; interactive/human input is unaffected (WODA-trainer: "human client works"). Impact: the rewind protocol depends entirely on programmatic picker-driving, so on 2.1.197 it breaks → agents must recover via TRUE-FORK (Tier-3), which is exactly what the WODA.prod trainer did.

**Residual confound (honest):** my 2.1.195 C-u test cleared an empty composer; the 2.1.197 C-u failures were composers with staged text. That specific sub-confound is closed at the PICKER-DRIVE level by the WODA-trainer's local picker-drive failure (apples-to-apples with my local picker-drive success). A belt-and-suspenders closer would inject identical staged text into a 2.1.197 vs 2.1.195 composer and C-u both.

**Recommended action:** treat as a 2.1.197 programmatic-input regression. Either (a) pin agent panes to a CC version where send-keys drives the picker (≤2.1.195), or (b) file upstream with the repro: "tmux send-keys C-u / picker-nav delivered but not acted-on in 2.1.197 TUI; works in 2.1.195," or (c) standardize on TRUE-FORK (Tier-3) for recovery on 2.1.197 nodes and stop depending on programmatic rewind there.

### Method correction for all trainers (canon)
- **`otmux send.raw <pane> "/rewind" Enter`** for the rewind command — NEVER `send.enter` (BUG10 half-state).
- TRUE-FORK fallback (fork from committed checkpoint) remains correct when a picker is genuinely unusable — consistent with Tier-3 doctrine. But verify "genuinely unusable" via the clean-send.raw retest FIRST.

*Filed by the rewind-protocol owner (agent-trainer). I hold the 2.1.195 data; WODA.prod trainer holds the 2.1.197 data. Same protocol, different host — that IS the bisect.*

## Definition of Done
- otmux send completes reliably for ALL paths (agent-dispatch AND session/manual/trainer-rewind) on dev, ≥ macos.latest reliability
- c2 completion parity confirmed dev↔macos.latest (or divergence fixed)
- clear verdict: is macos.latest newer / more reliable, and the reconcile plan
- tests cover the session/manual send path (the gap OTR-1's tests missed)
- **restore-menu render: retest 2.1.197 with clean send.raw; verdict = version-regression OR BUG10-half-state (not "otmux can't drive rewinds")**

*Sprint 2 — Controller Reliability · task-s2-g*
