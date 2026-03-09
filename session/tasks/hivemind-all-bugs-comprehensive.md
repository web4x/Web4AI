# hiveMind: Complete Bug & Gap List
**Date**: 2026-03-06
**Agent**: hiveMind-tester
**Verdict**: hiveMind is not usable for its intended purpose. Every operation requires manual workarounds.

---

## Category 1: Can't Even Know What's Running

| Bug | Problem | Impact |
|-----|---------|--------|
| **BUG-H** | `hiveMind status` defaults to stale `projectTeam` (active.team never updated) | Running `hiveMind status` shows wrong team. Useless without explicit session arg. |
| **BUG-I** | Current team not in `teams.env` | Fallback chain can't find the active team. |
| **BUG-J** | No `hiveMind team.activate` command | Can't set active team without editing files manually. |
| **BUG-K** | `otmux tree` (basic) calls `claudeCode process.running` + `version` per pane | Fast overview is now slow. 30+ subprocess calls for a tree view. Should be pure tmux data. |
| **Bug 9** | `team.context.status` only shows registered panes | Unregistered agents are invisible. Incomplete picture of what's running. |

**Result**: To see what's running, I have to type `hiveMind team.status hiveMindTeam02_03_26` with the full session name every time. No default works.

---

## Category 2: Identity Chain Is Broken

| Bug | Problem | Impact |
|-----|---------|--------|
| **Bug 1** | `session.id` Method 0 trusts stale files, runs before Method 1 (ps ground truth) | Returns wrong UUID for most panes. |
| **Bug 2** | `claudeCode.join` doesn't write UUID back to sessions file | Sessions file stays stale after every resume. |
| **Bug 3** | `agent.bootstrap` / `team.setup.full` don't capture UUID after starting Claude | New agents have no UUID in sessions file. |
| **Bug 4** | Registry contains boot prompt text as role names | Garbage entries like "You are oosh-expert on projectTeam:0.1." pollute data. |
| **Bug 5** | Stale registry entries for dead panes persist forever | Registry grows with garbage, never cleaned. |
| **Bug 6** | Multiple roles share same UUID in sessions file | `developer` and `task-agent` → same UUID. Data corruption risk. |
| **Bug 7** | `tree.detailed` shows wrong UUIDs (depends on broken session.id) | Cascading failure from Bug 1. |
| **BUG-G** | Registry mismatch at hiveMindTeam02_03_26:0.1 (said expert, was tester) | Can't trust registry. Can't fix it either (see Category 3). |

**Result**: `process.lookup` only found UUIDs for 3 out of 10 Claude instances. 70% of agents have no recoverable UUID.

---

## Category 3: Can't Fix What's Broken

| Bug | Problem | Impact |
|-----|---------|--------|
| **BUG-D** | `registry.refresh` uses `-a` (all sessions) instead of `-s` | Sends `/status` to ALL Claude panes. Disrupts every running agent. Unusable. |
| **BUG-E** | `get.role.prompt` hardcoded case with ~15 roles, but role.list finds 80+ | `hiveMind teach` fails for most roles. Can't assign roles to agents. |
| **BUG-F** | No public `registry.set` / `registry.remove` | Can't correct registry entries. Only option is manual file editing. |
| **Bug 8** | `team.context.status` uses raw tmux (6 violations) | Violates OOSH-only rule. Fragile, not portable. |

**Result**: Found a registry mismatch. Tried `hiveMind teach` → "Unknown role." Tried `registry.refresh` → disrupts all sessions. No `registry.set` command exists. **Can't fix anything with hiveMind commands.**

---

## Category 4: Missing Lifecycle Methods (No Save/Restore)

| Gap | What's Missing | Impact |
|-----|----------------|--------|
| **GAP-1** | No `hiveMind teams.save` | Can't snapshot session layouts + roles + UUIDs before shutdown. |
| **GAP-2** | No `hiveMind teams.restore` | Can't recreate tmux sessions with correct pane layout after restart. |
| **GAP-3** | No `hiveMind agent.resume <role>` | Can't resume a Claude instance by role name with its UUID. |
| **GAP-4** | `process.lookup` doesn't extract UUID from `ps --resume` args | 7 out of 10 Claude instances show no UUID. Data is in `ps` but not extracted. |
| **GAP-5** | No `hiveMind team.activate <session>` | Can't switch between teams. Manual file editing required. |
| **GAP-6** | `team.setup` doesn't register in `teams.env` or set as active | Creating a team doesn't make it findable or default. |

**Result**: Computer restart = total loss. No way to save state, no way to restore it. Every session must be manually recreated.

---

## What Works vs What's Manual

| Operation | hiveMind Command | Actually Works? |
|-----------|-----------------|-----------------|
| See what's running | `hiveMind status` | NO — wrong team default (BUG-H) |
| See team layout | `hiveMind team.status <session>` | YES — but requires explicit session name |
| See all processes | `hiveMind process.list` | PARTIAL — 70% show no UUID |
| Lookup a PID | `hiveMind process.lookup <pid>` | PARTIAL — only shows UUID for 3/10 |
| Fix a wrong registry entry | `hiveMind registry.set` | NO — doesn't exist (BUG-F) |
| Assign a role to a pane | `hiveMind teach <pane> <role>` | NO — fails for most roles (BUG-E) |
| Reconcile registry | `hiveMind registry.refresh` | NO — disrupts all sessions (BUG-D) |
| Save state before restart | `hiveMind teams.save` | NO — doesn't exist (GAP-1) |
| Restore after restart | `hiveMind teams.restore` | NO — doesn't exist (GAP-2) |
| Set active team | `hiveMind team.activate` | NO — doesn't exist (GAP-5) |
| Resume agent by name | `hiveMind agent.resume` | NO — doesn't exist (GAP-3) |

**Count: 3 partially working, 8 broken or missing out of 11 core operations.**

---

## Priority for Expert

### P0 — Needed NOW (before restart)
1. **GAP-1**: `hiveMind teams.save` — dump session layouts + roles + UUIDs to a file
2. **GAP-4**: Extract UUID from `ps --resume` args in process.lookup/list (the data IS there)

### P1 — Needed for daily use
3. **BUG-H/I/J/GAP-5/6**: Active team management (team.activate, auto-register on setup)
4. **BUG-E**: Dynamic role.prompt from SKILL.md (unblocks teach)
5. **BUG-F**: Public registry.set/remove (unblocks manual fixes)
6. **BUG-D**: Fix registry.refresh `-a` → `-s` (unblocks automated reconciliation)

### P2 — Needed for restart recovery
7. **GAP-2**: `hiveMind teams.restore` — recreate tmux sessions from saved state
8. **GAP-3**: `hiveMind agent.resume <role>` — resume Claude by role name

### P3 — Cleanup
9. **Bug 1-7**: Identity chain fixes (session.id, join, bootstrap, registry cleanup)
10. **BUG-K**: Remove `claudeCode` calls from `otmux.tree` (restore fast overview)
11. **Bug 8-9**: team.context.status raw tmux + invisible agents
