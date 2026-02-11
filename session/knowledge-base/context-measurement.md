# Context Measurement — Details

## Tools
- `claudeCode context.read <pane>` — JSONL % (trends), commit 894a618
- `claudeCode context.velocity <pane>` — tokens/hr + prediction, commit b2f6892
- `claudeCode context.dashboard` — all sessions overview
- `hiveMind dashboard` — single source of truth, commit b13b6df
- TUI bottom bar — ground truth for auto-compact threshold

## JSONL vs TUI Discrepancy
JSONL and TUI show different numbers. Root cause: different denominators. JSONL counts tokens in the session JSONL file. TUI uses internal context window tracking.

- JSONL: use for trends and burn rate
- TUI: use for compact decisions (ground truth for auto-compact)
- Report BOTH when possible

## Known Bug
`context.read` same-value bug (fixed in 350acbb): returned identical % for different panes because `context.jsonl()` found global newest file, not pane-specific. Fix: pane -> session.id -> $sid.jsonl.

## Key Rule
NEVER ASSUME — ALWAYS MEASURE. assume = ass|u|me. Never say "healthy" without data. Never panic without measuring first.

## Action Checklists
-> session/knowledge-base/actions/check-context.md
