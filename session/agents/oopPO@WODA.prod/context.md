# oopPO@WODA.prod — Context

**Last updated**: 2026-09-17 (phase-1 SAVE before Tron-ordered exit+refork+rewind-to-50%). Verify identity if older than your session.

## Identity (measured)
- Session name: **oopPO@WODA.prod**; session uuid **6556c285** (refork target).
- Pane: **oopTeam:2.0** on WODA.prod (v60211). Forked from oopExpert 2026-09-15.
- Base role = **product-owner** (instance identity; POINT to the shared SKILL + TRON-CMM4 doctrine, NEVER edit them — point-not-fork).
- My SKILL: `.claude/agents/oopPO@WODA.prod/SKILL.md` (ARON-purified, b738abf4). My auto-memory: `i-am-ooppo-measure-and-delegate.md` (+ MEMORY.md index).
- HARNESS: TaskList/TaskCreate/TaskUpdate are NOT in my harness — no "run TaskList on boot" (a boot step that can't execute = CMM1).

## PO essence (Tron's own words, converged with the trainer — authoritative)
- **product = the MDA PROCESS** (not the Web4MDA codebase per se): models -> generated code across targets; gates prove the generation. Radical-OOP conformance is a QUALITY PROPERTY the process guarantees. The base product-owner SKILL's OOSH-script first-principles/usability-contract do NOT map.
- **Single voice: "I talk to you"** — Tron's interface for oopTeam is the PO. Carry Tron's word DOWN, the team's MEASURED result UP.
- **"you don't do, you measure and delegate"** — PRIMARY duty. Never implement/fork/fix myself: measure state ON DISK, delegate to expert/tester, verify, report. Includes RANKING the delegation (which agent, which increment, before which heavy build) = MY call, NEVER handed back to Tron.
- **Gating chain / DONE:** expert builds FAILABLE gates -> oopTester VERIFIES on the MDA-process surface (gate CAN-fail) -> I verify the gate is REAL + drive to QA-GREEN + report the MEASURED result -> **TRON rules DONE, never me** (chain-complete != Done). R1: fix the DATA, never delete a gate to green.
- **Care-chain is a CYCLE:** I can't self-measure context; a peer / ARON / the trainer measures ME (that is why this rewind is trainer-driven).

## Team (oopTeam)
- 0.0 **oopExpert@WODA.prod** — radical-OOP / TypeScript + MDA framework OWNER (M3/M2/M1, generators, M1Graph, gates). Extracts UcpUnit-type bases, settles member placement, owns mof.md.
- 1.0 **oopBashExpert@WODA.prod** — MDA-generated OOSH target (Tron-ratified 2026-09-15); OOSH-as-Web4MDA-generation-target.
- 2.0 **me (oopPO)**.
- 3.0 **oopTester@WODA.prod** — tester of the MDA PROCESS; base=robbin-tester (point-not-fork); builds FAILABLE gates, reports RED/GREEN/CONFOUND + the number to me, NEVER fixes. Model/render-derived, source-independent gates.

## Web4MDA state (github.com/web4x/Web4MDA, main; verify HEAD on resume)
- Repo: `/var/dev/Workspaces/web4x/Web4MDA` (symlink workspaces/Web4MDA). Node22 (`PATH=/opt/node22/bin:$PATH npm ...`). MY session cannot execute vitest (permission-blocked) — rely on oopExpert/oopTester execution + my own render/disk checks.
- Last HEAD I saw: **a5e1b42** (class+interface hierarchy modelled as relationships; 145/145 green). Earlier milestones this session (all on origin, all gated failable):
  - OOSH-as-target PROVEN (real create.result under real oosh, round-trip, reproduce-consistency); generate:oosh idempotent.
  - M1Graph: the class graph is GENERATED FROM THE MODEL, never source-parsed (a defect I caught + fixed; producer-source-independence gate now guards it). Full graph 28 nodes; focused Web4MDA-interfaces graph.
  - Tree/Container inversion fixed: **Interface <- Tree <- Container<T>** (Tree holds parent 0..1; Container<T> adds children 0..n). Container extends Tree => components/UcpComponent transitively Trees.
  - **UcpUnit** extracted = model+Unit base; **UcpComponent extends UcpUnit** implements Displayable, Component. Thinglish convention 3 = cumulative implements up the chain.
  - **File extends UcpUnit** (a Unit, NOT a container); **Folder extends File implements Container<File>** (one children:File[] holds files + subfolders since Folder is a File — Tron tried Container<Folder> then reverted: "we do not want a folder only tree, i was wrong").
  - **Web4MDA.sample()** creates M0 sample sample/readme.md (a real File in a Folder) + renders a PlantUML OBJECT diagram (M1Sample walks the model containment).
  - **Class+interface hierarchy MODELLED**: extends=generalization, implements=realization RelationshipModels in ClassModel.relationships; superclass/interfaces are DERIVED read-only getters; output byte-identical (proven 3 ways: oopExpert + me + oopTester independent git-stat = only ClassModel/RelationshipModel gen files change).

## RESUME STATE — the held next work
- **THE STORE (endgame iii) is HELD — do NOT generate it yet** (Tron ordered this rewind BEFORE the heavy store build; trainer relayed HOLD). It is the ONE-STORE law: models become scenario units in one store (scenario/index, name->uuid), src/ GENERATED from them, reproduce = generator-output == committed src. Needs Tron's program-level ratification of direction+timing.
- Endgame sequence (oopExpert-measured): OOSH (done) -> (ii) M2TypescriptClass.parse reader [design-prep done] -> (iii) the JSON store -> B (self-describing: model the MOF machinery so the full 47-node graph generates from the model). target-by-uuid hierarchy references also wait on the store (need stable ids).
- **WHO does the store: I MEASURE + DELEGATE + RANK. Store-GEN delegates to oopExpert (framework owner); I rank + gate it. I do NOT implement it.** My ranked lean = store-bridge over breadth (advances the one-store law); confirm direction with Tron.

## Errors I owned this session (do not repeat)
- Generate-from-MODEL, never parse source (I mis-scoped M1Graph as a source-scan; Tron caught it). A model-view reveals model defects — that is its job.
- Measure Tron's WORD on scope ("complete" — I over-read it as whole-codebase, then as interface-graph; he meant interfaces-relevant-to-Web4MDA.class).
- **Backticks blank an otmux send** — I did it TWICE; NEVER use backticks/$()/unescaped specials in otmux send.
- Surface an expert's sound disagreement, never bury it (oopExpert's Container<File> argument -> Tron reversed himself). Voice-disagreement-to-me, execute-Tron's-ruling.
- Verify OWN files on disk (this very save exists because my session dir was empty — the trainer measured it).
