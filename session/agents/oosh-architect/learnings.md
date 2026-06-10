# oosh-architect Learnings

## MVC Architecture (the foundation)
- claudeCode = Model: session UUID, context %, PID, JSONL. ONE facade to Controller (fork.to). Portable without tmux.
- otmux = View: pane management, capture, send, layout. ZERO references to claudeCode/hiveMind. Prefix uses registry FILE only.
- hiveMind = Controller: orchestrates Models in View panes. Owns ALL state stores (roles/sessions/teams/forks/queue/tronMonitor/active.team).
- tronMonitor = Monitor: Tron's visual interface. Auto-syncs with Controller.
- MVC boundary: claudeCode NEVER calls hiveMind functions — reads registry FILES only.
- View (pane title) can diverge from Model (JSONL customTitle) after /rename — tree.detailed should prefer pane title (live truth) over JSONL (eventual truth).

## Performance Patterns
- Batch caching (intra-call only) beats per-pane subprocess calls: otmux tree 46s→1.5s via 4 fixes:
  A: Batch TTY map (tmux list-panes -aF → associative array, eliminates N × otmux pane.get)
  B: Batch PS map (ps -eo pid,tty,args → tty→pid map, eliminates N × ps scan)
  C: Version cache (claude --version once, reuse for all panes)
  D: Discover cache (hiveMind agents.discover ONCE for whole server, not per session)
- All caches declared at top of function, destroyed on return. No cross-call state.

## State Consistency
- 7 invariants (I1-I7) drive all observable state corruption
- Event dispatch (Option C) + reconcile safety net (Option B) is the right consistency model
- ONE insertion point for cross-cutting concerns (send prefix at send.smart line 1896)
- Cross-host migration is a failure class NOT covered by local event+reconcile (McDonges disaster)
- teams.restore needs: mandatory --all, sessionFilter param, pane-count guard, no silent fallback

## Naming Convention
- Option C (TRON directive): role@hostname EVERYWHERE (pane title + /rename). Option A rejected.
- Registry stays BARE role. role.fromTitle strips @*. 9 write paths, zero read changes.
- HIVEMIND_HOST = hostname -s (cached, 3ms)

## Cross-Platform
- 16 hardcoded paths: /tmp/ (11), /opt/homebrew (3), /Users/Shared/ (2), ~/.ssh/id_rsa (1)
- Fix: ${TMPDIR:-/tmp}/, command -v discovery, detect key type

## Web4 Component Architecture
- npm exports field (ADR-001) eliminates ~50 re-export files
- X.Y.Z.W → X.Y.Z-W version mapping (ADR-002)
- Unit.prod 0.3.0.5 has GitTextIOR, discover/find, sync — missing from 0.3.23.x
- Merge Forward: keep 0.3.23.x UcpComponent, port prod capabilities in

## Units and Traceability (from robbinTeam)
- Scenario = {ior, owner, model}. Everything is a scenario (P1).
- Unit = scenario for file/code. Fields: origin, typeM3, references[].
- 6-step chain LOCKED: Requirement → UseCase → Class → Method → Implementation → Test
- Task = NAVIGATION not chain. ONE UC per Task, ONE Method per UC.
- Champagne = structural + intentional (Test.verifies[]). BOTH required.
- Forward-only. MDAv4: M3/CLASS/, M3/RELATIONSHIP/, M3/FOLDER/.

## PlantUML
- @startuml = path-safe slug. Separate title for display. SVG >10KB = real.
- Layer colors: L3=#F5F5F5, L2=#E8F5E9, L4=#FFF3E0, L5=#FCE4EC
- Commit .puml + .svg together.

## Coordination Rules
- Architect designs, expert implements, tester validates — never reverse
- TRON overrides architect. PO assigns. SM monitors.
- Wait for PO assignment. Never self-assign.
- Expert answers to design Qs are binding for implementation.

## Failures
- Option A was wrong — TRON wanted simpler single convention
- Naming design missed 4 write sites — always grep ALL occurrences
- Don't cd ~/oosh from Bash — use expert-shell via otmux send
- claudeCode fork auto-compacts — wait for ❯ prompt before sending
- OOSH bash blocks pipes (|grep, |head) with EPERM — redirect to file
- Expert may diverge from design — audit shipped code post-impl
- Post-rewind: trust file context.md, not conversation summary
