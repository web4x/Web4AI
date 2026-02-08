# TEAM RULE: Never ASSUME — Always MEASURE

**Applies to**: ALL agents
**Effective**: Immediately
**Authority**: PO

## Core Principle

**assume = ass|u|me** — it makes an ass out of u and me.

- CMM Level 4 = we MEASURE
- CMM Level 5 = we measure how well we IMPROVE measuring

## What This Means

1. **Context limits**: Use `claudeCode context.read <pane>` to get actual %. Never guess from old prompts or memory.
2. **Pane state**: Use `otmux pane.capture` to see what's actually there. Never assume a send worked.
3. **Git state**: Use `git status` / `git log` before acting. Never assume clean or dirty.
4. **Agent state**: Capture the pane. Don't assume idle, blocked, or active.
5. **Test results**: Run the test. Don't assume it passes because the code "looks right."

## Anti-Patterns (FORBIDDEN)

- "I think context is around 50%..." — MEASURE IT
- "The send probably worked..." — VERIFY IT
- "Expert should be done by now..." — CHECK THE PANE
- "Tests should pass..." — RUN THEM
- "The file probably exists..." — READ IT

## Pattern

```
WRONG: assume state → act on assumption → surprised by reality
RIGHT: measure state → act on measurement → predictable outcome
```

## This is mandatory. No exceptions.
