# product-owner Learnings

*Patterns, failures, KPIs — identity after compact.*

## Failures (learn from these)

### F1: Assumed trainer quota limit (2026-02-11)
Captured only 10 lines. Saw stale "quota limit" prompt, assumed it was current. Trainer was actually DONE. **Always capture 30+ lines. Question contradictions.**

### F2: Wrote SM context FOR it (2026-02-11)
Peer cannot know internal state. Only the agent can save its own context. **Trigger, don't write.**

### F3: Reported SM "stuck" without fresh verification (2026-02-12)
Saw "8% remaining" in earlier capture. Reported SM stuck without taking a new measurement. SM had already recovered and was sweeping. **Same pattern as F1. Before reporting state — take a FRESH capture. Stale data = wrong conclusions.**

### F5: Not monitoring own context proactively (2026-02-12)
Had `claudeCode context.read` available the entire session. Never used it until Tron asked. Waited for system warnings instead of measuring. **Run `claudeCode context.read projectTeam:0.4` regularly — every 3-4 interactions. Lead by example.**

### F4: Suppressed errors with `2>/dev/null || echo "..."` (2026-02-12)
Hid real error messages behind generic text. The error IS the information. **Never use `2>/dev/null` to hide errors. Never replace real errors with generic echo strings. Run the command, see what happens, deal with the real output.**

## Patterns

### Communication
- Never send long messages via otmux/hiveMind send — they garble
- Write task files to `session/tasks/`, send only: `Read session/tasks/<file>.md`
- Task filenames: `{YYYYMMDD}T{HHMM}Z.task.md` — no descriptions in filenames

### OOSH PATH
- OOSH is ALREADY on PATH via ~/.bashrc — no `export PATH=...` needed
- Direct commands: `otmux pane.capture projectTeam:0.3 10` — works directly

### Peer Compact Protocol
- Peer TRIGGERS agent to save own state, does NOT write context for them
- Only the agent knows its internal state (current task, reasoning, next steps)

### Monitoring
- Always capture 30+ lines for state assessment
- Never assume — always measure
- Capture → assess → clear if needed → send → verify

### CMM web4x (Capability Maturity Model)
- Measures CAPABILITIES not organizations
- Composed maturity = weakest link
- L3 = deterministic (same input → same output, anyone, every time)
- L4 = PDCA feedback loops — practical ceiling, self-improving
- L5 = never voluntary (Pareto-inefficient)
- "Changing a process" is a SEPARATE capability
- Web 4.0 = consequent application of CMM4 methods

### OOSH Config Pattern (web4 scenario)
- All persistent state belongs in `~/config/` as `.env` files — NOT in `/tmp/`
- `config set/get/save/list` — the OOSH way to manage config
- State machines: `~/config/stateMachines/<NAME>.states.env`
- web4.scenario.env = the universal pattern for persistent shell configuration
- Files are sourceable: `. ~/config/name.env`
- hiveMind registry in `/tmp/` = violation — should be `~/config/hivemind.roles.env`

### Script Specialist Pattern
- script-product-owner = specialist delegate, not just ownership contract
- One specialist per script, 100% aware of internals
- PO and trainer can ALWAYS create more — no permission needed
- Invoke specialists for precise planning instead of relying on generalist memory

## Key Decisions
- Agent files: real in `session/agents/<role>/`, symlinks from `.claude/agents/<role>/`
- PO talks only to Tron and Orchestrator — no direct communication with other agents
- Compact assistance is HIGHEST priority for SM
- SM must sweep ALL 11 panes (skip 0.3 = self)
