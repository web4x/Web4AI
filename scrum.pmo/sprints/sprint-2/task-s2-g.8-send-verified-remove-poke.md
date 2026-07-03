> ⬆ **[Sprint 2 · task-s2-g](./task-s2-g-otmux-send-reliability.md)** — sub-task; back to parent task.

# Task S2-G.8: REMOVE the poke — send.verified = Escape+single-Enter, honest rc (Tron directive)

**From TRON (2026-07-03, CRITICAL, top priority):** the poke-retry loop is a HACK — it sprays blank Enters (live demo: poked **2×** on a shell → cosmetic empty prompts; on a claude PICKER an extra Enter = accidental select). **Reliability must come from the ESCAPE (dismiss @-autocomplete so the ONE Enter lands), NOT from retrying.** Stage once → Escape (claude+idle only) → SINGLE Enter → verify → honest rc {0 committed / 2 staged}. If not committed → return rc2, the CALLER decides — NEVER auto-spray Enters.
**Role**: architect (clean design) → expert (impl) → tester (re-verify).

## Why the poke was wrong (and redundant)
The original problem: the `[@`/`/` prefix opens Claude's @-mention/slash **autocomplete**, which EATS the Enter → text stages uncommitted. The poke loop "fixed" this by re-pressing Enter up to N times. **But the ESCAPE already dismisses the autocomplete** — so after Escape, ONE Enter commits. The poke was compensating for a problem the Escape solves → redundant, and HARMFUL: (a) extra Enters land as blank prompts on a shell (the vacuous no-`❯` verify mis-reads "still staged" → pokes again — the 2× Tron caught); (b) an extra Enter into an open picker SELECTS an option. Delete it.

## Clean contract — `otmux.send.verified <target> <text> <?settle:0.6>`
ONE attempt, no loop, no maxpokes. Returns **rc 0 committed / rc 2 staged (not committed) / rc 1 error**.

### CLAUDE + IDLE
1. `C-u` — clear any stale/partial input.
2. Stage text ONCE: `send-keys -l "$text"`.
3. **Escape** — dismiss @-mention/slash autocomplete. **ONLY when claude AND idle** (capture: no `esc to interrupt`). This is THE reliability mechanism: the one Enter now can't be eaten.
4. **SINGLE Enter.**
5. settle (~0.6s), then verify ONCE (g.7 region scan): the distinctive **tail probe** must have LEFT the input region (last `❯` row → bottom). Absent → **rc 0 committed**. Present → **rc 2 staged**.
6. **No poke. No retry. No second Enter.** rc2 → return; the caller decides.

