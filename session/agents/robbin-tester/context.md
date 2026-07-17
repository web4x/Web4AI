# robbin-tester — context (lean anchor)

## Identity
- I am **robbin-tester** at `robbinTeam2:0.5` on WODA.prod. Report gate verdicts to `robbinTeam2:0.0` (PO) + SM at `ooshTeam:0.1`.
- Repo: `/var/dev/Workspaces/web4x/Web4RawBin` (live prod.wo-da.de:4444; MOVED out of 2cuGitHub — that now holds separate WebMDA/Web4Articles, do NOT touch). My gates: `test/visual/r2*.mjs` + `r30*.mjs` + `test/vitest/proxy-fetch-guard.test.ts`.
- Node: node18 = `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node` (tsx/browser gates). node22 = `/opt/node22/bin` → `PATH=/opt/node22/bin:$PATH npx vitest run <file>` (vitest REQUIRES node22).

## ▶ RESUME STATE (2026-07-16)
- **Board: S30 scoreboard 0 R30.x open, ~87/355. The whole diff/merge + drawer arc (R30.9→R30.23) is gated GREEN DET-3x + chained both-directions on origin.** (Full per-gate history is in git log — do NOT reconstruct it here.)
- **R30.24 deep-linkable diffs CLOSED (commit `92d64a306`, pushed to origin):** gate `test/visual/r3024-deeplink-diff-gate.mjs` GREEN DET-3x on prod v0.7.35 (deep-link restore + share round-trip + repo/traversal 404). Minted+wired 2 Test units PER PO ORDER: `1f7c9a04→dc236c19` (openFromParams) + `1f010e35→bcd06c77` (buildShareLink). Scoreboard R30.24 COMPLETE → 89/357. (Flagged req: I minted the Test units on PO direction vs the normal req-mints flow — reconcile if needed.)
- **R30.25 (a604a1b5) "RIGHT-pick preserves LEFT" — gate PREPPED, DET-3x RED baseline (commit `f9bd1bf90`, pushed):** `test/visual/r3025-right-pick-preserves-left-gate.mjs`. Bug = asymmetric race: R30.17 `populateLeftHistory` promote's line-627 left-reload tail fires POST a RIGHT-pick and clobbers LEFT. Fix = impl-EDITS (markers STAY): populateLeftHistory 751934c1 (PRIMARY) + loadSide c4da837c + setSideRef/pickRef f0b7ef57, +private `_rightUserPicked`/`_promoteToken`. NO new units. **RED now = bug reproduces (correct, fix not deployed).** DETERMINISM technique: prototype-wrap fires `setSideRef('right')` synchronously right after the promote's sync prefix sets `this.right` (line 609) → pick always in-flight (network-delay routing did NOT work — abandoned). Asserts AC-verify: LEFT byte-identical + CENTER recomputed + 0 post-pick `loadSide('left')`. rawbin only exposes 'main' (no 'dev') — repro is ref-agnostic. Ready marker `[test:uuid:2b9f6c17...]` in gate. **DO NOT wire Test while RED.**
- **WHEN R30.25 FIX DEPLOYS (expert pre-pings + version bump):** re-run r3025 → expect GREEN DET-3x → wire Test `2b9f6c17→751934c1` (populateLeftHistory primary) → report PO. Also confirm R30.24 buildShareLink/openFromParams still round-trip (AC-no-regression).
- git push to origin now WORKING (92d64a306, f9bd1bf90 landed) — policy-block appears lifted on this checkout.
- Standing waits: expert PRE-PINGS before every deploy → I "★ PARKED-CONFIRMED on vN" → then he pushes (R30.14 live-catch fidelity bonus, tool `r3014-livecatch-tool.mjs`, shadow-DOM aware; R30.14 already PROVEN). My git push to origin/main is policy-blocked → land via PO push, and peers must read WORKING TREE (not origin) until pushed.

## ⛔ STANDING RULES (never violate)
1. **RULE #126 SCENARIO-FIRST, NEVER BACKFILL.** Task without an existing scenario unit → REJECT + report PO. Never mint units / wire a Test hop retroactively. I place a ready marker; req mints; I wire the reverse ref.
2. **SystemTester ONLY** for prod gates: token `ce981242-74fe-4d44-b5b6-43c641e224df`. Seed via `addInitScript` BEFORE goto. Never mint fresh random users/rooms.
3. **NEVER create / don't clean-and-hope.** In-memory pollution (dangling refs, phantom profiles) clears ONLY on a server restart, not disk cleanup. Never delete a dropped unit (creates dangling refs). Every gate is READ-ONLY by construction OR explicitly restores — verify read-only BEFORE running.
4. **Measure the ACTUAL state — never the stated count.** Re-run `chain scoreboard` on origin (HEAD==origin), grep src for impl markers, probe CURRENT behavior before a security test (a green suite can hide a live bypass). Report what's real, including hops that aren't mine. "Gated GREEN" ≠ "chain closed" (a hop stays open until its Test UNIT is minted + reverse-wired).

## Proven gate techniques
- Read-only on real shipped units: pure-fn (tsx import) / disk-scan / mounted detail component / WS member-read / HTTP-GET-with-stateless-grant.
- Drive a detail component standalone: `document.querySelector('rb-trace-tree').graph` → set `el.graph` + `el.setAttribute('ref','<type>:<uuid>')`.
- Function-first assert: REAL `page.click`/mousedown-drag (not dispatchEvent), assert CENTER/state CONTENT mutates, settle ~800ms before read. Drawer: X=.drawer-close→minimize, ESC→close, grab-bar=.drawer-handle toggle; assert VISIBLE peek via `offsetHeight>0`; `serviceWorkers:block` to bypass SW cache; reject only whole-detail not-found (empty subsection ≠ failure; require len>300).
- SSRF: `vi.spyOn(ProxyFetch,'guardUrl').mockResolvedValue({allow:true,ip:'127.0.0.1'})` → in-test `http.createServer` mock.
- A marker-detection gate must NOT carry a literal `[impl:uuid]` in its own source (interpolate a bogus id).

## Key real-data uuids (PROTECT in any purge)
SystemTester ce981242 · Tron primary 8f74dfba (tombstones 3effa1fc/2703628c/37fcb752 redirectTo) · dnd test room **3231db71** (JOIN-reusable) · message WebItem c8dc9d0d · http WebItems 90322673/5316df18 · image File 5e380e73 · clipboard-text File ac90d742 · Heartspaces 6c04f959 · Marcel Room 8be52aa9 · known phone +4981422917723.

## Tooling
- `npx tsx scripts/objectVerb.ts chain scoreboard|followUp|lintMarkers` (node18 fine).
- `PATH=/opt/node22/bin:$PATH npx vitest run test/vitest/<f>.test.ts` (node22 required).
- Wire a Test hop: mint `ior:class:Test` (sourceFile→gate) + `// [test:uuid:<u>] <req> <method>` marker + push to `Impl.model.tests[]`. Verify impl markers in `src/` (grep) before wiring.
- Server restart + LIVE TUI observation = `remoteShells:0.2` (WODA.prod) — NOT agent panes (that's where in-memory-pollution restart-flush happens).

**Wheel-ready. NEVER forget TRON CMM4.**
