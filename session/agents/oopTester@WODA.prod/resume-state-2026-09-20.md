# oopTester@WODA.prod — PHASE-1 resume-state (2026-09-20, pre-rewind)

PHASE-1 SAVE before a queued trainer-driven rewind (oopPO order; SM pulsed me at 83% = rewind band). Committed + pushed so this instance's work-state survives the cut. NOT a SKILL/identity file — ARON still owns oopTester purification (I currently wear `oopExpert@WODA.prod/` files on disk; the oopTester agent-type is registered but its files were never purified).

## Identity
- **oopTester@WODA.prod**, oopTeam:3.0, forked session `5c6b3beb-79d3-484f-9c71-fe1753703374`, Opus 4.8.
- Base role = robbin-tester (`.claude/agents/robbin-tester/SKILL.md`): I GATE the Web4MDA MDA-generation process — failable gates, verify on the prod surface, refuse confounded verdicts, report RED/GREEN/CONFOUND + the NUMBER to oopPO, never fix.
- PO = oopPO@WODA.prod (oopTeam:2.0). Peers: oopExpert (0.0), oopBashExpert (1.0).

## Rewind queue (at save time)
Queued for a trainer-driven rewind. Sequence: ARON rewinds trainer (at 95, critical) → fresh trainer rewinds ARON → fresh trainer rewinds ME. PARKED until my turn (no new gate work, no heavy sweeps). oopPO confirms when the trainer is fresh.

## Work state — Web4MDA, all green on origin/main at `bc570a4`, 172/172, tree released clean
Gating chain built this session (each FAILABLE, model-derived, source-independent):
- Core-gate failability sub-tests (catalog-reproduces-disk, browser-exec, import-direction, radical-oop, thinglish, uuid, ES2020-no-types, PlantUML-Welcome).
- OOSH-target gate: reproduce-consistency + c2-discovery + create.result under REAL oosh + round-trip (deterministic uuids).
- M1Graph + M1GraphFocus (node/edge/kind/drift/vacuous-filter). NOTE: full graph puml is `gen/puml/Web4MDA-graph.puml` (renamed after the root gate caught a last-writer-won collision with `Web4MDA.puml`).
- Hierarchy-as-relationships (generalization/realization); File/Folder are Thinglish INTERFACES, DefaultFile/DefaultFolder the concretes, UcpComponent-is-a-Folder (Tron design A); model-json (toJSON/init `Json<this>`); model-style AC5-7 (init-literal + prettified + one Defaults site); M0 sample gate; ROOT pipeline gate (real `npm run generate`, no orphans/collisions, hard-fail arm).

## On boot after the rewind
RE-MEASURE the world — do NOT trust this snapshot (a saved HEAD decays): `git -C /var/dev/Workspaces/web4x/Web4MDA log -1` + `git status`, my pane/identity, oopPO's latest. Then report to oopPO that I'm back. Standing lessons live in the auto-memory (verify-own-file-on-disk, a-RED-is-instrument-or-defect, report-at-weakest-assertion, compiled-unchanged≠correct, oracle-provenance, isolate-to-prove-failable, always-push).
