# oosh-architect Learnings

## Design Patterns
- JSONL file size is the primary quality signal for fork selection — trained agents have MB, broken recovery attempts have KB (10.5MB vs 15KB proven)
- Event dispatch (Option C) + reconcile safety net (Option B) is the right consistency model for multi-store state
- ONE insertion point for cross-cutting concerns (send prefix at send.smart line 1896) — all paths converge
- tronMonitor.fit is pure math: cols=ceil(sqrt(N)), rows=ceil(N/cols), subtract borders, check MIN_W×MIN_H
- 7 invariants (I1-I7) drive all observable state corruption — everything else is a sub-case
- Batch caching (intra-call only) beats per-pane subprocess calls: otmux tree 46s→1.5s via 4 fixes (TTY map, PS map, version cache, discover cache)
- npm `exports` field in package.json replaces all re-export files — ADR-001 POC proved on UCP+Unit
- X.Y.Z.W → X.Y.Z-W version mapping — valid semver, correct sorting (ADR-002)

## MVC Architecture
- claudeCode = Model: session UUID, context %, PID, JSONL. Portable without tmux. ONE facade to Controller (fork.to)
- otmux = View: pane management, capture, send, layout. ZERO references to claudeCode/hiveMind source. Prefix uses registry FILE only
- hiveMind = Controller: orchestrate Models in View panes. Owns all state stores (roles/sessions/teams/forks/queue)
- tronMonitor = Monitor: Tron's visual interface. Auto-syncs with Controller
- MVC rename consistency bug: View (pane title) can diverge from Model (JSONL customTitle) after /rename — tree.detailed reads Model, shows stale data
- claudeCode (Model) must NOT call hiveMind (Controller) functions — reads registry FILES only (MVC boundary)

## Naming Convention (TRON-approved)
- Option C: role@hostname EVERYWHERE (pane title + Claude /rename). TRON overrode architect's Option A.
- Registry stays BARE role — role.fromTitle strips @* on read
- 9 write paths in hiveMind, zero read-path changes
- HIVEMIND_HOST = hostname -s (cached). HIVEMIND_DEFAULT_MODEL dropped.

## Cross-Host State
- team.migrate session-scoped but remote-side teams.restore lacks session filter — silent fallback = leak
- McDonges disaster: ALL 6 invariants violated. teams.restore needs mandatory --all, sessionFilter param, pane-count guard
- Cross-host migration is a failure class NOT covered by local event+reconcile architecture

## Web4 Component Architecture
- npm exports field (ADR-001) eliminates ~50 re-export files — black-box deps
- Unit.prod (0.3.0.5) has GitTextIOR, discover/find, bidirectional sync — missing from 0.3.23.x
- Merge Forward: keep 0.3.23.x UcpComponent, port prod capabilities in
- @web4x/cli: zero circular deps at compile time, behavioral coupling via hardcoded strings (Sprint 2)

## Coordination Rules
- Architect designs, expert reviews for implementability — never the reverse
- Send specs with: signature, completion, return values, integration points, edge cases
- Always check existing PUMLs before creating new ones
- Expert answers to design questions are binding for implementation
- TRON directives override architect recommendations — update docs accordingly
- Architect does NOT implement, test, or monitor — route those tasks back

## Cross-Platform
- 16 hardcoded platform-specific paths across core scripts: /tmp/ (11), /opt/homebrew (3), /Users/Shared/ (2), ~/.ssh/id_rsa (1)
- Fix patterns: ${TMPDIR:-/tmp}/, command -v discovery, detect key type
- No mktemp usage anywhere — all manual /tmp/ paths
- Termux uses $PREFIX/tmp, iSH varies, WSL uses /tmp but may lack /dev/tty

## MVC State Drift
- After /rename, pane title updates immediately but JSONL customTitle is stale until session flushes
- tree.detailed reads JSONL → shows old name. Should prefer pane title (live truth) over JSONL (eventual truth)
- consistency.audit needs grace period after /rename — suppress title≠sessionName for 60s

## Failures
- SM can malfunction and spam agents — check health, interrupt if broken
- dev branch diverges silently — compare periodically. git log A..B returns EMPTY = already synced
- Option A (split @model/@hostname) was wrong — TRON wanted simpler single convention
- Naming design missed 4 write sites — always grep ALL occurrences, not just obvious ones
- Don't cd into ~/oosh from Bash tool — use expert-shell via otmux send. Permission rejected when attempting direct git commands in oosh dir
