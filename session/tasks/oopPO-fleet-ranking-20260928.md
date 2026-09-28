# oopPO RANKING — fleet stop release, 2026-09-28 (oopTeam + robbinTeam2)

**Authority:** TRON ordered the FLEET STOP and ruled that robbinTeam2's next assignments come from oopPO (relayed by ARON + robbin-po). **Ranked by HAZARD first, then CUSTOMER-VISIBLE DELIVERY, then FLEET HEALTH.**
**I rank; the owning PO routes and its experts build. I do not design and I do not implement.** TRON rules DONE, never me.

## RANK 0 — HAZARD: remove the data-destruction landmine (robbinTeam2, robbin-po routes)

`POST /api/model/generate` and `/api/model/generate-project` run the LEGACY generator (`write:true`, no `resolveByKey`) over a dir containing `file.ts`; chain units hold arbitrary uuids, so ONE run **MINTS DUPLICATES of TRON'S LIVE File model**. Spec `9979a2aa9`.

- **Containment-by-not-clicking is NOT an acceptable resting state.** It is a loaded gun on the customer's own surface: any restart, rebuild, deploy, demo, stray click or peer curl fires it. Same class as [[unshipped-destructive-change-keep-tree-clean-as-patch]].
- **FIRST, CHEAP, NOW: make the path unreachable** — disable or hard-guard both endpoints (refuse unless an explicit override). Minutes of work; removes the landmine without waiting on the real fix.
- **THEN the real fix:** FIX-1 `resolveByKey` as the persist default + FIX-2 `persisted==derived` gate.
- **GATE (non-negotiable):** the gate must be proven FAILABLE by seeding a duplicate-mint and observing RED, then revert to GREEN. A guard that has never failed proves nothing (PO-DOCTRINE-10.5).
- **NEVER run the legacy generator against Tron's live scenario dir to test it.** Build a fixture. [[dont-force-prod-mutation-build-safe-test]]

## RANK 0b — ★★ NOTHING GATES A PROD DEPLOY. CLOSE THE PATH BEFORE SHIPPING ANYTHING ELSE (robbinTeam2)

**Measured by robbin-expert, reported by robbin-po, 2026-09-28.** All **63** `ci:gates` — including every gate built today — **gate CI ONLY**. `.githooks/pre-commit` runs camelcase + staged-declared(warn) + regens and nothing else; there is **NO pre-push hook**; and **a prod deploy here is a LOCAL commit+build+restart that never touches CI.** The same `dist` phantom therefore shipped **TWICE** (v0.8.237 and v0.8.239): the atomicity gate has never once run at deploy time.

**THIS OUTRANKS R1, and the reason is the whole point:** R1 is a *known, bounded, diagnosed* defect on Tron's surface. This is **the mechanism by which ANY defect reaches him — including every one we have not found yet.** Fixing it prevents a CLASS; fixing R1 first ships the next fix *through the very hole we just measured*. **Do not ship R1 through an ungated path — close the path, then ship R1 through it and let the gate prove the deploy.**

Same failure family as our other vacuous passes, one level up: a gate that **excludes the path that ships** is decorative, exactly as my `0 dangling` was vacuous for excluding the only pointer that could dangle, and as `gen/oosh` drifted for being committed but orphaned from the pipeline that regenerates it. **EXISTS ⊂ COVERS ⊂ TRUE** applies to gates too: 63 gates EXIST, they do not COVER the deploy.

**RANKED DECISION on where to enforce — `start.mjs` is load-bearing, pre-push is a second net, and they are NOT interchangeable:**
1. **`start.mjs` IS THE ENFORCEMENT POINT (do this one).** The deploy path here *is* the restart, and `start.mjs` is already ON it and already refuses a dirty tree — so it already has the right semantics and the right position. Gates placed there make an ungated deploy **structurally impossible**: construction, not convention.
2. **A pre-push hook is NOT sufficient and must not be mistaken for the fix** — a deploy here does not necessarily push, so pre-push gates *the wrong event*; and hooks are per-clone and bypassable (`--no-verify`). Add it as a broader net, never as the closure.

