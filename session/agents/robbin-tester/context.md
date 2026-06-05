# robbin-tester Context — 2026-06-05

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.86** | Suite: **836/836 vitest + 8/8 E2E**
- Scenario: 486+ units, 505 objects in /api/trace, 44/44 tests 7-hop reachable

## SESSION — Latest verified (2026-06-05)

- **T178 KEYSTONE** ✓ 44/44 tests 7-hop reachable from Req roots. 7-level API lazy-load walk confirmed.
- **T184** ✓ (v0.5.85) forward-only API emit — 0 backward keys in /api/trace (505 objects)
- **T185** ✓ s17-architecture.puml — 14/14 class + 38/38 method exact index match, 0 orphans
- **T181** ✓ forward-only display — DetailViews + tree show NO backward links
- **T182** ✓ all 8 DetailViews have 📄 Scenario view → /scenario?ior=, all 7 types → 200
- **T180 Track 2** ✓ CDP cert-accept → SW registers headless (4/4 E2E proof)
- **T179** ✓ FULLY CLOSED (v0.5.86) — SW activation 4/4 E2E: register+activate, cache serve, passive activation, zero app.js 404
- **T177** ✓ /scenario?ior= resolves all 3 forms (bare/ior:instance/uuid.scenario.json)
- **Tree lazy-load** ✓ (v0.5.84) 7-level deep expand in actual tree UI
- **T183** spec committed (7-hop CI gate — tester-authored, expert implements)

### Headless SSL solution
`--ignore-certificate-errors` browser arg OR CDP `Security.setIgnoreCertificateErrors` — both work. Context-level `ignoreHTTPSErrors` alone covers page+XHR+WS but NOT ES module fetches.

## S17 Status
Dev complete except T180 Track 1 (Tron certbot) + T129 gate.

## Rules (Eternal)
- CMM4: task files = single source of truth
- GREP-VERIFY code present, then behavioral test
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE
