# Task: Add OOSH colors to consistency.audit and consistency.fix
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-07
**Priority**: LOW — readability improvement

## What
Both `consistency.audit` and `consistency.fix` output plain text. OOSH provides `BOLD_GREEN`, `BOLD_YELLOW`, `BOLD_RED`, `BOLD_CYAN`, `GRAY`, `NORMAL` (from `~/config/setup.color.env`, sourced at OOSH init). Use them.

## consistency.audit colors

| Element | Color | Variable |
|---------|-------|----------|
| Title line "Identity Consistency Audit" | `BOLD_CYAN` | heading |
| `═══` and `───` separator lines | `GRAY` | visual structure |
| Column headers (PANE, TITLE, etc.) | `BOLD_WHITE` | readability |
| `✓` match | `BOLD_GREEN` | success = green |
| `✗` + issue text ("dup UUID", "UUID stale", "title≠reg") | `BOLD_RED` | error = red |
| `MISSING` registry | `BOLD_YELLOW` | warning = yellow |
| Summary line counts: consistent count green, inconsistent count red | mixed | quick scan |

### Specific lines to change in `consistency.audit`:

```bash
# Line 1549: title
echo -e "${BOLD_CYAN}Identity Consistency Audit${NORMAL}"

# Line 1550: top separator
echo -e "${GRAY}$(printf '%.0s═' {1..85})${NORMAL}"

# Line 1551: column headers
printf "${BOLD_WHITE}%-28s %-16s %-16s %-13s %-16s %s${NORMAL}\n" "PANE" "TITLE" "REGISTRY" "SESS.ENV" "LIVE UUID" "MATCH"

# Line 1552: separator
echo -e "${GRAY}$(printf '%.0s─' {1..85})${NORMAL}"

# Line 1619-1627: match result coloring
local match="${BOLD_GREEN}✓${NORMAL}"
if [ ${#issues[@]} -gt 0 ]; then
  match="${BOLD_RED}✗${NORMAL}"
  issue_str="${BOLD_RED}$(IFS=', '; echo "${issues[*]}")${NORMAL}"

# Line 1576: MISSING registry
local reg_display="${reg_role:-${BOLD_YELLOW}MISSING${NORMAL}}"

# Line 1634: bottom separator
echo -e "${GRAY}$(printf '%.0s─' {1..85})${NORMAL}"

# Line 1635: summary
echo -e "Summary: ${BOLD_GREEN}$consistent consistent${NORMAL}, ${BOLD_RED}$inconsistent inconsistent${NORMAL}"
```

## consistency.fix colors

| Element | Color | Variable |
|---------|-------|----------|
| "Fixing identity consistency..." | `BOLD_CYAN` | heading |
| `registry.set ✓` (new fix applied) | `BOLD_GREEN` | action taken |
| `registry ✓` (already correct) | `GREEN` | no change needed |
| `sessions.env → uuid ✓` (new/updated) | `BOLD_GREEN` | action taken |
| `(was xxx STALE)` | `BOLD_YELLOW` | warning — old value |
| `⚠ DUPLICATE UUID:` | `BOLD_RED` | error |
| `SKIPPED` | `BOLD_YELLOW` | warning |
| Summary "Fixed:" line | `BOLD_GREEN` for counts > 0, `GRAY` for 0 | quick scan |

### Specific lines to change in `consistency.fix`:

```bash
# Line 1661: heading
echo -e "${BOLD_CYAN}Fixing identity consistency...${NORMAL}"

# Line 1728: registry fix applied
line_parts+=("${BOLD_GREEN}registry.set ✓${NORMAL}")

# Line 1731: registry already ok
line_parts+=("${GREEN}registry ✓${NORMAL}")

# Line 1739: duplicate warning
echo -e "${BOLD_RED}⚠ DUPLICATE UUID: $dup_role and $role both have ${live_uuid:0:8}${NORMAL}"

# Line 1750: new sessions.env entry
line_parts+=("${BOLD_GREEN}sessions.env → ${live_uuid:0:8} ✓${NORMAL}")

# Line 1755: stale replaced
line_parts+=("${BOLD_GREEN}sessions.env → ${live_uuid:0:8} ✓${NORMAL}  ${BOLD_YELLOW}(was ${old_uuid:0:8} STALE)${NORMAL}")

# Line 1758: already ok
line_parts+=("${GREEN}sessions.env ✓${NORMAL}")

# Line 1761: no live uuid
line_parts+=("${BOLD_YELLOW}sessions.env — (no live UUID)${NORMAL}")

# Line 1716: skipped
printf "${BOLD_YELLOW}%-28s %-16s SKIPPED (can't determine role)${NORMAL}\n" ...

# Line 1769: summary
echo -e "Fixed: ${BOLD_GREEN}$fixed_reg${NORMAL} registry, ${BOLD_GREEN}$fixed_sess${NORMAL} sessions, ${BOLD_RED}$dup_resolved${NORMAL} duplicates"
```

## Rules
- Use `echo -e` for lines with color escapes (not plain `echo`)
- Use `${NORMAL}` to reset after every colored segment
- OOSH sources `setup.color.env` at init — variables are available in all scripts
- Test: `hiveMind consistency.audit` from ooshDebug:0.1 — colors should render in terminal
