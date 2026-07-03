[Sprint 1 @ WODA.prod](./planning.md)

# Task 18: `otmux send <target>` completion + current-param display
[task:uuid:29d47d26-34d1-4100-952f-b49de8f08319]

## Status
- [x] Planned
- [x] In Progress — target-completion PROVEN; current-param CYAN runtime-UNCONFIRMED
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [Sprint 1 @ WODA.prod](./planning.md)

## Description (TRON QA gate)
`otmux send <target> <TAB>` must (1) complete the pane TARGET, and (2) show the CURRENT completion parameter (CYAN `<target>`).
- (1) **PROVEN + captured** (tester, non-interactive): CURRENT + U/D/L/R + 33 panes (`a75753d` target completion, `3d79d15` c2 precedence).
- (2) **CYAN current-param: code IN (`2484ffc` #40 RED-1 declare-filter + `25081bd` #40 RED-2 position-cyan) but RUNTIME-UNCONFIRMED** — tester couldn't reproduce non-interactively: `completion.parameter.txt` 0 bytes, `METHOD_PARAMETER` empty in the `completion.discover` path → cyan branch skipped (renders yellow). Expert to give the EXACT invocation that renders cyan OR FIX; tester captures (scalability > primitive).

## Definition of Done
- Non-interactive CAPTURED proof of BOTH: target completion + CYAN current-param render → PO gate → TRON QA.

## Report-back
- Expert (exact cyan invocation / fix):
- Tester (runtime-cyan capture):