**PROPORTIONALITY — do NOT put all 63 in `start.mjs`:** a boot-time gate must be FAST and scoped to **deploy integrity** (`check:dist-atomic` / entire-dist-git-clean, served==committed for every asset, version BUMP present). A slow boot gate gets bypassed, and a bypassed gate recreates the convention we are removing. Keep the full 63 in CI; add pre-push as the wide net.

**GATE THE GATE:** prove it failable AT THE DEPLOY POINT — seed a dirty/stale `dist`, confirm `start.mjs` REFUSES to start, revert, confirm it starts. A deploy gate that has never refused a deploy proves nothing (PO-DOCTRINE-10.5).

**Credit + accepted:** `check:dist-atomic` was itself blind (it iterated only MANIFEST-referenced bundles, so it missed dynamically-imported code-split chunks AND deletions); hardening it to assert the ENTIRE dist is git-clean, proven RED-before/GREEN-after on exactly that shape, is the right fix and is accepted (`7251cb8af`, v0.8.239 `3b2f8efc8`).

**★ LAW from robbin-po's own disclosed error, banked for both teams: A GREP HIT IS NOT EXECUTED CODE.** It reported the hooks ran `ci:gates` after grepping that string out of a **COMMENT**. Verify a MECHANISM by executing it or by reading the executed path — never by a string match. Same family as [[gate-that-mocks-the-mechanism-is-blind]] and the verifier-is-an-instrument law. The expert's measurement stood over its PO's grep, it said so unprompted, and that is the care-chain working.

## RANK 1 — CUSTOMER-VISIBLE: the lobby flap + reconnect storm (robbinTeam2)

Tron's room list flaps continuously — his daily experience of his own product is broken. Diagnosis is evidence-backed and fix-shaped: TWO builders send `ROOM_LIST`; the WS welcome (`server.ts:4930`) is owner-UNAWARE and fires PRE-AUTH (empty playerToken), so it OMITS his private owned rooms, while every other sender uses owner-aware `roomListFor(token)`. Reconnect storm spec `cdf69c6be`.

- **APPROVED AS robbin-po SPECIFIED — ship as ONE deploy:** the fix (ONE builder for all sends, emitted after auth) + the visibility set (WS close code+reason both sides, per-token reconnect counter+rate, alarm >5/min, client reconnect count) + **the BITE**.
- **The BITE requirement is RATIFIED and is the load-bearing part:** the fix removes the storm's ONLY symptom, so without visibility the storm continues invisibly. A fix that blinds its own detector is not a fix.
- Version BUMP mandatory (a fix committed without a bump is invisible to the served==committed guard) and verify the running PROCESS is current, not just the sha. PO-DOCTRINE-10.10.
- `HIS DATA IS SAFE` is accepted as measured: the flapping room's unit is byte-identical across 31 samples — a VISIBILITY defect, not storage.

## RANK 2 — FLEET HEALTH: SM at ~95 (already ordered by TRON)

TRON has staged `now rewind the SM at 95` directly in ARON's composer. **That order stands and outranks any relay of mine.** Nobody may key `Temple:0.0` until ARON consumes it — a send there DESTROYS it (see RANK 4).
- Render before driving (pulse is noise; only a fresh panel carries the decision). SM is zero-loss saved `90cecf6f`. ARON drives; land 40-50.
- **COVER THE WATCH GAP:** while the SM is down the fleet has NO watcher. The freshly-rewound trainer (46) takes the watch for that window, then resumes training.

## RANK 3 — DELIVERY BLOCKED ON TRON: oopTeam inc-4

oopExpert is standing down and CANNOT proceed: Tron's `go build increment 4` was **destroyed in transit** by the C-u defect. Only Tron can re-issue. oopExpert is HELD for this — delivery outranks driving, so it is NOT a driver while this is live. Also awaiting his duplication-cost ruling.

## RANK 4 — FLEET-WIDE DEFECT already in force: `otmux send` destroys staged composers

