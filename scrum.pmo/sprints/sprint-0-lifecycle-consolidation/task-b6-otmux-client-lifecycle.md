# Task B6: otmux client lifecycle — broken after stale read-only attach

[task:uuid:b6-2026-05-01]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing — commit d860bec
  - [x] testing (live verified — 3 stale clients detached, layout restored)
- [x] QA Review
- [x] Done

## Symptom
Stale read-only tmux client(s) from tronMonitor's `screen -S tronMon -X screen ... TMUX= tmux attach -r` chain stayed attached at 54x26 for hours/days. Even with `window-size=largest` set, the small clients still affected layout — Tron's panes got crushed.

Pre-fix `tmux list-clients` showed:
```
/dev/ttys044  TRONinterface  54x26  attached,focused,ignore-size,read-only,UTF-8  97h 25m
/dev/ttys045  ooshTeam       54x26  attached,focused,ignore-size,read-only,UTF-8  4m
/dev/ttys046  web4team       54x26  attached,focused,ignore-size,read-only,UTF-8  4m
/dev/ttys016  ooshTeam       109x53 attached,focused,UTF-8                        1m
```

The 97h25m idle client was the smoking gun.

## Fix (commit d860bec)

### 1. `otmux.client.list` — structured output
Replaced default `tmux list-clients` output with tabular: TTY | SESSION | SIZE | FLAGS | IDLE. Idle is computed from `client_activity` epoch. Now operators can spot the stale 97h client at a glance.

### 2. `otmux.client.detach` — reliable + auto-refresh
- Uses `-t <client>` explicitly when target given
- After detach, calls `tmux refresh-client -S` to force size re-sync on remaining clients (this is what restores widths)
- Returns clean rc; error.log on failure

### 3. `otmux.client.cleanup` — bulk detach by flag
New method: `otmux client.cleanup <?filter:read-only>` — iterates `list-clients`, detaches every client whose flags match `<filter>`. Default targets read-only (the typical monitoring case).

Also calls `refresh-client -S` after the bulk detach to restore layout.

### 4. Layout refresh after detach
`tmux refresh-client -S` (sync) sends a SIGWINCH-equivalent that forces all remaining clients to re-evaluate sizes. Without it, the server keeps the previous "smallest client" geometry even after the small client is gone.

## Live verification
```
$ otmux client.cleanup
SUCCESS> client.cleanup: detached 3, kept 1 (filter='read-only')

$ otmux client.list                  # only the real 109x53 shell remains
TTY            SESSION    SIZE     FLAGS                    IDLE
/dev/ttys016   ooshTeam   109x53   attached,focused,UTF-8   1m
```

## Test handoff (tester suggestions)
- `T-B6-1` `otmux client.list` → tabular output with TTY/SESSION/SIZE/FLAGS/IDLE columns
- `T-B6-2` `otmux client.cleanup` (with no read-only attach) → 0 detached, kept N
- `T-B6-3` `otmux client.cleanup` (with stale read-only attach) → detaches it, layout grows back
- `T-B6-4` `otmux client.detach <bad-tty>` → rc=1, error message, no crash
- `T-B6-5` `otmux client.cleanup ignore-size` → filter works for any flag, not just read-only
- `T-B6-6` no tmux server → `client.list` and `client.cleanup` both print "no tmux server" rc=1

## Follow-ups (out of scope, file separately if needed)
- tronMonitor's screen wrapper could call `otmux client.cleanup read-only` periodically
- Or D2 events could fire `client.cleanup` on team.remove
