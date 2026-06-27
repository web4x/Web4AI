# Task: finalize robbinTeam2 on WODA.prod → all live, renamed @WODA.prod, under /rc, consistent

**From**: oosh-po@MacStudio  **Owner**: oosh-po@WODA.prod (native, on-box)  **Priority**: HIGH
**Why**: robbinTeam2 migration was interrupted by a rewind before finalization. NOT ready, NOT under /rc.

## Verified current state (2026-06-27)
- 6 robbin JSONLs PRESENT in `~/.claude/projects/-var-dev-Workspaces-AI-Claude/` (foundation good — re-fork works).
- robbinTeam2 has 7 panes (layout drift). Status: 0.1 robbin-planner = bash (DEAD); 0.0 po + 0.6 tester = empty/blank; 0.6 still named @MacStudio; 0.5 req idle (alive); 0.2/0.3/0.4 "unknown" (dev-box monitor noise — verify per pane).
- /rc NOT confirmed on any pane.

## Roles → JSONL UUID (full)
| role | uuid |
|------|------|
| robbin-po | 1751c918-cfba-46f3-98e0-d5605a53ef57 |
| robbin-expert | a2ac40b0-19e8-45ec-aed5-54f4ef081d04 |
| robbin-skill-expert | b6349aee-2309-49a6-ba1c-6bfe9f049761 |
| robbin-architect | be728629-56ad-4ec3-b1c1-eaf5ab255ed1 |
| robbin-req | f839a86b-21df-4f67-a078-88a1138c0b74 |
| robbin-tester | 562b0ce2-88a1-4faa-ab1c-23af55ccffca |

## Recipe (per pane, PDCA — verify each before next; no for-loops)
1. Decide layout: 6 agents → panes 0.0–0.5 (kill the drifted 7th pane, or map cleanly). Title each pane to its role.
2. For each pane that is NOT a live correctly-named Claude: `cd /var/dev/Workspaces/AI/Claude && claudeCode fork <full-uuid>` (FULL uuid; if resume menu → send.raw 2 = full). Skip panes already live+correct (don't churn working agents).
3. `/rename <role>@WODA.prod` (slash → double-Enter). Fixes 0.6 still @MacStudio.
4. `/remote-control` (slash → double-Enter) — capture the /rc URL as proof. EVERY agent under /rc (Tron requirement).
5. `otmux pane.lock <pane> <role>@WODA.prod` + verify pane.get.target + session.name agree.
6. After all 6: `hiveMind consistency.fix robbinTeam2` then `consistency.audit robbinTeam2` → 0 violations.
7. Verify identity-vs-label: team.status customTitles may differ from pane labels (known shift) — consistency.fix reconciles to live session truth.

## Acceptance
- [ ] 6 agents live, each role@WODA.prod, each /rc active (URLs captured), pane-locked
- [ ] consistency.audit robbinTeam2 = 0 violations
- [ ] report-back here + ping oosh-po@MacStudio (I verify)

## Report-back
- oosh-po@WODA.prod:
