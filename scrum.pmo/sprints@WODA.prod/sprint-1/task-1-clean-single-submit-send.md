[Back to Sprint 1 @ WODA.prod](./planning.md)

# Task 1: `send.verified` clean single-submit (poke removed)
[task:uuid:fa66cc8a-f073-4b4d-8192-36de1c8a9f7e]

## Status
- [x] Planned
- [x] In Progress (refinement · test cases · impl · testing)
- [x] QA Review
- [x] **Done — QA-ACCEPTED (TRON, 2026-07-03)**

## Description
A send is **type text → press Enter, once**. `otmux.send.verified` must NOT be a retry loop.
Final contract (once.sh@dev `494597e`, arc `fccdad8`/`d4e3ae0`/`6213ad6`/`bcd8f84`/g.7):
- **stage ONCE** (`C-u` clear + `send-keys -l`)
- **Escape** to dismiss `@`/`/`-autocomplete — **CLAUDE + IDLE only** (never a shell, never a generating agent → never interrupts)
- **SINGLE Enter** — the Escape makes that one Enter *submit* (not a swallowed newline)
- **one-shot** g.7 region-verify → **honest rc {0 committed / 2 staged}**
- **NEVER re-Enter / NEVER poke.** A staged (rc2) message is retried by the **drain layer** as a *fresh single-shot* on next idle (C-u-clean, composes with the rc0-gate + dup-fix) — the caller decides, the send never auto-sprays.

## Root causes closed (why this was hard)
Dup came from re-delivery (enqueue `fccdad8` + drain `d4e3ae0`); BUG10 "Enter=newline" came from the `[@`/`/` autocomplete eating the Enter (fixed by the idle-only Escape); the **poke loop itself** sprayed blank Enters (shell 2×) and risked picker mis-selects — deleted in `g.8`.

## Test cases
- **TC-1.1** [test:uuid:3e382087-17ee-4146-b36e-ea1b49babb17] — **exactly ONE Enter per send.** Keystream count: shell = 1 Enter / 0 Escape; claude = 1 Escape / 1 Enter. No 2nd Enter on any path. → **PASS** (expert keystream-verified `494597e`).
- **TC-1.2** [test:uuid:ead5acdc-57ae-49ac-9980-c7d8ff7e12c5] — **no duplicate.** A single send is delivered exactly once. → **PASS** (live testSend: `CLEAN-RX-from-0.0` printed once; `test.send-selfheal` 5/5; `T-SEND-MATRIX` D3).
- **TC-1.3** [test:uuid:a003e3f0-b6fb-49fb-a9bf-949cd5d811f4] — **no stray-Enter spray on a shell.** Zero blank prompts after the send. → **PASS** (live testSend: one prompt after `CLEAN-RX`, vs pre-fix TEST-1's 3 blank ` >` prompts).
- **TC-1.4** [test:uuid:48388150-fb02-4bfc-ad13-da547550f189] — **honest rc, no re-Enter.** rc0 committed / rc2 staged; on rc2 the log says `NOT re-Entered (drain/caller retries fresh)`. → **PASS** (live testSend log; `T-SEND-MATRIX` rc contract).

## QA record (step-by-step)
1. architect design (`g.8 5668c71`) — PO signed off ✅
2. tester cases (`test.send-selfheal`, `T-SEND-MATRIX` superset) ✅
3. expert impl (`494597e` — poke loop deleted, keystream-verified) ✅
4. tester run: send-selfheal 5/5, send-matrix 12/12 ✅
5. **PO independent proof** (live testSend, full output, no truncation): single Enter, delivered once, zero poke logs, zero blank-spray ✅
6. **TRON final acceptance: 2026-07-03** ✅

## Definition of Done  — MET
- exactly one Enter/send · delivered once · no interrupt (idle-only Escape) · honest rc · no poke/retry in send (retry = drain layer) · proven live + tester suites + TRON-accepted.
