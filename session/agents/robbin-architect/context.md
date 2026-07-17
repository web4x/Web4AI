# robbin-architect Context — ESSENCE (anchor 2026-07-17, S30 diff-editor arc)

## ▶ RESUME STATE (read first)
**BOOT (rewound? do FIRST — world moved):** `git -C /var/dev/Workspaces/web4x/Web4RawBin log --oneline -25` + `ls scrum.pmo/sprints*` BEFORE trusting saved paths. DISK-WINS: last-committed anchor is truth, conversation summary is not.
I am **robbin-architect @ robbinTeam2:0.3**, WODA.prod. **Code repo = /var/dev/Workspaces/web4x/Web4RawBin**. Session repo = /var/dev/Workspaces/AI/Claude. My design-notes: scrum.pmo/design-notes/.
Team: 0.0 po, 0.1 expert, 0.3 ME, 0.4 req, 0.5 tester, 0.6 planner. **otmux OUTBOUND-BLOCKED from my rewound shell (/dev/tty) — PO relays for me; git works.**

**MY 2 ROLES:** (1) DESIGN-ONLY → hand chain spec to req (SOLE MINTER) → I DERIVE-CONFIRM by uuid-FILE → PO build-go → expert builds. I NEVER mint. (2) DERIVE-CONFIRM GATE + post-build marker-attach backstop (marker on name-matching decl, AST-attached; ownerIor UNIT-level j.ownerIor).
**Rules:** TRON #126 scenario-first-never-backfill · NEVER assume MEASURE (full uuids) · SIMPLE single bash commands (no compound/pipes/2>/dev/null — OOSH EPERM + denials) · report to PO before idle · don't create tasks (planner owns) · impl-edit + private-helper > new Method (avoid over-decomposition, cf R30.11 collapse).

## ★ S30 DIFF/MERGE EDITOR ARC — current head (Class RbDiffEditor 18165081)
Live prod v0.7.30+. IntelliJ 3-way merge/diff editor. Recent chain, all my derive-confirms:
- **R30.11 honorSupersededBy** — DONE/built (15856b8d1). Scorer impl-level supersededBy honor @ skill-classes.ts:204 `implRetiredBySupersede` [marker 7f15c149], anti-green-wash AC2/AC4, retired rows excluded from open. Backstop PASS.
- **R30.19 side-pane change-blocks** — DONE/built (v0.7.28). renderSideChangeBlocks [eb994dcd] AST-attach PASS.
- **R30.23 diff-completeness (one-sided visible, IMG_4522)** — DESIGN done, note `5d50099ef`. Decision: IMPL-EDIT to computeMergedCenter [marker a0b30550 STAYS], private helper computeOneSidedHunks, NO new units. **R30.23 already SHIPPED in code** (diff3MergeRegions+computeOneSidedHunks live @ rb-diff-editor.ts:202-205). crossRef v2 spec 84f013855.
- **R30.24 deep-linkable diffs** — DERIVE-CONFIRM PASS, note `d2f79572b`. Req 9a2c9c46 → UC cc47d004(openFromUrl)+8e88026a(shareLink) → RbDiffEditor REUSE → Methods f52b6941(openFromParams)/3fffd212(buildShareLink), Impls dc236c19/bcd06c77 (designAhead). URL schema `/edit/<path>?repo=KEY&left=&right=&3way=1`. ⚠️ FLAG-2 OWNER OVERRIDE: I kept BOTH methods on RbDiffEditor (PO steered openFromParams→RbEditorLayout); reason = state-owner (this.left/right own repo/path/refs), serialize/deserialize cohesion, showDiff is mount-only. PO decision pending; if PO holds, req re-points openFromParams→RbEditorLayout 94e7bf82.
- **R30.25 RIGHT-pick blanks LEFT (live Tron bug)** — DIAGNOSIS+fix spec `c10431d4d`, DERIVE-CONFIRM PASS. Req a604a1b5 → UC 1bcee6db(rightPickPreservesLeft) → RbDiffEditor REUSE → Method af9bcfef(populateLeftHistory)[Impl 751934c1] + impl-edit riders loadSide[c4da837c]+pickRef[f0b7ef57]. Root cause: asymmetric race — populateLeftHistory fire-and-forget promote, NO _rightUserPicked guard, reads live this.right.content @:625 mid-flight → LEFT blanks. Fix: symmetric _rightUserPicked guard + serialize promote (await+token) + snapshot working content. No new units, markers stay.

## ★ PENDING (my open loop)
All 3 (R30.23/24/25) handed off. **Awaiting expert builds → my post-build BACKSTOP** (markers stay AST-attached name-exact + R30.25 _rightUserPicked guard present + race-window AC static-check). R30.24 flag-2 owner decision pending from PO. **robbin-tester PAUSED** (trainer that drove its consolidation hit context hard-wall 2026-07-17) → R30.23/24/25 stall at tester-gate/Tron-verify even after build; my derive-confirm + backstop gates do NOT need tester.

## KEY CODE (rb-diff-editor.ts, Class RbDiffEditor 18165081)
loadSide[c4da837c]:149 · computeMergedCenter[a0b30550]:181 (R30.23 diff3MergeRegions+computeOneSidedHunks) · renderCenterChangeBlocks:301 · renderSideChangeBlocks[eb994dcd]:317 · pickRef[f0b7ef57]:514 · setSideRef:527 · openFromParams[dc236c19]:~570 · buildShareLink[bcd06c77]:~588 · populateLeftHistory[751934c1]:604 · swapSides[97b584c6]:502. State: this.left/this.right = {path,ref,repo,content}. Guards: _leftUserPicked, _deepLink (NO _rightUserPicked yet = R30.25 fix). RbEditorLayout 94e7bf82 showDiff[dc302e8e] = mount/entry. Scorer: skill-classes.ts walkReq:227 + implRetiredBySupersede:204[7f15c149] + summarize:333.
