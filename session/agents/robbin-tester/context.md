# robbin-tester — context

## ▶ RESUME STATE (rewind-safe, 2026-07-02)
- **Identity/pane:** I am **robbin-tester** at `robbinTeam2:0.5` on WODA.prod. Report gate verdicts to `robbinTeam2:0.0` (PO) and SM at `ooshTeam:0.1`.
- **Repo (RELOCATED 2026-07-02):** `/var/dev/Workspaces/web4x/Web4RawBin` — MOVED out of 2cuGitHub (which now holds the SEPARATE WebMDA + Web4Articles repos — do NOT touch those). Same repo, all my commits intact, scoreboard 55/318. (Web4RawBin, live prod.wo-da.de:4444). My gates: `test/visual/r2*.mjs` (15 files, r211–r265) + `test/vitest/proxy-fetch-guard.test.ts`.
- **Node:** node18 = `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node` (tsx/browser gates). **node22 = `/opt/node22/bin` (use `PATH=/opt/node22/bin:$PATH npx vitest run <file>` for vitest — required; node18 lacks it).**
- **DONE:** R27.7 security chain CLOSED (scoreboard **55/317**, v0.7.10, commit a5b6cd99c). Everything S21–S27-so-far gated GREEN.
- **R27.1** statusChecklist DONE (wired dc94cff0->31f420b0 -> 55/317; r264 GREEN). **R27.3** per-task-MD: behavior GREEN (r265) but chain OPEN at architect (UC missing, #126 gap — code shipped v0.7.8 before chain built); I wire the Test hop when the impl marker lands.
- **NEXT:** S27 dispatch pending — incl the TUI-fix gate = S29 R29.1 self-healing npm start preserving the interactive server TUI (already shipped 9b97021dd, retroactive #126 chain in progress; architect 166ca2be4) (restart via remoteShells:0.2 WODA.prod + observe the LIVE TUI there, not an agent pane — Tron directive). When a task arrives: RULE #126 first (does the scenario unit exist? if not → REJECT + report). Then gate DET-3x, prefer read-only on real units, report to PO.
- **Tests I own (R27.7):** `proxy-fetch-guard.test.ts` = 12 tests (5 guardUrl SSRF + sanitizeHtml + 2 GAP bypass [1b0b7123 ::ffff-hex, 8ce68dcc rebind-pin] + 4 fetchSanitized [12e2f21a/ec56967a/a30f134e/77d2d547]). 12/12 DET-3x node22. previewByType marker 3458dd89 in r252.
- **Wheel-ready after rewind.**

## Current state (v0.7.10)
- Chain scoreboard: **55/317 COMPLETE**. S21–S25 + S26 federation (T26.1–T26.5) + R25.7 (4-method dedup) + R27.x all chain-complete.
- prod healthy. profiles.json = **5** (4 real [3 Marcel + SystemTester] + 1 stray device token — NOT my mint; token-less proxy tests don't mint; a server restart flushes it). I do NOT edit profiles.json.
- **Session gates all GREEN DET-3x, near-zero pollution:** S25 (r255–r258), S26 federation (r259 IOR / r260 DnD-ref / r261 fetch-API-grants / r262 Transfer / r263 e2e-import), v0.7.6 task-detail (r264), v0.7.8 R27.3 per-task-MD (r265), R27.7 proxy suite (vitest).
- **Loop I closed this session:** flagged derived-404 in v0.7.6 → became R27.3 → expert fixed v0.7.8 → I re-gated GREEN. And measure-first caught a LIVE ::ffff cloud-metadata SSRF bypass at v0.7.9 → expert fixed v0.7.10 → my 2 GAP tests lock it forever.
- Legacy on disk (flagged, PO's call): 1 about:blank WebItem + 1 raw-message:-URL WebItem (pre-fix data).

## ⛔ STANDING RULES (never violate)
1. **RULE #126 SCENARIO FIRST, NEVER BACKFILL.** Sprint→Req→Task units + chains wired + MD generated BEFORE code ships. Task without an existing scenario unit → REJECT + report to PO. Never mint units / wire a Test hop to backfill retroactively.
2. **SystemTester ONLY** for prod gates: token `ce981242-74fe-4d44-b5b6-43c641e224df`. Seed via `addInitScript` (rawbin-player-id=ce981242, device keys) BEFORE goto. NEVER mint fresh random-token users/rooms.
3. **NEVER create, don't clean-and-hope.** Disk cleanup does NOT stick vs the live server (re-persists in-memory on activity). In-memory pollution (dangling refs, phantom profiles) clears ONLY on a server restart. NEVER delete a dropped unit (creates dangling refs). Leave real named test data; verify cleanup-sensitive checks READ-ONLY.
4. **Measure the actual state — don't trust the stated count.** Re-run `chain scoreboard`, grep src for impl markers, count committed-dups not raw-profile-count, probe the CURRENT behavior before writing a security test (a green suite can hide a live bypass). Report what's actually there, including hops that aren't mine.

## Clean-gate techniques (proven)
- **Read-only on Tron's REAL shipped units:** pure-fn (tsx import) / disk-scan / mounted detail component / WS member-read / HTTP-GET-with-stateless-grant.
- **Behavioral fixes without pollution:** guard-BLOCKED action (about:blank / SSRF loopback mints nothing) or CANCEL destructive confirms.
- **Drive a detail component standalone:** grab `document.querySelector('rb-trace-tree').graph` → set `el.graph` + `el.setAttribute('ref','<type>:<uuid>')` (rb-task-detail needs the graph; rb-webitem/file-detail take `uuid`).
- **Test server-side fetch behind an SSRF guard:** `vi.spyOn(ProxyFetch,'guardUrl').mockResolvedValue({allow:true,ip:'127.0.0.1'})` → point `fetchSanitized` at an in-test `http.createServer` mock (loopback is guard-blocked by design).
- **In-test mock origin** serves script/oversized(>5MB)/slow(hang→8s timeout)/bad-content-type bodies.

## Key real-data uuids (PROTECT in any purge)
SystemTester ce981242 · Tron primary 8f74dfba (tombstones 3effa1fc/2703628c/37fcb752 redirectTo) · dnd test room **3231db71** (JOIN-reusable; System Test Room 68d0f039 is NOT) · message WebItem c8dc9d0d · http WebItems 90322673/5316df18 · image File 5e380e73 · clipboard-text File ac90d742 · Heartspaces room 6c04f959 · Marcel Room 8be52aa9 · KNOWN phone +4981422917723.

## Tooling
- `npx tsx scripts/objectVerb.ts chain scoreboard|followUp|lintMarkers` — chain measurement (node18 fine).
- `PATH=/opt/node22/bin:$PATH npx vitest run test/vitest/<f>.test.ts` — vitest (node22 required).
- Wire a Test hop: mint `ior:class:Test` unit (sourceFile→gate) + `// [test:uuid:<u>] <req> <method>` marker in the test file + push `ior:instance:<test>` to Impl.model.tests[]. Bridge each Test to the gate that VERIFIES its impl. Verify impl markers are in `src/` (grep) before wiring — measure, don't trust the stated hop count.
- **Server restarts + live TUI observation = remoteShells session** (NOT agent panes): remoteShells:0.2 = WODA.prod (npm), remoteShells:0.3 = WODA.test. Restart there + watch the live TUI in remoteShells:0.2. (Where the in-memory-pollution restart-flush actually happens.)
- SSRF proxy: `/api/proxy?url=` (403 blocked / 200 external); guard = `ProxyFetch.guardUrl` (proxy-fetch.ts), rate-limit fedRateOk 30/60s.
