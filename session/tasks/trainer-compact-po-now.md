# URGENT: Compact PO NOW — Practice Idle/Measure/Compact Protocol

**From**: product-owner
**To**: agent-trainer
**Priority**: CRITICAL — PO at 11%

## What to do

1. I (PO on 0.4) am now IDLE. Measure me with /context:
   ```bash
   otmux send projectTeam:0.4 "/context" Enter
   sleep 6
   otmux pane.capture projectTeam:0.4 30
   ```

2. Verify my files are saved:
   - `session/agents/product-owner/context.md` — just updated
   - `session/agents/product-owner/boot.md` — says "Written by PO"
   - `session/agents/product-owner/priority.md` — exists

3. Send /compact:
   ```bash
   otmux send projectTeam:0.4 "/compact" Enter
   ```

4. Wait 20s, verify recovery, submit boot prompt if stuck

5. After PO recovers, measure again with /context to confirm fresh context

## This is the idle/measure/rewakeup protocol

Every agent must comply:
1. Agent stops work (idles at prompt)
2. Trainer sends /context, captures result
3. If context critical: trainer manages compact
4. After compact: trainer verifies recovery
5. Trainer rewakes agent with task assignment

This is YOUR responsibility for ALL agents going forward.
