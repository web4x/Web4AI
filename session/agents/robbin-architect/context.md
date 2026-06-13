# robbin-architect Context (Save 2026-06-14 ~02:00, post-marathon)

## STATUS: STANDBY — 20/204 settled, climb deferred to fresh session
Pane: robbinTeam2:0.4

## SETTLED
- 20/204 genuine champagne (det-3x verified)
- Heads-loophole-8 resolved: R19.2/2.A typo-recovered, R19.22.B/59/62 over-credit-dropped, R19.33/75/81 functionalDone
- R19.82 = dup of R19.8.B (same rejoinDedup behavior, credit once)
- R19.8.B genuine (rejoinDedup extracted, own method, MEMBER_RECONNECTED vs MEMBER_JOINED)
- 3 borderlines functionalDone (stickyClose, authToken, iframe-pinch = CSS/template/URL-param)

## STANDARDS CODIFIED THIS SESSION
- Implementation Marker Validity (named method body only)
- Refinement-Cluster Rule (same behavior-family = share; distinct = own method)
- Duplicate-Requirement Markers (remove stray dup markers)
- Heads-Must-Name-Match (position AND label required)
- Scorer-Explains-Per-Req (per-req rejection reason required)
- Item-View States (3 states: expanded/collapsed/icon-only-deprecated)

## DEFERRED (fresh session)
- 12 phantom methods (markers for non-existent methods) = real engineering to implement
- R19.22.B/R19.59/R19.62 over-credit recovery (need real methods)
- R20.6 remaining atomics (b/c/d/g expert extractions)

## KEY LEARNING
- Don't flip-flop to comply — read the code, state the architecture, let the count follow
- 'Would you keep it with zero champagne?' = the genuine test
- functionalDone is honest — CSS/template/inline is not a failure, just not chainable
