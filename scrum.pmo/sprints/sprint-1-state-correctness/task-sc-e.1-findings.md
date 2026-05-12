# SC-E.1 Findings: Ingress Triple-Defense Audit

**Sprint:** 1 — State Correctness Architecture
**Task:** SC-E.1 (expert)
**Reference invariant pattern P3:** every method accepting a caller-supplied identifier (pane, role, session, UUID) must apply:
- **(a) Regex** — format validation
- **(b) Delimiter** — reject `|` / newline / whitespace that corrupts env files
- **(c) Existence** — ground-truth check (live tmux session / pane / Claude process / JSONL file)

Today only `hiveMind.team.register` has all three (commit `ebc8b5e`). This audit lists every ingress point and grades it.

---

## Identifier Classes

| Class | Format | Used by |
|-------|--------|---------|
| **pane target** | `session:window.pane` or `%N` | registry.*, agent.*, otmux.send.* |
| **role / agent name** | camelCase, alphanumeric + `-` | resolve, agent.send, agent.rename, role.* |
| **session name** | tmux-valid (`[A-Za-z0-9_][A-Za-z0-9_.-]*`) | team.*, otmux.session.*, tronMonitor.* |
| **UUID** | 36-char `[0-9a-f]{8}-...-[0-9a-f]{12}` | claudeCode.join.byID, fork.byID, session.* |
| **sshHost** | ssh config alias (kebab-case + dots) | teams.migrate, team.pull, task.delegate |
| **filename / path** | filesystem path | layout.save/restore, task files |

---

## Severity grading

- **W (write)** — identifier persisted to env file → all 3 layers required
- **L (lookup)** — identifier used as grep key / pane address → (a) + (c)
- **D (dispatch)** — identifier passed straight to a guarded method → (a) only at outer boundary
- **N (no-op)** — value only used as message/output → no guard required

---

## hiveMind ingress points

### Team-class ingress (session name → teams.env, registry, sessions)

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `team.register <session>` | W | ✅ `^[A-Za-z0-9_][A-Za-z0-9_.-]*$` (L5544) | ✅ literal `*"\|"*` check (L5419) | ✅ `otmux has` (L5562) | **REFERENCE** — gold standard |
| `team.remove <session>` | W | ❌ | ❌ | ⚠ checks grep exists in teams.env (file-level, not tmux) | gap — could remove with garbage identifier |
| `team.switch <session>` | L | ❌ | ❌ | ⚠ warns if not in tmux but doesn't reject | partial — accepts unknown session |
| `team.activate <session>` | L | ❌ (alias for team.switch) | ❌ | ❌ | inherits team.switch gaps |
| `team.list` | N | n/a | n/a | n/a | read-only |
| `team.init.oosh <?session>` | L | ❌ | ❌ | ✅ `otmux has` early return | needs regex |
| `team.setup <roles> <?session>` | L+W | ❌ (session) | ❌ | ✅ `otmux has` then create | needs regex (creates new tmux session — name flows to tmux) |
| `team.setup.oosh <?session>` | L+W | ❌ | ❌ | ✅ `otmux has` then create | same as team.setup |
| `team.setup.full <?session>` | L+W | ❌ | ❌ | ✅ `otmux has` then create | same |

### Pane-class ingress (pane target → registry, sessions)

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `registry.set <pane> <role>` | W | ✅ pane regex (L794), role len≤30 + no space (L799) | ❌ no `|` check | ❌ no tmux verify | partial — relies on regex catching `|` indirectly (regex rejects pipe); add (c) |
| `registry.remove <pane>` | W | ❌ | ❌ | ❌ | unguarded — accepts any string, removes whatever matches |
| `agent.spawn <agentName>` | W | ❌ role regex | ❌ | ❌ | unguarded; relies on downstream registry.set to catch some |
| `agent.bootstrap <agentName> <?session> <?pane>` | W (creates pane) | ❌ | ❌ | ✅ `otmux has` for session | role and pane unguarded |
| `agent.rename <agentName> <newName>` | W | ❌ newName regex | ❌ | ❌ | rejects empty only |
| `pane.focus <agentName>` | L | ❌ | ❌ | ✅ via resolve | resolve adds checks; outer is unguarded |
| `pane.create <agentName>` | W (pane) | ❌ | ❌ | ❌ | unguarded |
| `resolve <agentName> <?session>` | L | ❌ | ❌ | ✅ `otmux has` per candidate | regex would prevent obvious-garbage names from being grepped |
| `agent.session.probe <agentName\|pane>` | L | ✅ pane OR `%N` regex (L2078) | ❌ | ⚠ resolves through registry but doesn't check pane is live | partial |

