# robbin-po Learnings — 2026-05-22 to 2026-05-24

Forked from ud-po. All ud-po learnings (1-27) still apply. RawBin-specific learnings below.

## Process & CMM

### 28. RawBin = Fork of QnD Stack (Not Greenfield)
RawBin reuses QnD's TypeScript/PWA/HTTPS/WebSocket/Lit stack. Strip game logic (71%), keep infrastructure. The fork approach preserves all battle-tested patterns.

### 29. Architect Produces Superior Data Model Analysis
When asked to analyze keep/remove/rename, the architect independently proposed splitting profiles.json from devices.json with ownerToken FK — better than PO's flat approach. Always let architect analyze data model first.

### 30. Web4RawBin Repo Pre-Existed
Tron pre-created the repo before PO was spawned. Always check for pre-existing project directories.

### 31. Report to Tron Concisely via otmux
Chunk reports into readable messages — not walls of text. Send: summary, then details in separate sends.

### 32. Tron Answers Quickly
Don't over-wait. Send questions and process answers immediately.

### 33. Room = Shared Workspace (Tron's Vision)
A RawBin room is chat + monitoring + server control. Robbin (AI) joins as member. Not just chat — it's the collaboration surface.

### 34. File-Backed Persistence Required
Rooms MUST persist across restarts. In-memory + file-backed JSON.

### 35. PO NEVER Implements — ALWAYS Delegate (CMM4 VIOLATION)
Tron caught me editing source code directly. That's CMM1. PO writes task files and delegates. Even "quick fixes" go through the team. The fix may be correct but the process is wrong.

### 36. PO Owns Quality — Verify Before Reporting to Tron
I was relaying agent reports without verifying. Expert says "done" → I say "done" → Tron finds it broken. The PO must:
1. Expert implements → tester verifies with VISUAL evidence
2. PO independently verifies (curl endpoints, check source, review screenshots)
3. ONLY THEN report to Tron
Never assume. Never pass through unchecked.

### 37. Version Bump on Every Fix
Without a version bump, PWA update detection has nothing to detect. Users see stale cached code. Every fix = increment patch version.

### 38. PDCA Check Cycle Works — Architect Catches What Others Miss
v0.2.7: Expert added safe-area-inset-top to headers. Tester verified 6/6 PASS. PO verified. BUT architect review caught .update-banner was ALSO behind the notch. Fixed in v0.2.8 BEFORE Tron tested. First time team self-caught a bug.

### 39. Team Achievement: Self-Caught Bug (v0.2.8)
Tron acknowledged: "you as a team self caught that the update bar is below the notch — big achievement in team coordination and delivery." Proves PDCA Check with architect review works.

## Technical

### 40. SW CACHE_NAME Must Be Versioned
Static 'rawbin-v1' never purges old assets. Must be 'rawbin-v{version}' so activate deletes old caches. This caused 3 versions of CSS fix to never reach Tron's iPhone.

### 41. sw.js Must Be Served no-cache
Browser caches old SW if served with max-age. sw.js + manifest.json + app.css all need no-cache, must-revalidate.

### 42. Avatar Crop: Use object-position Not transform:translate
transform:translate displaces image OUT of overflow:hidden container on small circles (24px badge). object-position works naturally within the container at any size.

### 43. Avatar Backfill: Retry + Fallback, Never Empty
thispersondoesnotexist.com fails on thin connections. Must retry 3x with delay, then generate SVG initial as fallback. Avatar field must NEVER be left empty.

### 44. Percentage Crop Coordinates
Crop values from fullscreen overlay (300px) can't be applied as absolute pixels to tiny circles (24px). Store as 0-1 percentages, multiply by container size on render.

### 45. Test Profile Pollution
E2E tests create profiles that accumulate. 222 test profiles polluted the database. Clean up test data periodically.

## Web4Articles CMM3

### 46. Hierarchical Status Checklist (NOT Flat Field)
Web4Articles template uses:
```
## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [x] Done
```
NOT `**Status:** DONE`. The checklist shows workflow history. Task 1 originally had it correct — expert deleted it and replaced with flat format. Took 3 rejections to fix.

### 47. QA Review = Tron's Gate
No task is Done until Tron reviews. PO runs sprint.qa only AFTER Tron approves. The hierarchical checklist has QA Review as a separate unchecked step until Tron signs off.

### 48. CMM4 = PDCA + Measurement
- CMM3 = "Wer schreibt, der bleibt" (who writes, stays) — deterministic, reproducible
- CMM4 = "Wer misst, der weiss" (who measures, knows) — PDCA feedback loops
- Assuming = CMM2. Every "I think" should be a measurement.
- Composed maturity = weakest link. One CMM1 component drags everything down.

## Pane Management

### 49. Never Use Raw tmux — Use OOSH
I used raw tmux split-window to add a pane. It shifted all pane indices, corrupted message routing. Three agents worked on wrong tasks. Always delegate pane operations to oosh team via hiveMind/otmux.

### 50. Planner Pane in New Window
Planner goes in robbinTeam:1.0 (new window), NOT inserted into window 0. Window 0 layout must be preserved: 0.0=PO, 0.1=architect, 0.2=expert, 0.3=tester.

### 51. Use the Planner
PO directs planner to sync changes — don't manually update planning files. Planner maintains consistency, PO maintains direction.
