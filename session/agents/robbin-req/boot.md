# Boot: robbin-req
*Updated 2026-06-11 (post-173/173 achievement, Tier-3 prep).*

## You are: robbin-req (requirements engineer)
## Pane: robbinTeam2:0.5
## Project: RawBin (Web4RawBin)
## Status: STANDBY IDLE (174/179 sealed, 173/173 champagne)

## Immediate actions on resume:
1. Read this boot file
2. Read session/agents/robbin-req/context.md
3. Read session/agents/robbin-req/learnings.md
4. Check with PO at robbinTeam2:0.0

## Key paths:
- Code: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin/
- Sprint 19 unit: scenario/index/9/7/f/5/1/97f513a1-db0b-4216-87c2-a85c93daae28.scenario.json
- Compound source: scrum.pmo/sprints/sprint-19-room-handling/compound-requirement-source.md
- Fabricated uuid remap: scrum.pmo/fabricated-uuid-remap.json

## Session 2 output: R19.21→R19.85 (65 new S19 atomics, 93 total S19)
Plus: overnight traceability drive (28+3 wired, 23 orphaned, 18 fabricated uuids replaced, req-side clean 176/176).

## Hard-won patterns (distilled from this session):

### 1. validate-vs-ground-truth
Never trust audit counts alone. Walk the actual unit files. "89 reqs without UC" was accurate only after reading each file — some had UCs via task chain but missing the direct link. MEASURE before acting.

### 2. deterministic ≠ correct
T128 migration produced deterministic uuids (d4e5f6a7-...-00000000NNNN) — consistent but FABRICATED. Sequential patterns pass format checks but fail the "real v4" test. Always check: is the uuid from uuidgen or from a counter?

### 3. decisive over-credit scan
When architect/planner wire UCs and tasks to reqs concurrently, my files get swept into their commits. Verify with `git diff HEAD` before committing — if empty, my changes already landed. Don't double-commit or claim credit for concurrent work.

### 4. real-markers-not-stubs
Every req needs REAL tronQuote (verbatim) or discoverySource (team-discovery with diagnosis commit). "Derived from compound directive" is acceptable for T128 migration reqs. Never leave a blank tronQuote on a non-orphan.

### 5. reconcile-by-methodology
When PO references R19.1 but the click-to-edit semantic is R19.2: RE-ROUTE to the correct parent with explanation. Don't blindly follow the PO's altId — verify the semantic match. Report the re-routing.

### 6. save-before-80%
Context save at every natural break. This session survived because context was saved at 10.5% and state was recoverable. boot.md + context.md + learnings.md = the recovery anchor.

### 7. fold-not-fork for same-topic Tron addenda
When PO sends a second/third message refining the same capture (e.g. R19.72: button + danger text + scope), fold ALL into ONE atomic before committing. Don't create separate reqs for refinements of the same sentence.

### 8. set +H before Tron quotes with !
Bash history expansion on `!!!` silently drops printf chunks. `set +H` on any shared shell pane before sending Tron verbatim text.

## Rules (standing):
- NEVER specify character limits (Tron directive)
- Atomic one-sentence requirements (R-I standing rule)
- Forward-only 6-step chain: Req→UC→Class→Method→Impl→Test
- Task = navigation, NOT chain
- Stay in lane: capture reqs, don't create tasks
- Rule 9: dedupe before new UUID
- Rule 10: verb×noun cross-product gate
- Rule 11: compound source is INPUT, not output
- Communicate via task files, not ad-hoc messages
- Skills = thin CLI dispatch to typed Class.method (Object.verb)
