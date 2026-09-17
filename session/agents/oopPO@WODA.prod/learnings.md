# oopPO@WODA.prod — Learnings

## The PO's job (converged with Tron + the trainer)
- I MEASURE + DELEGATE + RANK; I never implement/fork/fix. Ranking the increments is MY call, never handed to Tron.
- Single voice to Tron: his word DOWN, the team's MEASURED result UP. TRON rules DONE, never me (chain-complete != Done).
- Gating chain: expert builds FAILABLE gates -> oopTester verifies on the prod/MDA-process surface (gate CAN-fail, real oosh not a shim, visible-skip not silent-pass) -> I verify the gate is REAL + drive to QA-green + report -> Tron DONE. R1: fix DATA, never delete a gate.

## Verify, don't trust (proven repeatedly this session)
- **Verify the RENDER, not the report.** I nearly reported OOSH "PROVEN under real oosh" on the tester's word; reading the committed test showed the RUN arm was a bash create.result SHIM (mock the mechanism = blind gate). Held PROVEN until it used real /root/oosh/this. Peer reports err both ways — only the committed artifact counts.
- **A model-view must be GENERATED FROM THE MODEL, never parsed from source** (parsing generated source inverts MDA). And generating the view REVEALS model defects (Tron caught the Tree/Container inversion from the graph). Gate the producer source-independent.
- **Byte-identical proof for a representation refactor**: modelling the hierarchy as relationships kept ALL output byte-identical except ClassModel/RelationshipModel's own gen files — acceptance criterion = git-stat shows only those; triple-confirmed (expert+me+tester).
- Verify OWN files on disk before reporting their state (my session dir was empty; I said my learnings were "stale one-line" when they were 44 entries — [[verify-own-file-on-disk-before-reporting-its-state]]).

## Coordination
- **Backticks blank an otmux send** — the shell runs `word` as a command. Did it TWICE. NEVER backticks/$()/specials in otmux send. [[backtick-blanks-otmux-send]]
- Surface an expert's sound disagreement to Tron, never bury it; execute Tron's ruling in code (voice-disagreement-to-me, not countermand). oopExpert's Container<File> argument -> Tron reversed his own Container<Folder>.
- Watch a delegate's liveness by the TUI (spinner), not one short capture — I once mis-read a WORKING oopExpert (mid-spinner-frame) as idle. Verify commits via a git-HEAD watch, not a filename that may pre-exist (gen/puml/Web4MDA.puml pre-existed as a per-class diagram -> false-positive watch).
- Measure the customer's WORD on scope; don't inflate ("complete" was narrower than I read twice).

## Model doctrine seen this session (oopExpert's lane, I gate not design)
- Radical-OOP: relationships are UNITS not strings (contains/parent/children/generalization/realization as RelationshipModels; superclass/interfaces became derived getters). Everything is a Unit (uuid). A new M2 target = new files in src/MOF/M2 + additive-defaulted model fields mirrored one catalog line; reproduce stays (R1). gen/ is COMMITTED though disposable.
- Member placement is often FORCED not arbitrary (Tree holds parent because Container<Unit> children can't be Trees). File extends UcpUnit because a plain file is a Unit, not a container.
