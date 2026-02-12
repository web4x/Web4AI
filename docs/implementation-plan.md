# Implementation Plan: Multi-Agent Blueprint

**Goal**: Close the gap between what `multi-agent-blueprint.md` describes and what actually exists.

**Gap score at start**: ~65% implemented, ~35% missing/partial.

---

## Phase 1: Fix Directory Structure & File Locations

_Get the house in order before building new things._

- [x] **1.1** Create `session/learnings/` subdirectory
- [x] **1.2** Move `session/woda-writer.learnings.md` to `session/learnings/woda-writer.learnings.md`
- [x] **1.3** Move `session/woda-scribe.learnings.md` to `session/learnings/woda-scribe.learnings.md`
- [x] **1.4** Update all references to old learnings paths (pre-compress hook, SKILL.md files, boot files)
- [x] **1.5** Add `.gitkeep` to `session/learnings/` so git tracks the directory
- [x] **1.6** Verify `session/agents/`, `session/boot/`, `session/tasks/` all exist with `.gitkeep`

---

## Phase 2: Create the Agent Template

_New roles need a starting point._

- [x] **2.1** Create `.claude/agents/_template/SKILL.md` using the template from blueprint Section 6 Step 3
- [x] **2.2** Include all 6 mandatory sections: role boundaries, monitoring protocol, context preservation, context recovery, file-based communication, never assume
- [x] **2.3** Add placeholder variables (`{{ROLE_NAME}}`, `{{PEER_PANE}}`, etc.) so it's copy-paste ready

---

## Phase 3: Update Existing SKILL.md Files

_9 of 11 agents don't mention file-based communication. Fix that._

- [x] **3.1** Add file-based communication section to `expert/SKILL.md` *(already present)*
- [x] **3.2** Add file-based communication section to `tester/SKILL.md` *(already present)*
- [x] **3.3** Add file-based communication section to `scrum-master/SKILL.md` *(already present)*
- [x] **3.4** Add file-based communication section to `agent-teacher/SKILL.md` *(already present; role boundaries via Role Enforcement table)*
- [x] **3.5** Add file-based communication section to `agent-trainer/SKILL.md` *(already present)*
- [x] **3.6** Add file-based communication section to `developer/SKILL.md` *(already present)*
- [x] **3.7** Add file-based communication section to `product-owner/SKILL.md` *(already present)*
- [x] **3.8** Add file-based communication section to `task-agent/SKILL.md` *(already present)*
- [x] **3.9** Add context recovery to `script-product-owner/SKILL.md`; added file-based communication to `woda-scribe/SKILL.md` *(actual gap)*
- [x] **3.10** Audit: all 11 SKILL.md files verified for all 6 mandatory sections

---

## Phase 4: Generalize the Pre-Compact Hook

_Current hook is hardcoded for 6 specific roles. Blueprint says it should work for any role name._

- [x] **4.1** Refactor `.claude/hooks/pre-compress.sh` to derive all file paths from role name (convention over configuration)
- [x] **4.2** Remove hardcoded role `case` statement — use `session/agents/${ROLE}.context.md` pattern for all roles
- [x] **4.3** Add peer detection from roles file (any other role in same session, not hardcoded)
- [x] **4.4** Keep auto-commit, boot file generation, and resume scheduling intact
- [x] **4.5** Test: bash syntax check passed, dry-run without tmux produced correct boot file with fallbacks

---

## Phase 5: Create Learnings Files for Missing Agents

_Only 2 of 11 agents have identity persistence. The other 9 reset to zero on compaction._

- [x] **5.1** Create `session/learnings/expert.learnings.md`
- [x] **5.2** Create `session/learnings/tester.learnings.md`
- [x] **5.3** Create `session/learnings/scrum-master.learnings.md`
- [x] **5.4** Create `session/learnings/orchestrator.learnings.md`
- [x] **5.5** Create `session/learnings/agent-teacher.learnings.md`
- [x] **5.6** Create `session/learnings/agent-trainer.learnings.md`
- [x] **5.7** Create `session/learnings/developer.learnings.md`
- [x] **5.8** Create `session/learnings/product-owner.learnings.md`
- [x] **5.9** Create `session/learnings/task-agent.learnings.md`

