# BUG: claudeCode hardcodes opus-4-6, must default to opus-4-8 1M — and `join` doesn't pass --model at all

**From**: oosh-po (Tron directive 2026-06-24: "all agents must be default opus 4.8 1m agents. verify!!! order a fix in claudeCode")
**Owner**: oosh-expert (fix) → oosh-tester (verify)
**Priority**: CRITICAL
**Status**: OPEN

## Findings (measured on WODA.prod 2026-06-24)

### BUG A: `claudeCode join` does NOT pass `--model` → agents inherit session default (may be 200k or wrong model)

```
ooshTeam agents (via `claudeCode join`):
  /root/.local/bin/claude --resume 6df08923-…    ← NO --model flag
  /root/.local/bin/claude --resume a43c1b23-…    ← NO --model flag
  /root/.local/bin/claude --resume 74f27969-…    ← NO --model flag

robbinTeam agents (via `claudeCode fork`):
  /root/.local/bin/claude --resume … --model claude-opus-4-6[1m]  ← has flag (but wrong version)
```

The oosh-architect was a `join` session with no `--model` → ran as 200k Opus → auto-compacted at 300k when a prompt was sent. **This killed the architect's training.**

### BUG B: ALL 6 model strings hardcoded to `claude-opus-4-6[1m]` — must be `claude-opus-4-8[1m]`

| Line | Method | Current | Should be |
|------|--------|---------|-----------|
| 333 | `join()` resume | `claude-opus-4-6[1m]` | `claude-opus-4-8[1m]` |
| 448 | `fork()` | `claude-opus-4-6[1m]` | `claude-opus-4-8[1m]` |
| 470 | `fork.byId()` | `claude-opus-4-6[1m]` | `claude-opus-4-8[1m]` |
| 489 | `fork.fast()` | `claude-opus-4-6[1m]` | `claude-opus-4-8[1m]` |
| 652 | `opus()` | `claude-opus-4-6[1m]` | `claude-opus-4-8[1m]` |
| (join has no --model at all) | `join()` | MISSING | add `--model claude-opus-4-8[1m]` |

### The fix (DRY)

1. **ONE constant** at the top of claudeCode: `CLAUDECODE_DEFAULT_MODEL="claude-opus-4-8[1m]"`
2. ALL 6 sites reference `$CLAUDECODE_DEFAULT_MODEL` instead of hardcoded strings
3. `claudeCode join` must pass `--model "$CLAUDECODE_DEFAULT_MODEL"` (currently missing)
4. `claudeCode new` must also pass it (verify)
5. When Anthropic releases opus-4-9, change ONE line — DRY

## Acceptance Criteria

- [ ] `CLAUDECODE_DEFAULT_MODEL` constant at top of claudeCode script, set to `claude-opus-4-8[1m]`
- [ ] ALL resume/fork/new/opus methods use the constant (zero hardcoded model strings)
- [ ] `claudeCode join <uuid>` passes `--model` → confirmed in `ps -eo args` output
- [ ] `claudeCode opus` launches opus-4-8 1M (not 4-6)
- [ ] After fix: ALL running agents on WODA.prod show `--model claude-opus-4-8[1m]` in their process args
- [ ] Tester: T-MODEL-DEFAULT — grep claudeCode for hardcoded model strings → zero; verify constant used everywhere

## Report-back (edit here; report to oosh-po)
- Expert (fix + commit):
- Tester (T-MODEL-DEFAULT result):
