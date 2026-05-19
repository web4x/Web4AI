# oosh-architect Learnings

## Design Patterns
- JSONL file size is the primary quality signal for fork selection — trained agents have MB, broken recovery attempts have KB (10.5MB vs 15KB proven)
- Event dispatch (Option C) + reconcile safety net (Option B) is the right consistency model for multi-store state
- ONE insertion point for cross-cutting concerns (send prefix at send.smart line 1896) — all paths converge
- tronMonitor.fit is pure math: cols=ceil(sqrt(N)), rows=ceil(N/cols), subtract borders, check MIN_W×MIN_H
- 7 invariants (I1-I7) drive all observable state corruption — everything else is a sub-case

## MVC Architecture
- claudeCode = Model: session UUID, context %, PID, JSONL. Portable without tmux. ONE facade to Controller (fork.to)
- otmux = View: pane management, capture, send, layout. ZERO references to claudeCode/hiveMind source. Prefix uses registry FILE only
- hiveMind = Controller: orchestrate Models in View panes. Owns all state stores (roles/sessions/teams/forks/queue)
- tronMonitor = Monitor: Tron's visual interface. Auto-syncs with Controller

## Coordination Rules
- Architect designs, expert reviews for implementability — never the reverse
- Send implementation specs with: signature, completion, return values, integration points, edge cases
- Always check existing PUMLs before creating new ones — avoid duplication
- Expert answers to design questions are binding for implementation — architect doesn't override

## Failures
- SM can malfunction and spam agents — always check SM health, interrupt with Escape if broken
- dev branch diverges silently — c2 lost .protected. filter, state gained object.verb renames. Compare periodically