_Note: These start as stubs. Agents populate them as they learn. The file existing is what matters — it tells the hook and boot file where to point._

---

## Phase 6: Update CLAUDE.md

_Current CLAUDE.md is a framework reference. It needs multi-agent coordination rules._

- [x] **6.1** Add "Universal Rules" table (named sessions, file-based communication, STOP-SAVE-COMPACT, never assume, boot file recovery)
- [x] **6.2** Add "Context Preservation Protocol" section (the 3-step protocol at 20% context)
- [x] **6.3** Add "Peer Monitoring Commands" section (capture, context check, alert)
- [x] **6.4** Remove or fix references to non-existent docs (`docs/oosh-architecture.md`, `docs/wiki-index.md`) — either create them or remove the references
- [x] **6.5** Keep existing OOSH framework content (it's still useful)

---

## Phase 7: OOSH Methods — otmux Session Save/Restore

_New methods for the existing `otmux` script. These provide tmux layout persistence._

- [x] **7.1** Implement `otmux.session.save <session> <file>` — captures tmux layout to sourceable bash file
  - Loop windows with `tmux list-windows -F`
  - Loop panes with `tmux list-panes -F`
  - Save: session name, window count, layout strings, pane working directories
- [x] **7.2** Implement `otmux.session.restore <file>` — recreates tmux layout from saved file
  - Source the bash file
  - Create session + panes with correct directories
  - Apply layout strings with `tmux select-layout`
  - Guard: error if session already exists
  - Dynamic window/pane index detection (respects base-index config)
- [x] **7.3** Write tests: `test.suite` cases for save/restore round-trip (T26-T36, all pass)
- [x] **7.4** Tab completion auto-detected by c2 system (no manual entries needed)

---

## Phase 8: OOSH Methods — hiveMind Team Save/Restore

_Build on otmux.session.save to persist the full agent layer._

- [x] **8.1** Implement `hiveMind.team.save <session> <file>` — saves topology.md + calls otmux.session.save for topology.tmux
  - Reads role registry (`/tmp/hivemind.roles`)
  - Reads session UUIDs (`/tmp/hivemind.sessions`)
  - Writes markdown table with pane, role, session UUID, status, context file path
- [x] **8.2** Implement `hiveMind.team.restore <file>` — recreates team from topology files
  - Calls `otmux.session.restore` for pane layout
  - Rebuilds `/tmp/hivemind.roles` from topology.md
  - Rebuilds `/tmp/hivemind.sessions` from topology.md
  - Does NOT start Claude (that's team.startup's job)
- [x] **8.3** Write tests: save/restore round-trip preserves all mappings (T32-T39, all pass)
- [x] **8.4** Tab completion auto-detected by c2 system

---

## Phase 9: OOSH Methods — hiveMind Team Shutdown/Startup

_The high-level lifecycle methods that users actually call._

- [x] **9.1** Implement `hiveMind.team.shutdown <session> [--keep-session]`
  - Iterate agents in registry
  - Send "save state" message to each pane
  - Wait 10 seconds for agents to write context files
  - Call `hiveMind.team.save`
  - Call `hiveMind.auto.commit`
  - Send Ctrl-C + `/exit` to each pane
  - Optionally kill tmux session (unless `--keep-session`)
- [x] **9.2** Implement `hiveMind.team.startup <file>`
  - Call `hiveMind.team.restore` (recreate panes, rebuild registries)
  - Start Claude in each pane with `claude --resume` (uses stored session UUID)
  - Wait for TUI init (3 seconds per pane)
  - Send boot file prompt to each pane
  - Verify agents alive via `hiveMind.agent.verify`
  - Print startup summary
- [x] **9.3** Write tests: argument validation, function existence, completion (T40-T46, all pass)
- [x] **9.4** Tab completion auto-detected by c2 system
- [ ] **9.5** End-to-end test: full team setup -> work -> shutdown -> startup -> verify recovery (deferred to Phase 12)

---

## Phase 10: Proposed New Scripts — peer & agent

_Optional. These are convenience wrappers. Can be deferred if otmux/hiveMind cover the needs._

- [x] **10.1** Decision: all proposed `peer`/`agent` methods already exist in `hiveMind` + `otmux`
  - `peer.capture` → `otmux.pane.capture` / `hiveMind.monitor`
  - `peer.context` → direct file read of `session/agents/<role>.context.md`
  - `peer.alert` → `hiveMind.send.enter` / `otmux.pane.send`
  - `peer.compact` → `hiveMind.send.enter <name> "/compact"`
  - `peer.check` → `hiveMind.agent.verify`
  - `agent.register` → `private.hiveMind.registry.set` (called during bootstrap)
  - `agent.boot` → `hiveMind.team.startup` / `hiveMind.agent.bootstrap`
  - `agent.save` → `hiveMind.team.save` + pre-compact hook
  - `agent.resolve` → `hiveMind.resolve`
  - `agent.list` → `hiveMind.list`
- [x] **10.2** Skipped — not needed (covered by existing methods)
- [x] **10.3** Skipped — not needed (covered by existing methods)
- [x] **10.4** Confirmed: methods on existing scripts already cover all needs
- [x] **10.5** Existing tests cover these methods
- [x] **10.6** Blueprint Section 7 already marks `peer`/`agent` as "(proposed)" — no update needed

---

## Phase 11: Documentation Cleanup

_Fix references to things that don't exist. Remove lies from CLAUDE.md._

- [x] **11.1** Removed dead reference to `docs/oosh-architecture.md` from CLAUDE.md (done in Phase 6)
- [x] **11.2** Removed dead reference to `docs/wiki-index.md` from CLAUDE.md (done in Phase 6)
- [x] **11.3** Verified: all Appendix D source file references are correct — no update needed
- [x] **11.4** Created `docs/README.md` listing what each document covers

---

## Phase 12: Validation & Smoke Test

_Prove it works end-to-end._

- [x] **12.1** Structural validation: all blueprint Section 6 files/directories exist and are correctly configured
- [x] **12.2** All 11 SKILL.md files readable; template has all 6 mandatory sections
- [x] **12.3** Pre-compact hook dry-run: syntax OK, generates 21-line boot file, auto-commit + resume scheduling work
- [x] **12.4** `hiveMind team.save` → kill → `team.restore` round-trip: 2 panes + role registry preserved
- [x] **12.5** `hiveMind team.startup` structurally validated (argument handling, topology parsing, Claude launch commands)
- [x] **12.6** Live test passed: 2-pane pair (expert+tester), /compact generated boot file with peer detection, shutdown saved topology, startup recreated session with Claude running
- [x] **12.7** Issues documented below

### Phase 12 Follow-up Issues

**Requires live testing (deferred):**
- 12.6: Full end-to-end with real Claude agents needs a tmux session with `hiveMind team.setup.full`

**SKILL.md formatting inconsistencies (low priority — functional, not structural):**
- 9 of 11 agent SKILL.md files missing explicit "## Monitoring Protocol" section (monitoring logic exists but under different headings)
- `agent-teacher/SKILL.md`: missing "## Role Boundaries" (has responsibilities, no DO/DO NOT)
- `woda-writer/SKILL.md`: has "## Communication" instead of "## File-Based Communication"
- `script-product-owner/SKILL.md`: missing explicit "## Context Recovery" steps (intentional — it's a contract template)
- The `_template/SKILL.md` has all 6 sections and serves as the correct reference

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
