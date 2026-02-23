# KB #27: PO PDCA Operating Model

## Problem
PO operated reactively (CMM2): see problem → fix it → see next → fix it. This meant PO did everyone else's work (training SM, monitoring context, writing specs), which:
1. Burned PO context on non-PO work
2. Prevented other roles from developing capabilities
3. Masked gaps (SM never learned monitoring, so expert burned to 0% unnoticed)

## Solution: PDCA Cycle

PO operates in deliberate PDCA cycles:
- **Plan**: Use plan mode, write plan, get Tron's agreement
- **Do**: Orchestrator executes the plan through the team
- **Check**: SM monitors results, tester verifies code
- **Act**: Orchestrator reports to PO, PO decides next cycle

### Plan approval = velocity control
- No approved plan = no token burn
- PO controls how many agents work by approving/rejecting plans
- All 7 approval criteria must be met (sub-goal, overall goal, KB, communication, PDCA steps, verification, token efficiency)

### Every agent uses plan mode (except SM)
- Agent receives task → enters plan mode → writes sub-plan → gets approval → executes
- SM is exempt (continuous monitoring loop)

## Key Principle
"Compensating for missing roles masks the gap." When PO does SM's work, SM's capability stays at CMM1 and the whole team's monitoring maturity = CMM1 (weakest link). Fix the role, don't work around it.

## Who needs this
- PO: own operating model
- Orchestrator: coordination mandate
- All agents: understand PDCA cycle and plan mode requirement
