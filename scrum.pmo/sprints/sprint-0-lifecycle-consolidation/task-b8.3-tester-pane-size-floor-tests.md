[Back to Task B8](./task-b8-otmux-pane-size-floor-proposal.md)

# Task B8.3: Tester - otmux pane size floor tests
[task:uuid:b8a3-tester-2026-05-08]

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Task B8: otmux pane size floor proposal](./task-b8-otmux-pane-size-floor-proposal.md)

## Description
**Role: oosh-tester**

Implementation already shipped in commits **`2196cdc`** (4 methods + teams.restore
hook) and **`885e587`** (regex-safe awk + 4-state classification). Methods live
in `/Users/donges/oosh/otmux` lines 1164–1301:

```
otmux.window.size.lock          <?session> <?width:80> <?height:40>
otmux.window.size.unlock        <?session>
otmux.window.size.status
otmux.window.size.floor.apply   <?width:80> <?height:40>
```

Persistence: `~/config/otmux.size.locks.env` (one line per locked window:
`session:win|W|H|epoch`).

> **Discovery note:** `otmux help` is currently broken (separate pre-existing bug,
> calls `tmux --help`). Verify methods directly via `otmux window.size.status`
> or `compgen -A function | grep '^otmux\.window\.size\.'`.

### Test cases (write to `/Users/donges/oosh/test/test.otmux`)

| ID | Setup | Action | Expected |
|----|-------|--------|----------|
| **T-FLOOR-1** | Create test session, ensure no clients | `otmux window.size.status` | Window shows `[collapsed]` (red), size <80×40 |
| **T-FLOOR-2** | Continuing T-FLOOR-1 | `otmux window.size.floor.apply` | Window now ≥80×40, env file has entry |
| **T-FLOOR-3** | Locked window from T-FLOOR-2 | Detach all clients (or never attach), wait, recheck | Size stays 80×40 (lock persists) |
| **T-FLOOR-4** | Locked window | `otmux window.size.unlock <session>` | `window-size` reverts to `largest`, env entry removed |
| **T-FLOOR-5** | Already-locked window | `otmux window.size.lock <session>` again | `0 locked, 1 already ≥ floor`, env file unchanged (no duplicate) |
| **T-FLOOR-6** | Window already 200×60 | `otmux window.size.lock <session>` | Skipped (never shrinks); window stays 200×60 |
| **T-FLOOR-7** | Mix of collapsed + healthy + locked | `otmux window.size.status` | Color codes: red collapsed (no client + small), cyan small-with-client, yellow locked, green healthy |

### Status classification fixtures (T-FLOOR-7 detail)

| Pane state | Floor (80×40) | Clients | Expected color | Marker |
|-----------|---------------|---------|----------------|--------|
| 1×1       | below         | 0       | red            | `[collapsed]` |
| 57×30     | below         | 1       | cyan           | `[small client]` |
| 80×40     | at            | 0       | green if !locked, yellow if locked | none |
| 200×60    | above         | 0       | green          | none |

### Fixture helpers

To create a collapsed session for testing:
```bash
tmux -u new-session -d -s __test_b8_$$
tmux set-window-option -t __test_b8_$$ window-size manual
tmux resize-window -t __test_b8_$$ -x 1 -y 1
```

Cleanup:
```bash
tmux kill-session -t __test_b8_$$ 2>/dev/null
otmux window.size.unlock __test_b8_$$ 2>/dev/null
```

### Regex-safety regression
Confirm awk-based literal matching (commit `885e587`) handles session names with
escape sequences. Synthetic check:
```bash
echo 'weird[name|80|40|0' >> ~/config/otmux.size.locks.env
otmux window.size.status   # must NOT emit "grep: brackets unbalanced"
sed -i '' '/weird\[name/d' ~/config/otmux.size.locks.env
```

### Pass criteria
All 7 T-FLOOR cases green. test.suite assertions wired through expect/expect.fail.

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*
