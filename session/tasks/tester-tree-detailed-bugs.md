# Bugs: otmux tree / tree.detailed for hiveMindTeam02_03_26

**From**: hiveMind-tester (hiveMindTeam02_03_26:0.1)
**To**: hiveMind-expert (hiveMindTeam02_03_26:0.0)
**Date**: 2026-03-03
**Priority**: HIGH

---

## BUG-A: otmux tree shows [bash] instead of Claude version

**Expected** (hiveMindTeam old):
```
├── 0.0   hiveMind-expert          [2.1.39]
└── 0.1   hiveMind-tester          [2.1.39]
```

**Actual** (hiveMindTeam02_03_26):
```
├── 0.0   ✳ hiveMind-expert@opus [bash]
└── 0.1   ⠐ hiveMind-tester@opus [bash]
```

**Ground truth**: `claudeCode version hiveMindTeam02_03_26:0.0` → `2.1.63`

**Root cause**: `otmux.tree` uses `#{pane_current_command}` from tmux to show the process type in brackets. When Claude was started directly (`claude --resume`), tmux shows the version `2.1.39`. When started via OOSH wrapper (`claudeCode join <uuid>`), tmux sees `bash` (the wrapper script), not the underlying Claude process.

**Location**: `otmux` line ~1252:
```bash
printf "%s%s %-5s %-24s [%s]\n" ... "$pane_cmd"
```

**Fix suggestion**: When `pane_cmd` is `bash`, check for a child Claude process or call `claudeCode version <pane>` to get the real version.

---

## BUG-B: tree.detailed missing sub-lines (no session names, no UUIDs)

**Expected** (hiveMindTeam old):
```
├── 0.0   hiveMind-expert          [2.1.39]
│     └ hiveMind-expert@opus       [75ce660f]
└── 0.1   hiveMind-tester          [2.1.39]
      └ hiveMind-tester@opus       [004e5ea9]
```

**Actual** (hiveMindTeam02_03_26):
```
├── 0.0   ✳ hiveMind-expert@opus [bash]
└── 0.1   ⠐ hiveMind-tester@opus [bash]
```

No sub-lines at all. No session name. No UUID.

**Ground truth**:
- Expert UUID: `75ce660f-ecca-4e48-8ffe-53f7e774a0a8` (confirmed via `session.id` AND `ps args`)
- Tester UUID: `004e5ea9-6ed5-4c20-bc9e-7db38677b14b` (confirmed via `session.id` AND `ps args`)

**Root cause**: `otmux.tree.detailed()` line 1336:
```bash
if [[ "$pane_cmd" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]] || [[ "$pane_cmd" == "claude" ]]; then
```

This condition ONLY matches when `pane_cmd` is a version number or `claude`. When `pane_cmd` is `bash` (OOSH wrapper), the entire agent detection block is skipped — no `session.id` lookup, no session name, no UUID sub-line.

**Fix suggestion**: Add `bash` to the detection condition when a Claude child process is present:
```bash
# Also detect Claude running behind OOSH wrapper
if [[ "$pane_cmd" =~ ^[0-9]+\.[0-9]+\.[0-9]+ ]] || [[ "$pane_cmd" == "claude" ]] || \
   { [[ "$pane_cmd" == "bash" ]] && claudeCode process.find "$pane_target" >/dev/null 2>&1; }; then
```

---

## BUG-C: hiveMind resolve ignores session parameter

**Tested**:
```bash
hiveMind resolve hiveMind-expert hiveMindTeam      # → hiveMindTeam02_03_26:0.0
hiveMind resolve hiveMind-tester hiveMindTeam      # → hiveMindTeam02_03_26:0.1
```

**Expected**: Should return panes from `hiveMindTeam` (the specified session), or empty/error if not found there.

**Actual**: Returns panes from `hiveMindTeam02_03_26` despite asking for `hiveMindTeam`.

**Impact**: The session parameter is meaningless — resolve always returns the first matching role across ALL sessions. This makes it impossible to scope resolution to a specific session.

**User confirmed**: "ignoring the parameter is a bug"

---

## Verified CORRECT

| Check | Result |
|-------|--------|
| session.id 0.0 → 75ce660f... | PASS (matches ps args) |
| session.id 0.1 → 004e5ea9... | PASS (matches ps args) |
| team.status hiveMindTeam02_03_26 | PASS (both agents, correct UUIDs) |
| Live discovery without registry | PASS (expert verified) |
| team.status hiveMindTeam (old) | PASS (shows old pane states) |
