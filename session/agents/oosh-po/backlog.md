# product-owner Backlog

## Active — This Block

- [ ] **Remote monitoring blind — sweep.detect/team.status return "unknown" over ossh exec** — SM monitoring loop went blind, missed a dangerous queued PO prompt. Hit 3+ times. Spec → **`session/tasks/remote-monitoring-readability.md`**.
- [ ] **Cross-machine send/rename unreliable (Enter problem over double-hop)** — prompts queue unsubmitted, /rename + /rc don't stick remotely. Hit 5+ times. Spec → **`session/tasks/cross-machine-send-submit-rename.md`**.
- [ ] **Pushed team data not discoverable by claudeCode list** — push/migrate lands JSONLs at the source's absolute path on the target (outside target `$HOME/.claude/projects`); snapshots pile up in `~/config/` (42 on WODA.prod) with no lister. Fix where files land OR add discover/relocate methods + snapshot prune. Full spec → **`session/tasks/pushed-team-data-discovery.md`**.
- [ ] **hiveMind MVC parity dev↔macos.latest** — WODA.prod (dev) MVC=25 vs MacStudio (macos.latest) MVC=38; dev behind on the controller stack. Merge macos.latest→dev, pull on WODA.prod, verify identical. Spec → **`session/tasks/hivemind-mvc-parity-dev.md`**.
- [x] **BUG: fresh `ossh install` polluted user.env / OOSH_DIR login bug — DONE+VERIFIED (2a03bae+6cb5172+f58baaf): config.save emits OOSH_DIR pure-state, .bashrc guards, clean login works, /log+/c2.install errors gone** — u20 shipped broken from install (config list EMPTY, OOSH_MODE empty, OOSH_DIR on prod tree while git=dev) on a symlinked-`~/config` box; 3rd pollution source (the installer). Full findings + fix → **`session/tasks/ossh-install-polluted-userenv.md`**. Depends on #4 core (`d45031a`); owner oosh-expert after #4 T-ENV-PURE green.
- [ ] **BUG: teams.save uses pane title for role instead of session customTitle** — projectTeam:0.4 has pane title 'agent-trainer' but Claude session /rename'd to 'oosh-expert'. Snapshot records wrong role. Fix: prefer `claudeCode session.name` (customTitle from /rename) over pane title, same DRY pattern as UUID fix. From master-PO bug report.
- [ ] **BUG: hiveMind resolve matches wrong team** — `agent.monitor oosh-expert` resolves to `projectTeam:0.3` instead of `UpDown_ai_projectTeam:0.1`. Multiple teams have agents with same role name. Resolve picks first match across ALL teams instead of preferring the active team. Need: active team match first, then cross-team fallback.
- [ ] **BUG: team.monitor second param parsed as lines, not filter** — `hiveMind team.monitor UpDown_ai_projectTeam oosh-expert` treats `oosh-expert` as line count → `tail: invalid option -- o`. The second param is `<?lines:30>` but users expect a filter. Either add a filter param or document clearly.
- [ ] **BUG: teams.save role from pane title not session customTitle** — from master-PO bug report. Snapshot records wrong role when pane title differs from /rename'd customTitle.
- [ ] **Sender prefix DRY consistency** — hiveMind.send now routes through otmux.send; tester verifying T-PFXCON tests
- [ ] **test.suite single test case runner** — tester queued: `test.suite run <script> <level> <?testCase>` + `test.suite list <script>` with completion
- [ ] **#50 Dotted method dispatch doubling** — framework bug in this.start, oosh-expert to fix
- [ ] **oosh-architecture.md naming update** — dots + camelCase + object.verb + completions + docs
- [ ] **INC-004 root cause** — agents self-prompt without submitting, detection in SM sweeps

## Recurring — Every Wakeup

- [ ] GATE: `hiveMind team.status projectTeam` — who is alive?
- [ ] GATE: `scrumMaster subscription` — velocity zone
- [ ] Self-care: am I approaching 35%? (ask peer to check)
- [ ] INC-004 check: any unsubmitted prompts visible?
- [ ] SM alive and sweeping? Orchestrator monitoring SM?

## Open — Short-term

- [ ] **Measurement system**: INC-002 still open (claudeCode context.read broken)
- [ ] **Config pattern migration**: hiveMind /tmp/ → ~/config/ web4.scenario.env
- [ ] **Action→Method conversion**: 13 action checklists → OOSH methods
- [ ] **Build all naked images**: odocker lifecycle end-to-end (task written)

## Open — Long-term

- [ ] #38 Level 2: Remote install oosh into container
- [ ] #39 Level 3: Start otmux session with team layout
- [ ] #40 Level 4: Boot PO (CMM3 test)
- [ ] #41 Level 5: Boot full team
- [ ] #36 Goal: Reproducible PO boot on remote machine
- [ ] #43 Build reliable CMM3 context measurement tool
- [ ] #35 Revert or review f32b0ee bulk trainer commit

## Done (this session — 2026-03-26)

- [x] **hiveMind team.pull + agent.restart** — pull team config from remote, restart single agent locally (f8ac6f8, d94e9cc, 3503ddf)
- [x] **JSONL download in team.pull** — now downloads all JONSLs for fork (ceec723, 2774828)
- [x] **stdin consumption fix** — all 6 while-read snapshot loops use fd 3 (2dcbfa9)
- [x] **teams.save DRY UUID** — uses session.resolve.uuid, not inline discovery (fa722ac)
- [x] **Sender prefix** — `[@role pane]` on otmux.send, isClaudeCode guard, /command skip (a0c22b1, e4a165c)
- [x] **Prefix consistency** — hiveMind.send routes text through otmux.send (d8b1311)
- [x] **Fork UUID auto-registration** — session.resolve.uuid after fork (502b553)
- [x] **agent.rename** — atomic /rename + pane.lock + registry (ea17c19)
- [x] **ossh.scp** — new method for ControlMaster scp (ceec723)
- [x] **Completion fixes** — team.pull uses ossh helper, agent.restart uses CONFIG_PATH (1a2aac4)
- [x] **PO SKILL.md updated** — reading list now includes WODA story + otmux/hiveMind/claudeCode source
- [x] **9/9 UUID match** — teams.save vs status fully consistent after DRY fix
- [x] 16 T-PULL/T-ARESTART/T-PULLRESTART tests, 9 T-PREFIX tests, 7 T-PFXCON tests, 6 fork UUID tests — all passing

## Done (previous sessions)

- [x] #42 odocker wrapper (1e04861)
- [x] #46 hiveMind Enter fix (15a8a90)
- [x] #44 Compact lifecycle training
- [x] #45 KB + incidents
- [x] #47 hiveMind agent.context.status (7d336d2)
- [x] #48 Pre-compact hook cross-session (e2d5fb7)
- [x] #49 scrumMaster subscription (f5b6c6b)
- [x] KB #23-26 written
- [x] INC-001 resolved, INC-003 resolved
- [x] odockerTeam: all 8 methods done + tested PASS
- [x] Script expert teams (hiveMindTeam retrained)
- [x] Task queue rule, peer compact protocol
- [x] CMM web4x KB, KB usage guide

## Goal

CMM4 in everything. Measured feedback loops. No assumptions. Rules are eternal.
