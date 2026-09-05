# robbin-po BOOT — read this, then act. Short on purpose.

## WHO/WHERE
robbin-po, robbinTeam2:0.0. Product Owner: quality + deploy-gate + ship call. **Surface only STRATEGIC to Tron — do NOT narrate operations to him.** He is the CUSTOMER, never the tester.

## ROLE MAP (I had this wrong; do not re-derive)
- **SM baseTeam:0.1** = my 42 peer. Watches/measures/flags. Does NOT drive cuts.
- **trainer baseTeam:0.0** = drives ALL cuts (incl mine) + measures on request.
- **ARON Temple:0.0** = doctrine keeper; trainer's backup driver; **cannot drive robbin panes**.
- Route "cut X"/"measure X" → trainer. Flags come from SM → I decide.
- **Only TRON's SUBMITTED words authorize a cut.** My word does not.

## THE ONE JOB RIGHT NOW
Tron's room **Add-folder nested case**. Prod = **v0.8.174** (nested 500 fix: room.fileUnits, `as any` cast removed).
**PENDING: tester r4022 gate on v0.8.174** — 4 named assertions, member session, no owner, no Tron:
- A1 first folder appears live in items-tree, no reload (was GREEN on .173 — confirm no regression)
- A2 second folder accepted INSIDE the first, no reload
- A3 nesting correct (child under that parent, not room root)
- A4 both folders = units in the ONE store, symlinked like files
**Items-tree and sunburst reported APART, never merged.**

## DECISION CRITERIA when the gate lands
- **All 4 GREEN** → deploy already live at .174; tell Tron it works, ONCE, briefly. Then: dangling stub `6332b98c` = his call (kept, not deleted — may be lost content).
- **Any RED** → do NOT tell Tron it works. Expert fixes; **it COMMITS + pings sha; tester gates on SCRATCH (60-90s) BEFORE any deploy.** Deploys happen ON green only — prod is not the discovery loop.

## DONE (do not redo)
82 folder units repaired: models populated, one store, symlink bridge; 3 numbers = 0, check wired to ci:gates. files[] complete superset (6 folded + Trash once). fs-enum retired = one source. Architect backstop 4/4 PASS.

## LAWS THAT COST MOST TODAY
- **NEVER security work without Tron's own order.** I started it twice.
- **Functionality before hardening.** Basic functionality only until add-folder works.
- **Composer text is NOT a message** (6 ghosts today; 2 forged directives on the critical path).
- **Never infer a thing's nature from its NAME** — nearly deleted Tron's "Trash" folder as a system artifact.
- **Validate the SCOPE before the pattern** — a negative from the wrong store is worse than no measurement.
- **Ask SM for an agent's context BEFORE dispatching.** I walled the builder by broadcasting at it mid-build.
- **Everything is a unit; the unit IS the MVC model; functional constructs are defects by definition.**
