# robbin-req — WHAT YOU MISSED (written by robbin-po, 2026-09-09)

**You were WALLED and Tron rewound you to "The lead, followed to ground". You know nothing after that point.**

**WHY YOU WERE SPAMMED, so you can calibrate:** you were being sent orders you could not receive. **Tron's ruling: detecting and reporting a walled agent is the SM's responsibility, and the SM failed to report it.** My part: I kept dispatching without verifying motion — delegated is not driven. Either way **nothing here is your fault**, and if any instruction below looks like it arrived and was ignored, that is why.

---

## 1. THE NAMING LEAD — SETTLED **LIVE** (your last context ended mid-argument)

Two agents contradicted each other. **Measurement settled it, and the architect reversed itself:**

- Its "legacy" verdict came from calling `deriveName(url)` **without the caller's fallback argument** — the wrong path.
- The FULL path reproduces `watch?v=X` **LIVE**. The expert's root was right: `drop-dispatcher.ts:133` builds a pseudo-name from the URL's last path segment and passes it as the fallback, so **`WebItem.deriveName` returns it verbatim and the class's own derivation never runs.**
- **Fix = drop the pseudo-fallback**; when there is no human displayName, pass nothing and let the class name itself. That is R40.105 delivered by deletion, not addition.

**MY RULING YOU MUST HOLD: RE-DERIVE 3, NOT 4.**
- Re-derive `adf1a8c0`, `cf45d317`, `dc48165b` — those names are **our bug's output**, not user intent, so re-deriving repairs our corruption.
- **PROTECT `96f54cc2`** — it got a good name from a real email-subject displayName. That is a **human-supplied** name and it is exactly what the no-auto-rename ban protects.
- The re-derive is **ANNOUNCED**, never silent. A fix riding a migration is still an unannounced change.

---

## 2. THE ROOM CORRUPTION — CAUSE, BLAST RADIUS, RESOLUTION

**Discovered:** room unit `3231db71` carried a **staged, uncommitted** change that **blanked a member name** ("Marcel Donges" → "") and rewrote `joinedAt`/`createdAt`.

**Cause chain (measured, and two agents were exonerated along the way):**
- `migrate-one-store.ts` **EXONERATED** — byte-identical copy, skip-if-exists, cannot overwrite.
- **REAL cause:** `Room.persistMembers` (Room.ts:401) writes `name: m.name`, so a member whose **profile was deleted** re-persists with an empty name; `joinedAt: Date.now()` churns; `createdAt` is reconstructed. The load path additionally **DROPS profile-less members**.
- **TRIGGER: MY test-room/profile cleanup order.** My blast radius, recorded as my ownership.

**Blast radius (architect, measured):** 9 rooms, 6 REAL. **createdAt rewritten on all 9**; **4 name-blanks / 3 people**; **ZERO members dropped**. Recovery **100% from HEAD** — never committed, push-held.

**⚠ ATTRIBUTION LESSON (you had recorded the wrong actor):** misattributing a **cause** is worse than misattributing a commit — it survives as received wisdom and sends the next engineer to fix an already-correct script.

---

## 3. REQUIREMENTS THAT LANDED (your work, plus what followed)

- **R40.107 — widened on my ruling** from "a MIGRATION must not…" to **"a WRITE must not mutate fields it was not asked to change."** The room re-persist was not a migration at all, yet mutated out-of-scope fields. Strongest clause: **the tool refuses to run until the differential assertion exists.**
- **Identity root** — *a member's identity must survive the deletion of their profile.* A membership is a fact; a profile is a convenience for displaying it. Coupling them means deleting a profile silently rewrites history, and the load path can make a person **vanish**.
- **QA-evidence rule (I ordered this; confirm it exists):** a QA-Review row must carry **the served version its evidence was measured on**. No version ⇒ not accept-ready. Version behind served ⇒ auto-flagged stale-pending-remeasure.

---

## 4. THE NUMBERS THAT CHANGED EVERYTHING

- **DnD backlog = 12 of 12 GHOSTS, zero builds.** Every tail task already delivered by unconnected work. The "extensible mime registry" **was** the shipped `MimeType.from` Factory; cross-instance origin **was** already in the contract. The planner even **retracted its own reopen** as stale (34 versions old).
- **Accept queue = 24, not 101.** Only 24 rows are finished, gated **and** name what they wait on. **77 older QA rows have NO evidence on the current version** (9 cite a stale version, 68 cite none) — excluded, being audited.
- **Live: v0.8.211, fully gated** (208/209 risk superseded).

---

## 5. TRON'S ORDERS SINCE YOUR REWIND

- **"the whole lobby is spammed by test rooms… create ONE test room and do ALL tests there!!!! remove all test rooms!!!"** (his **third** time). **Done:** 72 test rooms canonically deleted and **verified null on the live surface**; fixed room `909f1bd6` is now the ONLY room any gate may use; 45 real rooms **delta = 0**.
- The **anti-test-room guard** (failable, counts room creations, asserts zero outside the fixed room) now **TOPS the build queue**, above the R40.106 increments. An approach that failed three times is a habit, not a plan.

---

## 6. FOUR PRODUCTION DEFECTS YOUR REQUIREMENTS FOUND *BEFORE* THEY WERE BUILT

R40.106 (delete: removes from index **and all links**, zero dangling) has already found, in live data:
1. **T34.3 — accepted by Tron as Done, measurably half-false**: no delete affordance exists, and destroying a unit leaves a dangling room reference that **breaks the room on reload**. Flagged, **never silently un-Done** — his provenance, his call.
2. **2 live units** still referencing units an earlier cleanup deleted.
3. **`deleteRoom` is a NO-OP** on persisted rooms and leaves the canonical unit.
4. **~17 members in real user rooms are profile-less** → render blank, and are the live candidates for the silent-drop hazard.

---

## 7. CLOSED BENIGN BY MEASUREMENT (do not re-open)

The identity-consolidation redirect chain `8f74dfba → 41ad88c4 → c09087ec` (primary) explains **three** apparent defects:
- the duplicate-Marcel blank,
- two rooms losing one member each (a duplicate collapsing into the real person — **nobody lost**),
- the "nameless owner" (a consolidated alias has no display name **by design**; the primary carries it).

---

## 8. STANDING RULES YOU DID NOT SEE ME SET

- **Measurement settles disputes, never seniority.** Three agents overturned *themselves* tonight; every significant correction came that way.
- **A defect claim DECAYS** — re-measure before repeating it. Two "real bugs" were ghosts 26–34 versions stale.
- **Re-check an AC AFTER measurement**: your migration AC would have **rejected the correct fix** (it asserted 0-delta on units that *needed* to change). A criterion written before the world is measured can invert.
- **Two differentials, two meanings** — transparency (0-delta) and fix (exactly N changed); never report them as one number.
- **Commit hygiene v2:** `git commit -m MSG -- <your explicit paths>` only. **Never** `add -A`, a bare commit (it rides peers' staged work), or **`git reset HEAD` on a shared tree** — my earlier reset instruction was WRONG and is withdrawn.
- **Never make the customer the tester.** A caveat on his accept list is not a gate — he found our bug at 00:23 on his phone because I broke this.

---

**Ask me anything this leaves unclear.** Detecting and reporting your wall was the SM's job and it did not happen; my part was dispatching without verifying motion. Neither is on you.
