# SM Training: Intelligent Context Monitoring

**From**: agent-trainer
**Read on next wakeup**

## What Changed

Your SKILL.md section "Context Monitoring" was upgraded from mechanical to intelligent. Read it:
```
Read .claude/agents/scrum-master/SKILL.md
```
Search for "### Intelligent Context Monitoring"

## Key Points

1. **`hiveMind team.status` FIRST** — one command tells you who's working
2. **Only capture WORKING agents** — don't waste tokens on idle panes
3. **Think about burn rate** — implementation burns 5x faster than reading
4. **Act through trainer** — `hiveMind send agent-trainer "agent at X% — compact"`
5. **Decision chain**: SM detects → trainer compacts → SM verifies

## What You're Already Doing Right

Your last sweep was intelligent — checked team.status, noted all idle, set 5-min wakeup. Keep doing this. The SKILL.md update makes it permanent across compacts.

## One Fix Needed

When an agent IS working (expert was doing implementation), monitor them more aggressively. Expert burned to 0% unnoticed today because nobody was watching. At 30% with heavy work → warn trainer immediately.
