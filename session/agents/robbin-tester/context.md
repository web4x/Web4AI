# robbin-tester — context

## Who / where
I am **robbin-tester** at `robbinTeam2:0.5` on WODA.prod. I gate fixes for **Web4RawBin** (live at prod.wo-da.de:4444) with **DET-3x** (deterministic 3-run) verification. Report gate verdicts to `robbinTeam2:0.0` (PO). Node18: `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node`. Gates live in `test/visual/*.mjs` (repo `/var/dev/Workspaces/2cuGitHub/Web4RawBin`).

## Current state (2026-07-01, v0.7.5) — S26 CLOSED, standing by
- Chain scoreboard: **52/309 COMPLETE**. S21–S25 (incl R25.7 4-method dedup) + **S26 federation T26.1–T26.5 all gated GREEN + chain-complete**. Wiring pattern: a req may have multiple UC methods — the scoreboard surfaces the next open hop after each Test wire, so measure after every wire and report the true count.
- prod.wo-da.de:4444 healthy. profiles.json = **4** (3 Marcel + SystemTester). I do NOT edit profiles.json — a server restart flushes uncommitted device tokens by loading clean disk.
- **S26 federation gates (all GREEN DET-3x, ZERO pollution):** T26.1 federated IOR (r259, pure-fn+HTTP), T26.2 federated DnD ref (r260, read-only dragstart), T26.3 fetch API grants (r261, HTTP stateless grants), T26.4+T26.5 Transfer lazy/reconcile (r262, pure class methods). Earlier S25 gates GREEN in r255–r258.
- **Cleanest gate shape (proven all session):** verify against Tron's REAL shipped units READ-ONLY — pure-fn (tsx import) / disk-scan / mounted detail / WS member-read / HTTP-GET-with-stateless-grant; for behavioral fixes use a guard-BLOCKED action (about:blank mints nothing) or CANCEL destructive confirms. No uploads, no deletes, no pollution.
- Legacy on disk (flagged, PO's call): 1 about:blank WebItem + 1 raw-message:-URL WebItem (pre-fix data; fixes prevent NEW ones).
- v0.7.6 task-detail gate GREEN DET-3x (r264): 📄 MD link serves 200 + statusChecklist ☑/☐ hierarchy. Read-only (real /trace graph). FLAGGED derived-404 -> became R27.3, FIXED v0.7.8 (08bd6e55b) + re-gated GREEN r265 (pinned-slug dir, --check byte-match).
- R27.7 v0.7.10 SSRF suite: added 2 architect-found bypass tests (GAP1 ::ffff IPv4-mapped-IPv6-hex, GAP2 DNS-rebind pin) -> proxy-fetch-guard.test.ts 8/8 DET-3x node22 (474671bf0). MEASURE-FIRST caught GAP1 LIVE at v0.7.9 (guardUrl allowed ::ffff:metadata); expert fixed v0.7.10; live prod 403. node22=/opt/node22/bin. R27.7 drawer type-router has NO vitest suite (verify via live component). vitest markers 1b0b7123/8ce68dcc for chain.
- R27.7 COMPLETE (54/317, a5b6cd99c): previewByType marker 3458dd89 + wrote 4 fetchSanitized POST-fetch adversarial tests (12e2f21a never-exec, ec56967a size+timeout, a30f134e content-type, 77d2d547 rate-limit+audit) via in-test mock http origin + vi.spyOn(guardUrl) (mock on loopback = guard blocks by design). proxy suite 12/12 DET-3x node22. + 2 GAP tests earlier. R27.7 security chain CLOSED.
- Idle, wheel ready for the next sprint.

## ⛔ STANDING RULES (never violate)
1. **RULE #126 SCENARIO FIRST, NEVER BACKFILL.** Sprint→Req→Task units + chains wired + MD generated BEFORE code ships. Task without an existing scenario unit → REJECT + report to PO. Never mint units / wire a Test hop to backfill retroactively.
2. **SystemTester ONLY** for prod gates: token `ce981242-74fe-4d44-b5b6-43c641e224df`, name "SystemTester". Seed via `addInitScript` (rawbin-player-id=ce981242, device keys) BEFORE goto. NEVER mint fresh random-token users/rooms.
3. **NEVER create, don't clean-and-hope.** Disk cleanup does NOT stick vs the live server (it re-persists in-memory on activity). In-memory pollution (dangling refs, phantom profiles) clears ONLY on a server restart with clean disk + no activity between. NEVER delete a dropped unit (creates dangling refs). Leave real named test data; verify cleanup-sensitive checks READ-ONLY.
4. **Measure the actual scoreboard / state — don't trust the stated count.** Re-run `chain scoreboard`, grep src for impl markers, count committed-dups not raw-profile-count. Report what's actually there, including hops that aren't mine.

## Key real-data uuids (PROTECT in any purge)
SystemTester ce981242 · Tron primary 8f74dfba (tombstones 3effa1fc/2703628c redirectTo) · dnd test room **3231db71** (JOIN-reusable; System Test Room 68d0f039 is NOT) · existing message WebItem c8dc9d0d · Heartspaces room 6c04f959 · Heartspaces youtube file 2746ab4a · Marcel Room 8be52aa9 · KNOWN phone +4981422917723.

## Tooling
- `npx tsx scripts/objectVerb.ts chain scoreboard|followUp|lintMarkers` — chain measurement.
- Wire a Test hop: mint `ior:class:Test` unit (sourceFile→gate, implementations[impl]) + `// [test:uuid:<u>] <req> <method>` marker in the gate file + push `ior:instance:<test>` to Impl.model.tests[]. Bridge each Test to the gate that VERIFIES its impl.
- Onboarding gates inherently mint a device token per fresh context — minimize iters, check committed-dup-count, let restart flush, never hand-edit profiles.json.
