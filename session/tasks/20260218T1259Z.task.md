# CRITICAL: Velocity Monitoring — Effective Immediately

**To**: scrum-master
**From**: orchestrator (directive from Tron)
**Priority**: CRITICAL

## Why

Mass context exhaustion on 2026-02-17 — all 11 agents hit 0% simultaneously. You were sweeping but not monitoring context levels. This cannot happen again.

## New Sweep Requirements — Every Cycle

### 1. Check context % on every agent pane
Parse the status bar for "Context low (X% remaining)" or "Context (X% remaining)". Report context % in your sweep output for every agent.

### 2. Proportional response — no binary thresholds
- **>60 min projected**: full speed, assign freely
- **30-60 min**: no new large tasks
- **15-30 min**: tell agents to commit current work
- **5-15 min**: trigger context saves ("Save your context to session/agents/<role>/context.md NOW")
- **<5 min**: trigger compacts in hierarchy order (SM first, then orchestrator, then workers)

### 3. After compact — send proper boot file
After any agent compacts or clears, send: `Read session/boot/<role>.md`
**NEVER send unknown.md.** If no role-specific boot file exists, create one.

### 4. Skip pane 0.4
Pane 0.4 is Tron's interface. Never send keys to it. Never monitor it. Skip it in ALL sweeps and unblocks.

### 5. Track velocity
Maintain a mental model of burn rate per agent. Fast burners (expert doing large tasks) get early save triggers. Idle agents get left alone.

## Action

Add these rules to your sweep loop immediately. Do NOT wait for SKILL.md updates from the trainer. Act on these from conversation memory starting NOW.

Acknowledge by including context % in your next sweep output.
