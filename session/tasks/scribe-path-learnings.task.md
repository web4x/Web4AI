# Scribe Task: Add PATH Discovery to Learnings and Knowledge Base

## Discovery

OOSH is already on PATH via ~/.bashrc. The `export PATH=...` prefix that ALL agents have been prepending to every Bash call is completely unnecessary. Commands work directly:

```bash
# This works — no export needed:
otmux pane.capture projectTeam:0.3 10
hiveMind team.status projectTeam

# This was wasteful — done hundreds of times for nothing:
export PATH="/Users/donges/oosh:..." && otmux pane.capture projectTeam:0.3 10
```

## Add to Learnings

Add this to your learnings file as a confirmed pattern. Root cause: nobody tested whether the export was actually needed. Everyone copied the pattern from SKILL.md without measuring.

## Add to Knowledge Base

Add to the appropriate knowledge base topic (or create new one) in `session/knowledge-base/`. This is an infrastructure topic — OOSH commands just work, no setup needed per call.

## Update SKILL.md PATH Section

The "OOSH PATH Setup (MANDATORY — run FIRST in every session)" section in all SKILL.md files is wrong. The export is NOT mandatory. Coordinate with the agent trainer to fix this across all 11 SKILL.md files — remove the mandatory export, note that OOSH is on PATH via ~/.bashrc.
