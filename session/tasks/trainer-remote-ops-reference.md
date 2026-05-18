# OOSH Remote Team Ops — Reference for agent-trainer

**Purpose:** explain hiveMind's remote-team verbs so the trainer knows what to teach. The trainer reads this; agents execute. No commands in this doc are meant to run as-is — they're for understanding shape.

---

## (1) Discovering hiveMind methods — Tab completion is the truth

OOSH's `c2` completion system reads function signatures directly from the script files. So the live menu IS the up-to-date API:

```
hiveMind <TAB>                  # all top-level methods
hiveMind team.<TAB>             # all team.* methods
hiveMind teams.<TAB>            # all teams.* methods (plural — full-machine)
hiveMind team.migrate <TAB>     # parameters for that method, in order
```

For per-method help with the doc comment + parameter signature:
```
hiveMind help                   # invokes this.help — lists every public method
hiveMind <method>               # most methods print usage on missing required args
```

If Tab doesn't yield expected completions, the user is in a non-OOSH shell. Fix: type `bash` to enter the OOSH shell (`[oosh hostname]` prompt confirms). See `docs/oosh.md → Starting an OOSH Shell`.

For the SOURCE of what each method does — read `~/oosh/hiveMind` directly. Every public method starts with `hiveMind.<name>() # <params> # description`. Search:
```
grep -n '^hiveMind\.' ~/oosh/hiveMind | grep -v completion
```

---

## (2) migrate vs pull vs restore vs restart — directionality

The four verbs differ in **direction**, **scope**, and **what input they consume**.

| Verb | Runs FROM | Acts ON | Scope | Reads | Writes |
|------|-----------|---------|-------|-------|--------|
| **`teams.migrate <host>`** | local (source) | remote (dest) | ALL sessions on local | local snapshot + JSONLs | remote env files + JSONLs, then ssh-exec restore |
| **`team.migrate <session> <host>`** *(planned — see §3)* | local (source) | remote (dest) | ONE session | local snapshot, filtered | remote env files (merge, not clobber) + JSONLs for that session |
| **`team.pull <host>`** | local (dest) | remote (source) | ONE team from remote | remote env + JSONLs | local registry (pulled to /tmp/hivemind.<host>/) — does NOT auto-restore |
| **`teams.restore <?snapshotFile> <?mode>`** | local (target) | local | ALL sessions in snapshot | local snapshot file | local tmux sessions + agents (forks JSONLs into panes) |
| **`team.restart <configDir>`** | local | local | ALL agents in pulled configDir | pulled snapshot + JSONLs | local tmux panes (forks new agents using pulled UUIDs) |
| **`agent.restart <configDir> <role>`** | local | local | ONE agent | pulled snapshot + that role's JSONL | one local tmux pane |

### Mental model

- **migrate** = PUSH (local → remote). Like `git push` for a team.
- **pull** = PULL (remote → local /tmp). Like `git fetch` — fetches but doesn't apply.
- **restore** = APPLY locally (cold-start a team from a snapshot file)
- **restart** = APPLY a previously-pulled remote config (= pull's output + restore)

### When to use which

| Goal | Verb |
|------|------|
| "Move my whole local setup to a fresh remote" | `teams.migrate <host>` |
| "Take one team I have here, get it running there" | `team.migrate <session> <host>` *(use when available — until then teams.migrate clones everything)* |
| "Recover my work after a crash — restore last snapshot locally" | `teams.restore` (with latest snapshot, auto-picked) |
| "I want to study what's on a remote without affecting my local" | `team.pull <host>` then look at `/tmp/hivemind.<host>/` |
| "I pulled, now restart one agent of that team locally" | `agent.restart <configDir> <role>` |
| "I pulled, now restart the whole team locally" | `team.restart <configDir>` |

---

## (3) Correct workflow for single-team fork to remote

### Today (before team.migrate ships)

You **cannot** safely do single-team migration. `teams.migrate <host>` clones EVERY session on your local machine to the remote — this is what bit the trainer (18 sessions cloned when they only wanted ooshTeam).

**Interim workaround** if you must single-team-migrate today:

1. On local, save a fresh snapshot:
   ```
   hiveMind teams.save
   ```
2. Identify the snapshot file: `ls -t ~/config/hivemind.snapshot.*.env | head -1`
3. Create a session-filtered copy:
   ```
   awk -F'|' -v s=ooshTeam '/^#/{print;next} $1==s' \
     ~/config/hivemind.snapshot.LATEST.env > /tmp/snap.ooshTeam.env
   ```
4. Push the filtered snapshot + JSONLs only for UUIDs in the filtered snapshot using `ossh scp`. Do NOT push roles.env/sessions.env/teams.env (they contain ALL teams and would clobber the remote's existing teams).
5. On remote, run `hiveMind teams.restore /tmp/snap.ooshTeam.env`.

This is fragile. Wait for `team.migrate <session> <host>` to ship — design is in progress with the architect.

### When team.migrate is available (planned shape, may change)

```
# from local:
hiveMind team.migrate ooshTeam McDonges
```

Expected steps under the hood:
1. Filter local snapshot to ooshTeam-only rows
2. Build session-scoped registry slices (roles/sessions/teams entries for that session)
3. Push the filtered snapshot + slices + JSONLs for that session's UUIDs
4. On remote, MERGE the slices into the existing registries (not overwrite)
5. Run a session-scoped teams.restore on remote — fork local UUIDs into new tmux panes

Net result: the team appears on McDonges. The remote's other existing teams are unaffected.

### Prerequisites (regardless of migrate vs workaround)

- `ossh config.get <host>` — verify the SSH host is defined (`ossh config.create` if not)
- `ossh exec <host> "oo --version"` — verify OOSH is installed on the remote (`oo remote.update <host>` if not)
- All agents you want migrated must be ATTACHED locally — `teams.save` reads from live tmux state. Detached agents whose UUIDs aren't in `~/config/hivemind.sessions.env` won't be in the snapshot.
- Remote must have `~/.claude/projects/<project-hash>/` writable for JSONL drops. Usually it does if the user has ever run `claude` there.

---

## (4) Common confusions

| The agent thinks... | Reality |
|---------------------|---------|
| "otmux send doesn't work from Bash tool" | False. otmux send shells out to tmux server — no tty required at the caller. The Bash tool is a fine context. |
| "I have to use teams.migrate for single team" | True TODAY (with the awk workaround). False once team.migrate ships. |
| "team.pull is the inverse of teams.migrate" | Half-true. teams.migrate pushes AND restores in one shot. team.pull only fetches — restore is a separate step (team.restart or agent.restart). |
| "I should run teams.migrate from the remote to pull" | No. teams.migrate is a PUSH from local. To bring a remote team to local, use team.pull. |
| "restore overwrites everything" | teams.restore reads a snapshot and recreates the listed sessions. Other unmentioned sessions are untouched. But it does call team.register per session which fires the team.created event — handlers run. |

---

## (5) References

- `hiveMind` script: `~/oosh/hiveMind` (search `^hiveMind\.team` for the team verb family)
- Tab completion engine: `~/oosh/c2`
- OOSH architecture: `docs/oosh-architecture.md`
- This rewind block: see `session/agents/oosh-expert/context.md` for the Sprint 1 SC-C team.created/destroyed/restored handlers (which migrate will also use)

---

**Trainer note:** when explaining this to agents, emphasize:
1. **Direction** (PUSH vs PULL) is the #1 confusion
2. **Scope** (all sessions vs one) is the #2
3. **Tab completion is the source of truth** — never copy command syntax from memory; ask Tab
4. **Single-team migration**: not safely available until team.migrate ships. Tell agents to wait or use the documented awk workaround.
