# S-0: Fork oosh-expert to WODA.prod (manual bootstrap)

**Status**: IN PROGRESS — JSONL transfer needed from MacStudio
**Owner**: oosh-po@WODA.prod (driving) + oosh-po@MacStudio (executes scp)
**Sprint**: sprint-team-migration

## What's needed

Transfer oosh-expert JSONL from MacStudio → WODA.prod, then fork + rename + /rc.

## ACTION for oosh-po@MacStudio (or Tron via TRONinterface:0.2)

Run this from a MacStudio shell (NOT from inside WODA.prod):

```bash
# 1. Find the expert JSONL
find ~/.claude/projects -name "a43c1b23-7de6-4c75-8952-3e98b6ca43b6.jsonl" 2>/dev/null

# 2. scp it to WODA.prod TARGET hash dir (the correct placement per #7)
scp <path-from-step-1> WODA.prod:/root/.claude/projects/-var-dev-Workspaces-AI-Claude/a43c1b23-7de6-4c75-8952-3e98b6ca43b6.jsonl

# Example (likely path):
# scp ~/.claude/projects/-Users-Shared-Workspaces-AI-Claude/a43c1b23-7de6-4c75-8952-3e98b6ca43b6.jsonl WODA.prod:/root/.claude/projects/-var-dev-Workspaces-AI-Claude/a43c1b23-7de6-4c75-8952-3e98b6ca43b6.jsonl
```

## After JSONL lands, oosh-po@WODA.prod will

```bash
# 3. Verify JSONL present
ls -la ~/.claude/projects/-var-dev-Workspaces-AI-Claude/a43c1b23*.jsonl

# 4. Fork in target pane
otmux send.enter ooshTeam:0.2 "cd /var/dev/Workspaces/AI/Claude && claudeCode fork a43c1b23-7de6-4c75-8952-3e98b6ca43b6"

# 5. Wait for resume, then rename + /rc
# (after fork settles — ~15s)
otmux send.enter ooshTeam:0.2 "/rename oosh-expert@WODA.prod"
otmux send.enter ooshTeam:0.2 "/remote-control"

# 6. Verify
otmux pane.capture ooshTeam:0.2 10
hiveMind team.status ooshTeam
```

## Checklist
- [ ] JSONL transferred to `/root/.claude/projects/-var-dev-Workspaces-AI-Claude/a43c1b23-7de6-4c75-8952-3e98b6ca43b6.jsonl`
- [ ] Fork + resume-full in ooshTeam:0.2
- [ ] `/rename oosh-expert@WODA.prod`
- [ ] `/remote-control` active (URL captured)
- [ ] Verified: pane.get.target + session.name + claudeCode list