`/root/oosh/otmux:1967` issues `send-keys C-u` ("Clear input line") BEFORE typing, on every standard send to a Claude Code pane. Full report + required mechanism fix: `session/bugs/otmux-send-cu-destroys-staged-composer.md` (`f7c20cd2`). Owner = the otmux owner (ooshTeam); **oopTeam/robbinTeam2 do NOT patch `/root/oosh`.**
- **IN FORCE NOW, BOTH TEAMS:** `send.raw` only · READ the target pane before sending · verify delivery by CAPTURE not the echo · NEVER `C-u`.
- **SWEEP, BOTH TEAMS:** every agent reports whether it is WAITING ON SOMETHING THAT NEVER ARRIVED. FIVE of Tron's own directives were found staged in agent composers tonight; ONE is confirmed destroyed.

## RANK 5 — robbin-expert ~87: CORRECTION — the lever is a DEEP REWIND, not `/compact`

robbin-po proposed `/compact` as "its real relief". **REFUSED: `/compact` is FORBIDDEN fleet-wide (TRON's hard rule) for every agent** — only Tron himself may authorise it, and an SM's or a PO's word is not Tron's word. [[never-compact-rewind-is-the-lever]] · [[compact-only-tron-sm-word-is-not-tron-word]]
- A ~64 floor does NOT make a rewind pointless: canon says a front-loaded / old-bulk FLOOR is beaten by going **DEEP THROUGH it**, not by a shallow rewind at its edge (PO-DOCTRINE-10.2 — same tester 76→62 shallow vs 70→36 consolidated-deep).
- **★ SHARPENED BY ARON (accepted into this rank, `270b7167`): a FLOOR IS EXACTLY WHAT EXIT+REFORK (row 1c) FIXES — and "drive deeper" is IMPOSSIBLE until it is applied.** A floor means prior SHALLOW rewinds left the picker holding only post-rewind checkpoints, so **the depth does not exist to land on**. Row 1c restores the FULL checkpoint history by exiting and re-forking the agent's **OWN LIVE uuid, resumed FULL** (never the summary option — that is compact-equivalent and forbidden). **EVIDENCED TONIGHT, no longer theory:** the trainer was deadlocked at 84, zero drive capacity, picker of 8 = undrivable; after refork the picker read 19 and an ordinary 2-phase landed it **84 → 46**, phase-2 verified by content.
- ⇒ **ORDER OF OPERATIONS for any floored agent:** Phase-1 (committed AND **pushed**) → **exit+refork to restore depth** → THEN the 2-phase rewind → phase-2 reread. Floored agents are drivable **TODAY** and do NOT wait on Tron; drive capacity exists (ARON ~39, fresh trainer 46).
- **PRECONDITIONS — strict, non-negotiable (ARON's, ratified):** Phase-1 committed AND PUSHED first, because **the exit is IRREVERSIBLE**; and the uuid must be **MEASURED LIVE** (`claudeCode session.id`) — never a stored value, never the resume-line sitting in the shell scrollback, both of which resurrect an ANCESTOR session.
- **★★ PRECONDITION I ADD, from tonight's two findings colliding (oopPO, this is NEW): BEFORE ANY EXIT+REFORK, READ THE COMPOSER AND RESCUE ANY STAGED CUSTOMER DIRECTIVE.** Row 1c destroys composer + queue **BY DESIGN** — and tonight we established that **TRON STAGES DIRECTIVES IN AGENT COMPOSERS** (FIVE found in one evening; one already destroyed by the C-u defect). An exit+refork on a pane holding an unconsumed Tron word destroys it just as surely as the C-u does, only deliberately and unrecoverably. ⇒ **capture the composer, relay any staged directive to its owner and confirm receipt, THEN exit.** Never exit a pane holding a word the customer has not yet had consumed. Queued briefs are lost-by-design and must be re-dispatched after phase-2.

## RANK 6 — awaiting TRON personally (relayed, not actionable by us)

T41.1 File QA accept (blocks T41.2 Folder) · set-as-current on T41.6 `43a1f664` (owner-gated) · plus RANK 3's two items. The T41.6 verified-safe persist write stays **AUTHORIZED-BUT-SUSPENDED** by robbin-po (10 resolve / 18 mint / 4 re-home / 0 delete / 0 re-key, Folder EXCLUDED because Tron blocked Folder) — I do not lift another PO's suspension on its own product.
