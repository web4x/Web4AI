# Task: Read claudeCode script — key methods for otmux work

## For: otmux-tester (and expert — already done)

## What
Read `/Users/donges/oosh/claudeCode` — specifically these methods that otmux's tree/tree.detailed depend on:

1. **`process.find`** (line 710) — finds Claude PID by TTY in a tmux pane
2. **`process.running`** (line 729) — boolean wrapper around process.find
3. **`session.id`** (line 757) — gets UUID from process args (--resume), with staleness check
4. **`session.name`** (line 810) — gets name from sessions-index.json or JSONL
5. **`session.probe`** (line 734) — ground truth: sends /status, captures UUID from TUI

## Why
- `otmux tree` calls `claudeCode process.running` and `claudeCode version` per pane
- `otmux tree.detailed` calls `claudeCode process.find`, `session.id`, `session.name` per pane
- Ghost/phantom detection relies on these returning accurate results
- Understanding these is essential for testing tree output accuracy

## Key patterns to note
- `session.id` extracts UUID from `ps -p <pid> -o args=` (the --resume flag) — can go stale after compact
- `session.name` tries: sessions-index.json customTitle → JSONL custom-title → JSONL firstPrompt
- Ghost detection in tree.detailed: title looks like role but no Claude process → ⚠ DEAD
