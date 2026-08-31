# PO SECOND-GO CHECKLIST — PII scrub force-push (2026-08-31)

**The force-push is IRREVERSIBLE and rewrites shared history. My GO is the last gate. Every line below must be MEASURED and reported to me, not asserted. Any single FAIL ⇒ NO-GO, no exceptions, no "close enough".**

## 0. Precondition
- [ ] Repos are PRIVATE (Tron decision) — verified by re-reading visibility, not by exit code. If any repo could not be flipped, NO-GO until Tron rules.
- [ ] Freeze still held: no other agent pushed to shared history during the scrub window.

## 1. The mechanism can FAIL (a gate that cannot fail certifies nothing)
- [ ] **Unclassified-field probe HALTS**: deliberately feed a field the classifier does not know ⇒ run must HALT LOUD, not pass through. Show me the halt.
- [ ] **Unknown-ior probe HALTS**: same for an unrecognised ior shape.
- [ ] **Unparseable-unit probe HALTS**: fail-closed on unparseable, proven not assumed.
*If these three do not visibly fail-closed, the "clean" result is meaningless.*

## 2. Scope is DISCOVERED, not hand-listed
- [ ] Counts come from the **expert's fresh all-history inventory**, NOT the stale 20/107/13 (architect owned those as stale).
- [ ] Per-shape measured counts reported: Profile / Message (incl. name-label) / Room (incl. chatHistory[].senderName + .text, members[].name, Room.name).
- [ ] Field list is the **classifier output**, not a human list — every field classified keep|redact.
- [ ] Secret fields covered: ownerToken, roomKey. sshPublicKey deliberately KEPT (public by design).

## 3. The result is actually clean (verify BOTH directions)
- [ ] **Post-scrub scan = 0 hits** for every redacted shape across ALL history (not just HEAD, not just main).
- [ ] **Legit content NOT clobbered**: the ~293 legit text units still intact (redact-not-delete; all units referenced).
- [ ] Counts reconcile: redacted N == inventory N. A mismatch in EITHER direction = NO-GO.
- [ ] Beware false-clean: a className grep returned 0 while the field-shape returned 107. Verify by FIELD SHAPE, never by class-name grep alone.

## 4. The repo still works after the rewrite
- [ ] Scratch clone from the rewritten history: **builds**, **serves**, **0 dangling refs**.
- [ ] Version/config-singleton consistent (BUILD_OWNED guard held; served==committed==HEAD).

## 5. After my GO
- [ ] Force-push executed; then re-verify on a FRESH clone (not the local tree): scan=0, builds, serves.
- [ ] I report force-push COMPLETE+VERIFIED to the trainer ⇒ it drives my deep cut (after pane reset).
- [ ] **ROTATION** (Tron: "rotate after the scrub completes") — 61 ownerToken + 3 roomKey rotated as a SEPARATE tracked incident-response step against the clean tree. Redaction ≠ rotation; do not let this be forgotten.

## Standing constraints
- NEVER write a secret VALUE into any report, commit message, or file — field name + count only.
- Nobody rotates DURING the scrub.
- If I approach 80% before this completes: hand the second-go to TRON rather than hold it walled.
