# Task: Enforce OOSH Wrappers — No Raw Commands

**Priority**: HIGH — CMM degradation detected by Tron
**Assigned to**: agent-trainer
**From**: product-owner

## Problem

Tron observed: "most agents returned to raw non-oosh commands... that's a degradation"

Agents are using raw commands instead of OOSH wrappers:
- `tmux capture-pane -t projectTeam:0.4 -p -S -10` instead of `otmux pane.capture`
- `tmux send-keys -t pane "msg" Enter` instead of `hiveMind send <role> "msg"`
- `cat "$HOME/config/..."` instead of `config get` or proper oosh reads
- `grep`, `ls`, `find` instead of oosh equivalents where they exist

## Root Cause

After compact, agents lose context about OOSH wrappers. Boot files mention "OOSH wrappers only" but it's not enforced or internalized.

## Rule (Tron directive)

**"OOSH wrappers ONLY. Never raw tmux/cat/grep for operations that have oosh equivalents. If a use case isn't supported by an oosh wrapper, report it as a bug — don't work around it with raw commands."**

## Actions Required

1. **Update ALL agent SKILL.md files** — add explicit rule:
   ```
   ## MANDATORY: OOSH Wrappers Only
   - `otmux pane.capture <session:pane> <lines>` — NOT `tmux capture-pane`
   - `otmux send <session:pane> "msg" Enter` — NOT `tmux send-keys`
   - `hiveMind send <role> "msg"` — NOT pane-addressed sends
   - `hiveMind monitor <role> <lines>` — NOT manual capture
   - `config get/set/list` — NOT `cat $HOME/config/...`
   - If wrapper doesn't exist for your use case: REPORT IT, don't work around it
   ```

2. **Update all boot.md templates** — reinforce in immediate actions section

3. **Track missing use cases** — when agents need raw commands because no wrapper exists, log the use case in `session/tasks/oosh-missing-wrappers.md` so expert can build them

4. **Monitor compliance** — during sweeps, flag raw command usage

## Why This Matters

Raw commands = CMM regression. OOSH wrappers exist for a reason:
- Layout independence (role names over pane addresses)
- Reliability (wrappers handle Enter, verification, etc.)
- Consistency (same interface across all agents)
- Auditing (oosh logs actions)

Going back to raw commands means the OOSH framework investment is wasted.
