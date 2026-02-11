# Implementation Plan: Multi-Agent Blueprint

**Goal**: Close the gap between what `multi-agent-blueprint.md` describes and what actually exists.

**Gap score at start**: ~65% implemented, ~35% missing/partial.

---

## Phase 1: Fix Directory Structure & File Locations

_Get the house in order before building new things._

- [ ] **1.1** Create `session/learnings/` subdirectory
- [ ] **1.2** Move `session/woda-writer.learnings.md` to `session/learnings/woda-writer.learnings.md`
- [ ] **1.3** Move `session/woda-scribe.learnings.md` to `session/learnings/woda-scribe.learnings.md`
- [ ] **1.4** Update all references to old learnings paths (pre-compress hook, SKILL.md files, boot files)
- [ ] **1.5** Add `.gitkeep` to `session/learnings/` so git tracks the directory
- [ ] **1.6** Verify `session/agents/`, `session/boot/`, `session/tasks/` all exist with `.gitkeep`

---

## Phase 2: Create the Agent Template

_New roles need a starting point._

- [ ] **2.1** Create `.claude/agents/_template/SKILL.md` using the template from blueprint Section 6 Step 3
- [ ] **2.2** Include all 6 mandatory sections: role boundaries, monitoring protocol, context preservation, context recovery, file-based communication, never assume
- [ ] **2.3** Add placeholder variables (`{{ROLE_NAME}}`, `{{PEER_PANE}}`, etc.) so it's copy-paste ready

---

## Phase 3: Update Existing SKILL.md Files

_9 of 11 agents don't mention file-based communication. Fix that._

- [ ] **3.1** Add file-based communication section to `oosh-expert/SKILL.md`
- [ ] **3.2** Add file-based communication section to `oosh-tester/SKILL.md`
- [ ] **3.3** Add file-based communication section to `scrum-master/SKILL.md`
- [ ] **3.4** Add file-based communication section to `agent-teacher/SKILL.md` (also add role boundaries)
- [ ] **3.5** Add file-based communication section to `agent-trainer/SKILL.md`
- [ ] **3.6** Add file-based communication section to `developer/SKILL.md`
- [ ] **3.7** Add file-based communication section to `product-owner/SKILL.md`
- [ ] **3.8** Add file-based communication section to `task-agent/SKILL.md`
- [ ] **3.9** Add file-based communication section to `script-product-owner/SKILL.md` (also add role boundaries + context recovery)
- [ ] **3.10** Audit: verify all 11 SKILL.md files now have all 6 mandatory sections

---

## Phase 4: Generalize the Pre-Compact Hook

_Current hook is hardcoded for 6 specific roles. Blueprint says it should work for any role name._

- [ ] **4.1** Refactor `.claude/hooks/pre-compress.sh` to derive all file paths from role name (convention over configuration)
- [ ] **4.2** Remove hardcoded role `case` statement — use `session/agents/${ROLE}.context.md` pattern for all roles
- [ ] **4.3** Add peer detection from roles file (any other role in same session, not hardcoded)
- [ ] **4.4** Keep auto-commit, boot file generation, and resume scheduling intact
- [ ] **4.5** Test: register a new role name, trigger compact, verify boot file generated correctly

---

## Phase 5: Create Learnings Files for Missing Agents

_Only 2 of 11 agents have identity persistence. The other 9 reset to zero on compaction._

- [ ] **5.1** Create `session/learnings/oosh-expert.learnings.md` (seed with known patterns)
- [ ] **5.2** Create `session/learnings/oosh-tester.learnings.md`
- [ ] **5.3** Create `session/learnings/scrum-master.learnings.md`
- [ ] **5.4** Create `session/learnings/orchestrator.learnings.md`
- [ ] **5.5** Create `session/learnings/agent-teacher.learnings.md`
- [ ] **5.6** Create `session/learnings/agent-trainer.learnings.md`
- [ ] **5.7** Create `session/learnings/developer.learnings.md`
- [ ] **5.8** Create `session/learnings/product-owner.learnings.md`
- [ ] **5.9** Create `session/learnings/task-agent.learnings.md`

_Note: These start as stubs. Agents populate them as they learn. The file existing is what matters — it tells the hook and boot file where to point._

---

## Phase 6: Update CLAUDE.md

_Current CLAUDE.md is a framework reference. It needs multi-agent coordination rules._

- [ ] **6.1** Add "Universal Rules" table (named sessions, file-based communication, STOP-SAVE-COMPACT, never assume, boot file recovery)
- [ ] **6.2** Add "Context Preservation Protocol" section (the 3-step protocol at 20% context)
- [ ] **6.3** Add "Peer Monitoring Commands" section (capture, context check, alert)
- [ ] **6.4** Remove or fix references to non-existent docs (`docs/oosh-architecture.md`, `docs/wiki-index.md`) — either create them or remove the references
- [ ] **6.5** Keep existing OOSH framework content (it's still useful)

---

## Phase 7: OOSH Methods — otmux Session Save/Restore

_New methods for the existing `otmux` script. These provide tmux layout persistence._

- [ ] **7.1** Implement `otmux.session.save <session> <file>` — captures tmux layout to sourceable bash file
  - Loop windows with `tmux list-windows -F`
  - Loop panes with `tmux list-panes -F`
  - Save: session name, window count, layout strings, pane working directories
- [ ] **7.2** Implement `otmux.session.restore <file>` — recreates tmux layout from saved file
  - Source the bash file
  - Create session + panes with correct directories
  - Apply layout strings with `tmux select-layout`
  - Guard: error if session already exists
- [ ] **7.3** Write tests: `test.suite` cases for save/restore round-trip
- [ ] **7.4** Add Tab completion entries for new methods

---

## Phase 8: OOSH Methods — hiveMind Team Save/Restore

_Build on otmux.session.save to persist the full agent layer._

- [ ] **8.1** Implement `hiveMind.team.save <session> <file>` — saves topology.md + calls otmux.session.save for topology.tmux
  - Reads role registry (`/tmp/hivemind.roles`)
  - Reads session UUIDs (`/tmp/hivemind.sessions`)
  - Writes markdown table with pane, role, session UUID, status, context file path
- [ ] **8.2** Implement `hiveMind.team.restore <file>` — recreates team from topology files
  - Calls `otmux.session.restore` for pane layout
  - Rebuilds `/tmp/hivemind.roles` from topology.md
  - Rebuilds `/tmp/hivemind.sessions` from topology.md
  - Does NOT start Claude (that's team.startup's job)
- [ ] **8.3** Write tests: save/restore round-trip preserves all mappings
- [ ] **8.4** Add Tab completion entries

---

## Phase 9: OOSH Methods — hiveMind Team Shutdown/Startup

_The high-level lifecycle methods that users actually call._

- [ ] **9.1** Implement `hiveMind.team.shutdown <session> [--keep-session]`
  - Iterate agents in registry
  - Send "save state" message to each pane
  - Wait 5-10 seconds for agents to write context files
  - Call `hiveMind.team.save`
  - Call `hiveMind.auto.commit`
  - Send Ctrl-C + `/exit` to each pane
  - Optionally kill tmux session (unless `--keep-session`)
- [ ] **9.2** Implement `hiveMind.team.startup <file>`
  - Call `hiveMind.team.restore` (recreate panes, rebuild registries)
  - Start Claude in each pane with `claude --resume`
  - Wait for TUI init (2-3 seconds per pane)
  - Send boot file prompt to each pane
  - Verify agents alive via `hiveMind.agent.verify`
  - Print startup summary
- [ ] **9.3** Write tests: shutdown saves state, startup restores it
- [ ] **9.4** Add Tab completion entries
- [ ] **9.5** End-to-end test: full team setup -> work -> shutdown -> startup -> verify recovery

---

## Phase 10: Proposed New Scripts — peer & agent

_Optional. These are convenience wrappers. Can be deferred if otmux/hiveMind cover the needs._

- [ ] **10.1** Decide: build `peer` and `agent` as standalone OOSH scripts, or add methods to existing scripts?
- [ ] **10.2** If standalone: implement `peer` with methods: `capture`, `context`, `alert`, `compact`, `check`
- [ ] **10.3** If standalone: implement `agent` with methods: `register`, `boot`, `save`, `resolve`, `list`
- [ ] **10.4** If methods on existing scripts: add to `hiveMind` (agent lifecycle) and `otmux` (pane operations)
- [ ] **10.5** Write tests for whichever approach is chosen
- [ ] **10.6** Update blueprint Section 7 if the approach differs from what's documented

---

## Phase 11: Documentation Cleanup

_Fix references to things that don't exist. Remove lies from CLAUDE.md._

- [ ] **11.1** Either create `docs/oosh-architecture.md` (extract from dev.claude docs if they exist) or remove the reference from CLAUDE.md
- [ ] **11.2** Either create `docs/wiki-index.md` or remove the reference from CLAUDE.md
- [ ] **11.3** Update blueprint Appendix D source file references to match actual file paths
- [ ] **11.4** Add a README to `docs/` listing what each document covers

---

## Phase 12: Validation & Smoke Test

_Prove it works end-to-end._

- [ ] **12.1** From scratch: create a 2-pane pair using only the blueprint instructions (Section 6)
- [ ] **12.2** Verify both agents read SKILL.md correctly
- [ ] **12.3** Trigger `/compact` on one agent — verify hook fires, boot file generates, agent resumes
- [ ] **12.4** Run `hiveMind team.shutdown` — verify topology saved, agents stopped
- [ ] **12.5** Run `hiveMind team.startup` — verify panes recreated, agents resumed from boot files
- [ ] **12.6** Verify monitoring loops restart automatically post-startup
- [ ] **12.7** Document any issues found and create follow-up tasks

---

## Dependency Map

```
Phase 1 (directories) ──────────────────────────────────┐
Phase 2 (template)                                       │
Phase 3 (SKILL.md updates) ─── depends on Phase 2       │
Phase 4 (hook refactor) ──── depends on Phase 1         │
Phase 5 (learnings files) ── depends on Phase 1         │
Phase 6 (CLAUDE.md) ────────────────────────────────────│
Phase 7 (otmux save/restore) ──────────────────────┐    │
Phase 8 (hiveMind save/restore) ── depends on 7 ───┤    │
Phase 9 (shutdown/startup) ──────── depends on 8 ──┤    │
Phase 10 (peer/agent) ─── optional, independent     │    │
Phase 11 (docs cleanup) ── depends on Phase 6       │    │
Phase 12 (validation) ──── depends on ALL above ────┘────┘
```

**Parallelizable**: Phases 1-6 can all run in parallel (no dependencies between them). Phases 7-9 are sequential. Phase 10 is independent. Phase 11 depends on 6. Phase 12 is last.

---

## Effort Estimates

| Phase | Items | Complexity | Notes |
|-------|-------|-----------|-------|
| 1. Directories | 6 | Trivial | mv + update refs |
| 2. Template | 3 | Small | Copy from blueprint |
| 3. SKILL.md updates | 10 | Small | Add 1 section to 9 files |
| 4. Hook refactor | 5 | Medium | Careful — this is load-bearing |
| 5. Learnings stubs | 9 | Trivial | Create stub files |
| 6. CLAUDE.md | 5 | Small | Add sections, fix refs |
| 7. otmux save/restore | 4 | Medium | New OOSH methods + tests |
| 8. hiveMind save/restore | 4 | Medium | Builds on Phase 7 |
| 9. Shutdown/startup | 5 | Large | Complex orchestration + timing |
| 10. peer/agent | 6 | Medium | Optional, design decision needed |
| 11. Docs cleanup | 4 | Small | Create or delete |
| 12. Validation | 7 | Medium | End-to-end testing |
| **Total** | **68** | | |