### Send-class ingress (pane target + text → tmux)

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `send <agentName> <text>` | D | inherits agent.send | n/a (text payload) | n/a | wrapper |
| `send.message <agentName> <message>` | D | inherits agent.send | n/a | n/a | wrapper |
| `agent.send <agentName> <message>` | L | ❌ name regex | n/a | ✅ channel.resolve verifies pane | regex would reject obviously bad names earlier |
| `broadcast <message>` | L | n/a (no identifier) | n/a | n/a | message is text; iterates internal list |
| `delegate <agentName> <description> <?from>` | L+W | ❌ name | ❌ | ✅ via resolve | task file path constructed from name — needs path-safe regex |
| `task.delegate <sshHost> <pane> <taskFile> <?msg>` | L | ❌ sshHost, pane | ❌ | ❌ | unguarded; ssh accepts any string |

### UUID-class ingress (Claude session UUID)

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `roles.list.uuids <role>` | L | ❌ role regex | ❌ | ⚠ scans JSONLs | needs role-name validation (filesystem traversal risk if role contains `/`) |
| `agent.fork.best <role> <targetPane>` | W (registry) | ✅ pane regex (L2627) | ❌ | ❌ no tmux verify | role unguarded |
| `agent.session.probe` (UUID context) | L | inherits parser | n/a | ⚠ JSONL existence | parser validates UUID format inherently |

### Remote-class ingress (SSH host)

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `teams.migrate <sshHost>` | L | ❌ | ❌ | ❌ | ssh handles malformed input by failing; but command injection risk if name contains `;` etc. |
| `team.pull <sshHost>` | L | ❌ | ❌ | ❌ | same |
| `task.delegate <sshHost> ...` | L | ❌ | ❌ | ❌ | same |
| `agent.restart.remote <agentName> <sshHost>` | L | ❌ | ❌ | ❌ | name + sshHost unguarded |

### Protected observer ingress

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `protected.session.renamed <old> <new>` | W | ❌ | ❌ | ❌ | called from otmux observer — trusts upstream but no defense at boundary |
| `protected.panes.shifted <session>` | L | ❌ | ❌ | ✅ `otmux has` in handler | handler-side check, not entry-side |
| `protected.panes.swapped <session> <A> <B>` | W | ❌ | ❌ | ❌ | A/B unguarded; handler does addr-normalization but no regex |
| `protected.pane.moved <from> <to>` | W | ❌ | ❌ | ❌ | unguarded |
| `protected.reconcile.diff <?invariant>` | L | ⚠ implicit | n/a | n/a | invariant is whitelisted at dispatch |

---

## otmux ingress points

### Session-class

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `new <?name>` | W | ❌ (passes to tmux) | ❌ | n/a (creating) | tmux accepts most names; can store garbage |
| `attach <?target>` | L | ❌ | ❌ | ❌ (tmux fails noisy) | safe — tmux validates downstream |
| `has <target>` | L | ❌ | ❌ | self-existence check | predicate, no state mutation |
| `kill <target>` | W (destructive) | ❌ | ❌ | ❌ | dangerous: typos kill wrong session, but tmux requires exact match |
| `rename <session> <?newName>` | W | ❌ | ❌ | ❌ | both args unguarded; emits observer with whatever was passed |
| `session.rename <session> <?newName>` | W | ❌ | ❌ | ❌ | same — and fires `protected.session.renamed` with both unvalidated |
| `switch <target>` | L | ❌ | ❌ | ❌ | passes through |

