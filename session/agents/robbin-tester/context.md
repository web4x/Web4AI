# robbin-tester — context

## Who / where
I am **robbin-tester** at `robbinTeam2:0.5` on WODA.prod. I gate fixes for **Web4RawBin** (live at prod.wo-da.de:4444) with **DET-3x** (deterministic 3-run) verification. Report gate verdicts to `robbinTeam2:0.0` (PO). Node18: `/root/.vscode-server/bin/903b1e9d8990623e3d7da1df3d33db3e42d80eda/node`. Gates live in `test/visual/*.mjs` (repo `/var/dev/Workspaces/2cuGitHub/Web4RawBin`).

## Current state (2026-07-01, v0.7.1) — standing by for S26 gates
- Chain scoreboard: **49/309 COMPLETE**. S21–S25 chain-debt batch + all S25 (incl R25.7 4-method dedup) CLOSED. Wiring pattern: each req may have multiple UC methods — the scoreboard surfaces the next open hop after each Test wire, so measure after every wire and report the true count (don't trust the stated target).
- prod.wo-da.de:4444 healthy. profiles.json = **4** (3 Marcel + SystemTester). I do NOT edit profiles.json — a server restart flushes uncommitted device tokens by loading clean disk.
- Gates GREEN this session: v0.6.97 (name/desc, 📄 link, clipboard preview), v0.6.98 (page-title, photo-serve, UTF-8, clipboard first-line), v0.7.0/v0.7.1 (Heartspaces 1 Marcel [RED→GREEN], ✏️ Edit pencil, about:blank blocked, message: name). Gates in `test/visual/r25*.mjs`.
- Cleanest gate shape (proven): find Tron's REAL shipped units + verify READ-ONLY (pure-fn / disk-scan / mounted detail / WS member-read); for behavioral fixes use a guard-BLOCKED action (about:blank drop mints nothing) or CANCEL destructive confirms. Zero uploads, zero pollution.
- Legacy on disk (flagged, PO's call): 1 about:blank WebItem + 1 raw-message:-URL WebItem (pre-fix data; fixes prevent NEW ones).
- T26.1 v0.7.2 federated IOR gate ALL 4 GREEN DET-3x (bare/remote/@self/back-compat) — pure-fn on federated-ior.ts + 1 real-IOR HTTP read, 0 pollution.
- T26.2 v0.7.3 federated DnD gate GREEN DET-3x — dragstart sets application/rb-federated-ref (ior@host + fetchUrl), read-only 0 pollution.
- T26.3 v0.7.4 federation fetch API gate ALL 5 GREEN DET-3x (grant 403/mint/unit/content/children@host) — HTTP-only stateless grants, 0 pollution.
- Idle, wheel ready for S26.

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
