# Training Pipeline — Details

## The Delegation Chain
1. **PO** directs trainer to add training materials
2. **Trainer** adds Reading Lists to each agent's SKILL.md (7-8 files per list)
3. **Idle agents** read their Reading List, consume docs in order
4. **Trained agents** write context files and check `session/tasks/` for work

## Reading List Contents (typical)
- SKILL.md (own role)
- CLAUDE.md (project conventions)
- agent-overview.md (team structure)
- Architecture docs (oosh-architecture.md, completion-system.md)
- Domain docs (test-suite.md, log-levels-and-testing.md)
- Context schema (how state flows)

## Proof Points
- Expert (0.1): 7/7 files read, context file written — TRAINED (Ch8)
- Tester (0.2): 8/8 files read, context file written — TRAINED (Ch8)
- Pipeline not yet reached: task-agent (1.2), developer (1.3), script-PO (1.4)

## Key Insight
The trainer created the curriculum in the wrong directory (Ch6), but the content was right. Path was fixed, training worked. Content > location.

## Throughput Bottleneck
Pipeline activates only agents that receive the directive. The pattern is proven but someone must send the task. Throughput, not design, is the constraint.

## Action Checklists
-> [train-agent.md](actions/train-agent.md)