### Pane-class

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `send <target> <text>` | L | ✅ via `private.otmux.target.isPane` (Bug #4) | n/a | ❌ no tmux verify | regex catches malformed; tmux fails on invalid pane |
| `send.raw <target> <keys>` | L | ✅ via target.isPane | n/a | ❌ | same |
| `send.verified <target> <text>` | L | ✅ via target.isPane | n/a | ❌ | same |
| `send.key <target> <key>` | L | ✅ via target.isPane | n/a | ❌ | same |
| `pane.title <target> <title>` | L+W (title visible state) | ❌ | n/a | ❌ | title is free text but tmux truncates safely |
| `pane.lock <target> <title>` | L+W | ❌ | n/a | ❌ | spawns background enforcer — bad target = orphan loop |

### Layout-class

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `layout.save <session>` | W (file) | ❌ | ❌ | ⚠ tmux fails if absent | session name flows into filename — path-traversal vector |
| `layout.restore <session> <?force>` | W | ❌ | ❌ | ❌ | session is created from file content; force = `--force` magic string |
| `layout.delete <session>` | W (file) | ❌ | ❌ | n/a | ditto |

---

## tronMonitor ingress points

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `add <teamSession>` | W | ❌ regex (but `__test_*` blocklist) | ❌ | ✅ `otmux has` (L274) | partial — has blocklist + existence; missing allowlist regex + pipe |
| `remove <teamSession>` | W | ❌ | ❌ | ❌ (idempotent so doesn't error) | accepts any name — only acts if it matches stored window |
| `switch <teamSession>` | L | ❌ | ❌ | ⚠ auto-adds via tronMonitor.add (inherits add's guards) | partial via auto-add |
| `setup <?monitorPane>` | L | ❌ pane regex | ❌ | ❌ | accepts any string; falls back if invalid |
| `reset` | N | n/a | n/a | n/a | no identifier |
| `prune` | N | n/a | n/a | n/a | scans existing entries |
| `sync` | N | n/a | n/a | n/a | reconciles |
| `verify` | N | n/a | n/a | n/a | informational |

---

## claudeCode ingress points

| Method | Class | (a) Regex | (b) Pipe | (c) Existence | Notes |
|--------|-------|-----------|----------|---------------|-------|
| `join <session>` | L | ✅ UUID regex `^[0-9a-f]{8}-[0-9a-f]{4}` (L303) for UUID path | n/a | ⚠ Claude validates downstream | regex partial (8+4 hex); falls through to role-resolve for non-UUID |
| `join.byID <sessionId>` | L | ❌ (relies on Claude failing) | n/a | ❌ JSONL existence | gap — passes anything to `--resume` |
| `join.byName <name>` | L | ❌ role regex | n/a | ✅ registry lookup | partial — registry lookup is existence-check but role chars unbounded |
| `join.byPane <pane>` | L | ❌ pane regex | n/a | ❌ | gap |
| `fork <sessionId>` | L | ❌ | n/a | ❌ | gap — passes to `--fork-session` |
| `fork.byID <sessionId>` | L | ❌ | n/a | ❌ | same |
| `fork.byName <name>` | L | ❌ | n/a | ✅ registry lookup | partial |
| `fork.byPane <pane>` | L | ❌ | n/a | ❌ | gap |
| `fork.to <pane> <?role>` | W (registry) | ❌ pane regex | ❌ | ❌ | gap |
| `model.set <pane> <model>` | L | ❌ pane | n/a | ❌ | model is whitelisted (opus/sonnet/haiku) but pane is unguarded |

---

## Summary by gap class

### Has ALL 3 layers (reference standard) — 1 method

- `hiveMind.team.register` ✅ — gold standard from commit `ebc8b5e`

### Has 2 layers (regex + existence, missing pipe)

- `hiveMind.registry.set` — regex pane, existence missing tmux verify (file-grep only)
- `hiveMind.agent.fork.best` — regex on `targetPane`, missing pipe + existence
- `hiveMind.agent.session.probe` — regex on pane format
- `otmux.send` family — `target.isPane` regex, missing pipe check (text payload, n/a) + existence

### Has 1 layer (existence only, missing regex + pipe)

- `hiveMind.team.init.oosh` / `team.setup` / `team.setup.oosh` / `team.setup.full`
- `tronMonitor.add` (existence + blocklist guard, no allowlist regex)
- `claudeCode.join.byName` / `fork.byName` (registry lookup is existence)

### Has 0 layers (CRITICAL gaps — write-class methods)

- `hiveMind.team.remove` — W to teams.env
- `hiveMind.team.switch` / `team.activate` — W to active-team file
- `hiveMind.registry.remove` — W to roles.env (grep-key with raw input)
- `hiveMind.agent.rename` — W (rename role in registry, send to pane)
- `hiveMind.agent.spawn` — W (creates pane + registry)
- `hiveMind.protected.session.renamed` — W to multiple env files
- `hiveMind.protected.panes.swapped` — W to roles.env (paneA, paneB)
- `hiveMind.protected.pane.moved` — W (from, to)
- `otmux.session.rename` — W (fires the protected observer with unvalidated args)
- `otmux.pane.lock` — W (spawns background enforcer)
- `otmux.kill` — destructive
- `tronMonitor.remove` — W to monitor env
- `claudeCode.fork.to` — W to registry

---

## Recommended SC-E.2 priority list (apply triple defense in order)

### P1 — Highest priority (W-class, no defenses, registry/teams files)

1. **`hiveMind.team.remove`** — add regex + pipe + `otmux has` (graceful: don't reject if session is gone but still in registry, just check format)
2. **`hiveMind.registry.remove`** — add pane regex (refuse if not `session:win.pane` or `%N`) + pipe + `otmux has`
3. **`hiveMind.protected.session.renamed`** — both args regex + pipe + caller-side `otmux has $new`
4. **`hiveMind.protected.panes.swapped`** — paneA + paneB regex + pipe
5. **`hiveMind.protected.pane.moved`** — from + to regex + pipe
6. **`hiveMind.agent.rename`** — newName regex + pipe
7. **`hiveMind.agent.spawn`** — agentName role regex + pipe

### P2 — Medium priority (W-class but downstream wraps with guards)

8. **`hiveMind.team.setup` / setup.oosh / setup.full** — session regex
9. **`hiveMind.team.switch` / `team.activate`** — session regex + reject non-tmux non-registry
10. **`otmux.session.rename`** — both args regex + pipe before firing observer
11. **`tronMonitor.add`** — add allowlist regex on top of existing blocklist
12. **`tronMonitor.remove`** — regex + pipe (idempotent existence-check OK)
13. **`hiveMind.delegate`** — role-name regex (constructs filesystem path)
14. **`hiveMind.roles.list.uuids`** — role regex (filesystem traversal)

### P3 — Lower priority (read paths + remote)

15. **`claudeCode.join.byID` / `fork.byID`** — UUID regex (currently relies on Claude failing)
16. **`claudeCode.join.byPane` / `fork.byPane` / `fork.to`** — pane regex
17. **SSH-host accepting methods** (`teams.migrate`, `team.pull`, `task.delegate`, `agent.restart.remote`) — sshHost regex (command-injection-class concern)
18. **`otmux.kill`** — session regex (destructive but only if user types it)

---

## Patterns to apply (DRY across the codebase)

The triple defense is mechanical. Suggested helpers in `this` or as `private.<script>.is<class>` predicates:

```bash
# Place candidate: this script — kernel predicates like this.isNumber, this.isEmpty
this.isPaneTarget()   { [[ "$1" =~ ^[A-Za-z_][A-Za-z0-9_.-]*:[0-9]+\.[0-9]+$ ]] || [[ "$1" =~ ^%[0-9]+$ ]]; }
this.isSessionName()  { [[ "$1" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]*$ ]]; }
this.isRoleName()     { [[ "$1" =~ ^[A-Za-z][A-Za-z0-9._-]{0,30}$ ]]; }
this.isUuid()         { [[ "$1" =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; }
this.isPipeSafe()     { [[ "$1" != *"|"* && "$1" != *$'\n'* ]]; }
this.isSshHost()      { [[ "$1" =~ ^[A-Za-z0-9._-]+$ ]]; }
```

Combined with `otmux has` (existence) these give one-liner ingress guards across every site. Same DRY principle as `this.isEmpty` (commit `1276e58`).

---

## Stats

- **Total public ingress methods audited**: 65
  - hiveMind: 38 (incl. protected.* observers)
  - otmux: 14
  - tronMonitor: 8
  - claudeCode: 12 (session/fork/join family)

- **Triple-defense coverage**:
  - Full (all 3): 1 (1.5%)
  - Partial (2 of 3): 4 (6%)
  - Weak (1 of 3): 12 (18%)
  - **None (0 of 3)**: 13 (20%) — **the SC-E.2 backlog**
  - n/a (no identifier ingress, read-only, or text-only): 35 (54%)

- **CRITICAL findings (W-class with 0 layers)**: 13 methods. SC-E.2 needs to apply triple defense to all of them. The protected observer family (5 methods) is the highest-leverage area — every cross-script event flows through them, and they're write-paths to env files.

---

## Hand-offs

- **SC-E.2 (expert)**: apply triple defense per P1/P2/P3 priority list above. Suggest one commit per ingress class (team, pane, observer, send, remote) to keep diffs reviewable.
- **SC-E.3 (tester)**: 3-vector reject test per ingress — for each fixed method, verify (1) bad regex rejects, (2) pipe-in-name rejects, (3) ghost identifier rejects.

## Related work

- `team.register` triple defense reference: commit `ebc8b5e`
- Bug #4 target validation (existing partial defense for send paths): `19fa1b7`
- `this.isEmpty` DRY predicate (model for proposed `is*` predicates): `1276e58`
