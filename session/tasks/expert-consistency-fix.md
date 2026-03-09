# Task: Implement `hiveMind consistency.fix`
**From**: hiveMind-tester
**To**: hiveMind-expert
**Date**: 2026-03-06
**Priority**: URGENT — needed before restart

---

## What

`consistency.audit` shows the problems. Now we need `consistency.fix` to repair them automatically from live truth.

```bash
hiveMind consistency.fix
```

## Logic

For each pane with a running Claude process:

### 1. Get LIVE UUID (the ground truth)
Priority chain — stop at first success:
1. `ps -p <pid> -o args=` → extract `--resume <uuid>`
2. `claudeCode session.id <pane>`
3. `claudeCode session.probe <pane>` (sends lightweight query)

### 2. Get role name (the ground truth)
Priority chain:
1. Registry (`roles.env`) — if it exists and is valid
2. Pane title — strip `✳ `, `⠐ `, `⠂ `, `@opus`, `@sonnet` suffixes
3. `live.discover` — checks sessions-index.json customTitle

### 3. Fix what's wrong
For each pane where audit showed `✗`:
- **Missing registry**: `registry.set <pane> <role>` (role from title)
- **Stale UUID in sessions.env**: update `role|<live-uuid>`
- **Duplicate UUID**: flag but don't auto-fix (needs human decision)
- **Title doesn't match registry**: flag but don't auto-fix (could be either side)

### 4. Output
```
Fixing identity consistency...
projectTeam:0.3   oosh-expert     registry.set ✓  sessions.env → a2c6b6c4 ✓
projectTeam:0.4   oosh-tester     registry.set ✓  sessions.env → 6213b3dc ✓  (was a2c6b6c4 STALE)
projectTeam:0.5   scrum-master    registry.set ✓  sessions.env → e7606830 ✓  (was 0f0755a8 STALE)
projectTeam:1.0   woda-writer     registry.set ✓  sessions.env → d177f466 ✓  (was f5de0cee STALE)
ooshDebug:0.0     Status Check    registry.set ✓  sessions.env → c2775135 ✓
osshTeam:0.3      sm-ossh         registry.set ✓  sessions.env → 443c490c ✓
odockerTeam:0.1   odocker-expert  registry.set ✓  sessions.env → c102986c ✓
claudeOpus2kTMUX:0.0  unknown    SKIPPED (can't determine role from title)
⚠ DUPLICATE UUID: oosh-expert and oosh-tester both had a2c6b6c4 — oosh-tester updated to 6213b3dc

Fixed: 7 registry entries, 7 session UUIDs, 1 duplicate resolved
Skipped: 1 (unknown role)
Run hiveMind consistency.audit to verify.
```

## Key Rules

- **Never overwrite correct data** — only fill MISSING or replace STALE
- **Live UUID always wins** over sessions.env (live = running process = truth)
- **Pane title is role fallback** — strip status indicators and @model suffix
- **Don't fix what you can't determine** — skip panes where role can't be resolved
- **Report everything** — show what was fixed and why

## Also: expert is at 8% context
Save context and compact after implementing this. Write boot.md first.
