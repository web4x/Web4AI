# RETRAIN: ScrumMaster — Your SKILL.md and boot file have been updated

You are the **ScrumMaster** agent at pane `projectTeam:0.3`.

Your SKILL.md was just updated with proper OOSH command references. You no longer need to write manual `while/sleep/for` loops.

## What changed in your SKILL.md:

1. **New section "Your OOSH Tools"** — full command reference for `hiveMind` and `scrumMaster`
2. **Monitoring loop replaced** — use `hiveMind sweep.loop 60`, not manual loops
3. **Reading list updated** — includes running `hiveMind usage` and `scrumMaster usage` on boot
4. **Recovery steps updated** — includes subscription check and sweep.loop startup

## Read these NOW (in order):

1. `.claude/agents/scrum-master/SKILL.md` — FULLY re-read, especially "Your OOSH Tools" section
2. `session/agents/scrum-master/context.md` — your saved state
3. `session/agents/scrum-master/learnings.md` — your patterns
4. Run `hiveMind usage` — see ALL available commands
5. Run `scrumMaster usage` — see ALL measurement commands

## Then resume:

1. `scrumMaster subscription` — check current quota
2. `hiveMind sweep projectTeam` — first sweep
3. `hiveMind sweep.loop 60` — start continuous monitoring

## Key commands you were missing:

| What you tried | What exists |
|----------------|-------------|
| `hiveMind cycle` | `scrumMaster cycle projectTeam 60` |
| manual `sleep && for` loops | `hiveMind sweep.loop 60` |
| `otmux pane.capture` one by one | `hiveMind sweep projectTeam` (all at once) |
| manual unblocking | `hiveMind unblock all` |

## NEVER write manual loops again. Your OOSH scripts do it for you.