### CLAUDE + GENERATING (busy)
- **NEVER Escape** (would interrupt — Tron's hard rule). Skip the Escape; single Enter (or leave staged). Verify → almost always **rc 2 staged** (agent busy) → honest return, caller re-drives when idle. Never interrupt, never spray.

### NON-CLAUDE / SHELL
- `C-u`, stage once, **NO Escape** (no autocomplete; Escape could disrupt), **SINGLE Enter**, light-verify (no `❯` → dispatch is best-effort rc 0). **No poke** — this alone removes the 2× blank-Enter Tron saw on the shell.

## Where the legitimate RETRY lives (the key architecture point)
Retry is NOT deleted — it MOVES to the right layer. `send.verified` = ONE honest attempt. A staged (rc2) message is re-attempted by the **queue/drain** on the next IDLE cycle: `agent.queue.drain` re-drives a FRESH single-shot (C-u clears the old stage → re-stage → Escape → one Enter). That is a clean re-attempt gated on idle, **not** blank Enters into a live pane. Composes with the existing rc0-gated dequeue (a420664) + the auto-heal rc2 dup-fix (fccdad8): rc2 stays queued, re-drives cleanly, no dup (C-u clears before re-stage).

## Caller impact (minimal — rc2 semantics already handled)
- `send.smart` → `send.verified … ; return $?` (unchanged; drop the `timeout=3` poke arg).
- `agent.inform`/`agent.send` → already return rc2 without re-queue-dup (fccdad8); `drain` gates dequeue on rc0, keeps rc2 queued. **No caller change needed** — they already treat rc2 as "not committed, keep/re-drive". Only the meaning tightens: rc2 now = "one clean Enter didn't commit" (not "failed after 3 pokes").
- Signature: drop `<timeout/maxpokes>`; optional `<settle>`. RESULT=COMMITTED/STAGED unchanged.

## T-SEND-MATRIX impact (update, not regress)
- **B2** "staged → rc2 (poke → rc0)" → **"staged → rc2 (no poke; caller re-drives via drain)"**.
- **D group (poke)**: D1 (claude poke) **REMOVED**; D2 (non-claude no-poke) now universal; **D3 idempotency STRONGER** (single Enter, no dup — assert **exactly ONE Enter** in the keystream); D4 (maxPokes bound) REMOVED.
- **NEW cell**: assert **no stray Enter** — send to a shell emits exactly ONE Enter (not 2); send that stages emits ONE Enter then returns rc2 (no further Enters). This is the demo-caught regression guard.
- H (wrap) unchanged (g.7 region verify retained). G (hazards) unchanged (Escape still isClaude+idle gated).

## Acceptance / handoff
- [ ] `send.verified` = stage-once → Escape(claude+idle only) → SINGLE Enter → region-verify → rc{0/2}. NO loop, NO maxpokes, NO second Enter on any path.
- [ ] shell = single Enter, no Escape, no poke (kills the 2× blank prompt).
- [ ] generating = no Escape (no interrupt); staged → honest rc2.
- [ ] rc2 → caller/drain re-drives a fresh single-shot; no dup (C-u clears).
- **Expert**: rewrite `otmux.send.verified` (otmux:1829) per the contract; delete the poke loop; keep the g.7 region verify; drop the timeout arg from send.smart's call. Commit.
- **Tester**: re-verify T-SEND-SELFHEAL + T-SEND-MATRIX B/D/H — assert **exactly one Enter** per send (keystream count), rc0 on commit, rc2 honest on staged, **zero blank-Enter spray** on a shell, Escape only on claude+idle.

## Report-back
- Architect (clean no-poke design): **DONE 2026-07-03** — poke deleted: it was redundant (Escape already makes the single Enter land) + harmful (blank-Enter spray on shell/vacuous-verify, accidental select on a picker). Contract: stage-once → Escape(claude+idle ONLY, never shell/generating) → SINGLE Enter → g.7 region-verify → honest rc{0 committed/2 staged}; rc2 → caller decides, NEVER auto-spray. Retry moves to the queue/drain layer (fresh single-shot on next idle, C-u-clean, no dup) — composes with a420664 rc0-gate + fccdad8 dup-fix. Matrix: remove D-poke cells, add a "exactly-one-Enter / no-stray-Enter" guard.
- Expert (impl): **DONE 2026-07-03 `494597e`** (dev). DELETED the poke loop from `otmux.send.verified` entirely — gone: the `for (( i=1; i<=maxpokes ))` loop, `maxpokes`/`timeout` arg, every 'poke' log, the 2nd/Nth Enter, the retry. New body: stage ONCE (`C-u` + `-l "$text"`) → capture-once → **Escape ONLY if claude AND not generating** (`esc to interrupt` guard) → **SINGLE Enter** → **one-shot g.7 region-verify** (probe = last-24 tail; STAGED iff still in the last-❯→bottom input region, COMMITTED once it moves above ❯; shell has no ❯ → empty region → committed) → honest `rc{0 COMMITTED / 2 STAGED}`. NEVER re-Enter — rc2 is the caller's call (drain layer re-drives a fresh single-shot next idle). `send.smart` Step 3 drops the dead `3`/timeout arg + the stale "pokes ENTER-ONLY" comment. **VERIFIED (keystream count):** shell = **1 Enter, 0 Escape**; claude = **1 Escape, 1 Enter**; send-matrix **12/12**; `bash -n` clean (goes live to all agents). Ready for tester re-verify (exactly-one-Enter/send, zero blank-Enter spray on shell).
- Tester (re-verify): READY — T-SEND-SELFHEAL + T-SEND-MATRIX B/D/H: assert EXACTLY ONE Enter per send (keystream count), rc0 on commit / rc2 honest on staged (no auto-spray), ZERO blank-Enter spray on a shell, Escape only on claude+idle (not shell/generating). Commit `494597e` on dev. (D-poke cells now obsolete — replace with the exactly-one-Enter guard per the architect note.)
