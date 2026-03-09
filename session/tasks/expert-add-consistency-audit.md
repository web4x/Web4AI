# Task: Implement `hiveMind consistency.audit`
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-06
**Priority**: HIGH — this is the core tester need, everything else builds on it

---

## What

One command that cross-compares ALL identity sources and shows mismatches:

```bash
hiveMind consistency.audit
```

## Expected Output

```
Identity Consistency Audit
═══════════════════════════════════════════════════════════════════════════════════════
PANE                        TITLE            REGISTRY     SESSIONS.ENV UUID   LIVE UUID        MATCH
───────────────────────────────────────────────────────────────────────────────────────
projectTeam:0.3             oosh-expert      MISSING      a2c6b6c4           a2c6b6c4         ✗ no registry
projectTeam:0.4             oosh-tester      MISSING      a2c6b6c4           6213b3dc         ✗ UUID stale
projectTeam:0.5             scrum-master     MISSING      0f0755a8           e7606830         ✗ UUID stale
projectTeam:1.0             woda-writer      MISSING      f5de0cee           d177f466         ✗ UUID stale
ooshDebug:0.0               Status Check     MISSING      c2775135           c2775135         ✗ no registry
osshTeam:0.3                sm-ossh          MISSING      -                  443c490c         ✗ no registry
odockerTeam:0.1             Commit to Exp..  MISSING      -                  c102986c         ✗ no registry
claudeOpus2kTMUX:0.0        claudeSonnet..   MISSING      -                  98fd1d49         ✗ no registry
hiveMindTeam02_03_26:0.0    hiveMind-expert  hiveMind-expert  75ce660f       75ce660f         ✓
hiveMindTeam02_03_26:0.1    hiveMind-tester  hiveMind-tester  004e5ea9       004e5ea9         ✓
───────────────────────────────────────────────────────────────────────────────────────
Summary: 2 consistent, 8 inconsistent (6 missing registry, 3 stale UUID, 1 duplicate UUID)
```

## Data Sources Per Column

| Column | Source | How to Get |
|--------|--------|------------|
| PANE | tmux | `tmux list-panes -a -F "#{session_name}:#{window_index}.#{pane_index}"` |
| TITLE | tmux | `#{pane_title}` from same query |
| REGISTRY | roles.env | `grep "^${pane}|" ~/config/hivemind.roles.env` |
| SESSIONS.ENV UUID | sessions.env | Look up role in sessions.env, get UUID (first 8 chars) |
| LIVE UUID | ps args or session.probe | `ps --resume` extraction, fallback `session.probe` |
| MATCH | computed | Compare: registry exists? title contains registry role? sessions.env UUID == live UUID? |

## Consistency Checks (the MATCH column)

For each pane with a Claude process:
1. **Registry exists?** — roles.env has entry for this pane
2. **Title matches registry?** — pane title contains the registry role name
3. **UUID matches?** — sessions.env UUID for this role == live UUID from ps/probe
4. **No duplicate UUIDs?** — same UUID shouldn't appear for multiple roles
5. **Role name valid?** — not garbage (>30 chars, contains spaces)

Mark `✓` only when ALL checks pass. Otherwise `✗` with the specific failure.

## Also Fix: `teams.save` Role Fallback from Title

While implementing this, also add title-as-role fallback to `teams.save` (line ~1389):

```bash
# After registry.get fallback, try pane title:
if [ -z "$role" ] || [ "$role" = "unknown" ]; then
    role="${title}"
    role="${role#✳ }"    # strip status indicators
    role="${role#⠐ }"
    role="${role#⠂ }"
    role="${role%%@*}"   # strip @model suffix
    role=$(echo "$role" | tr -d '[:space:]' | head -c 30)  # sanitize
    [ -z "$role" ] && role="unknown"
fi
```

This way `teams.save` output shows `oosh-expert` instead of `unknown` for projectTeam:0.3.
