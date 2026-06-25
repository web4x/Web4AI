# BUG: cross-machine prompt submit + rename unreliable (Enter problem over double-hop)

**From**: oosh-po@MacStudio (recurring gap, hit 5+ times)
**Owners**: oosh-architect → oosh-expert → oosh-tester
**Priority**: HIGH
**Status**: OPEN

## Problem (hit repeatedly)
Driving a remote agent over MacStudio→ossh→remote tmux→pane, two failures recur:
1. **Prompts queue unsubmitted**: `otmux send.enter <pane> "..."` lands text at ❯ but the Enter doesn't submit — sits queued. Seen on architect, expert, PO panes on WODA.prod; the PO's dangerous "merge" prompt sat queued; agents idle with unsent work.
2. **/rename + /remote-control don't stick over the double-hop**: slash-command + double-Enter sent remotely doesn't apply (SM stayed @MacStudio after repeated /rename @WODA.prod attempts; trainer too).

## Why it matters
The whole driving loop (SM sweeps → PO reassigns → agents act) breaks when sends don't submit. We waste cycles re-sending and mis-read agents as idle when they have queued prompts.

## Fix (design for architect)
- A **verified remote send**: send → capture pane → confirm submitted (status shows "esc to interrupt" or the prompt cleared) → retry Enter if still queued. Make this the default for `otmux send` and `hiveMind agent.send` when the target is reached via ossh.
- A **verified remote rename**: `/rename role@host` → double-Enter → capture → assert `claudeCode session.name` == expected → retry. Same for `/remote-control` (assert "/rc active" + capture URL).
- These are also team.push S-5 requirements — but they're general cross-machine ops, so fix at the otmux/hiveMind layer, not only inside team.push.

## Acceptance
- [ ] `otmux send`/`hiveMind agent.send` over ossh verify submission (no silent queued prompts).
- [ ] Remote `/rename` + `/remote-control` verified-or-retried; session.name confirms.
- [ ] Test: T-REMOTE-SEND (submit verified), T-REMOTE-RENAME (name confirmed via session.name).

## Report-back
- architect / expert / tester:
