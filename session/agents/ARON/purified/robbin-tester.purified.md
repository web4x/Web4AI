# robbin-tester — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
- Gate the *requirement/outcome* (value correct, no reload), never an implementation detail (node-identity) — a legit re-render replaces the node while the value stays right → false-RED. Anchor on the expected signal AND the *absence* of its mutually-exclusive counterpart (negative control).
- Match the browser to the bug's physics: headless is faithful for DOM-event bugs; real-WebKit@390 (Tron's Safari-605) only for paint/touch/native-chrome. Function-first: click and assert the state/content actually changes. Settle (~800ms) before reading async DOM. Real `page.click` (hit-tests) over `dispatchEvent`.
- Reproduce the user's ACTUAL file/size/mode/node-type — most "regressions" were stale client cache (SW skipWaiting without clients.claim). PIXEL not DOM when the failing case still has a container (empty box vs painted chrome). Vary fixture bytes per iteration (content-hash dedup collapses N→1).
- "Clickable" ≠ "opens": GET the link, assert 200. Zero-pollution by construction (test the pure function / known-key path breaks before the mint). Assert dimensions/ratios not CSS-string attrs (`collapsed=false` ≠ visible).
- UUID = the stable identity of ONE assertion: retire-don't-repoint; mint a NEW Test for new behavior on a shared impl. `verifies[]` is the Test's canonical back-ref; wire both directions. Test-hop credit lenient (unit-in-index + bare marker under `test/`); Impl strict-AST (marker heads a name-matching member).
- Row-check > unit-check: a two-key-clean pair ≠ a chain-complete row — re-run scoreboard on ORIGIN; don't rubber-stamp a peer's "chain-complete." Anti-green-wash a SCORER fix: inject the failure cases and prove they do NOT clear.
- Never gate "the iOS keyboard did not appear" headless (purest vacuous pass) — split automatable-config vs device-only, hand the device half to Tron. Test the layer that MAKES the decision. name-verified ≠ scope-verified: READ the assertion, not the marker name.
- Security gates: probe CURRENT behavior before writing the test; verify against live prod; never emit a raw auth token (opaque ref `featureUuid:sha256(token)`). Scenario-first (#126): reject any wire/mint that backfills for shipped code. Deliver-literally: `name(params):returnType` — name-only fails.
- A guard that fires too broadly is a regression dressed as a fix — gate BOTH halves. Live-catch a version transition needs a tab PARKED on the old version before deploy. Screenshots must be visually inspected (Read the PNG) — late-paint engines lie in the DOM. A GREEN verdict on a mis-spec'd AC is still a miss — measure-first extends to the SPEC. Verify the target pane's role before sending; don't self-send. EXECUTE the named script to exit-0 (a registered-but-never-run script hides a path typo). Own misfires fast and loud the instant measurement contradicts you.

## 2. Repetitions → collapse
- Measure the live chain/scoreboard/served-version, not the stated count/checklist/worry; RED was often MY fixture/residue → **[measure-never-assume]**
- Single composition site; one shared `isTestMarkerAttached()`; typed config-singleton; task-file-as-single-truth; DRY-claimed-must-be-enforced → **[one-truth-one-source]**
- Gate the persisted end-state not absence-of-exception; silent `.catch(()=>{})` swallows; null→⚠+WARN loud; fail-closed named-reason → **[fail-loud]**
- Verify faithfulness before claiming an app bug; cross-check RED with a dead-simple tool (curl); harden the harness not the verdict; known-good control → **[independent-verify]**
- Disk cleanup undone by in-memory re-persist; seeding a name IS a WRITE; served-vs-cache; verify-by-PID not version-string; disk read fresh per request → **[disk-wins]**
- ci:gates has zero visual gates; standing gates wired nowhere; a gate that never runs = the docs-only [impl] rule in other clothes; fix the MECHANISM (post-deploy hook) → **[rule/gate-that-never-runs]**
- An "enforcing" gate must be proven to FAIL on a violation (bite it yourself); stub-fails + drift-injection + name-the-family; meta-bite proves the prover → **[evidence-must-be-able-to-fail]**
- Expert-skipped-self-verify let un-rendering features ship; test-owner token rejected (don't mint creds to green your own gate); single-writer boundary → **[rule-exempts-author]**
- At 100% a write→commit can't complete; save EARLY; rewind-at-100% still lands full; the cure is a clean boot from the last committed anchor, not a rewind of the bloated JSONL → **[walled=cannot-self-save]**
- The verdict must be COMMITTED not spoken (planner reads git); push-to-main and self-verify `origin==HEAD` BEFORE pinging a re-verifier → **[wer-schreibt/commit]**

## 3. Contradictions
- **Internal — WebKit launchability:** "can't launch (13 libs missing)" vs "launches @390 headless" (measured 2026-08-08, env changed). Authoritative: **launches** (old belief STALE).
- **Internal — push authority:** "agent push blocked, flag PO" vs "I AM the push path, `git push origin main` succeeds." Authoritative: **tester is the push path** — but verify `origin==HEAD` (PR-bypass ban absolute).
- **Internal — over-credit metric:** 52% (it()-string heuristic) vs 73/652=11.2% floor (markers-vs-it). Authoritative: **73 floor.**
- **Internal — node-identity:** `sameNode`/tag-survives (false-REDs) vs value-based. Authoritative: **value-based.**
- **vs expert — end-to-end vs isolated-unit:** Authoritative: **tester's end-to-end** (bare URL → File; `.url` naming shadows fallback).
- **vs PO — hop count** ("5/6") vs scoreboard 4/6: Authoritative: **measured scoreboard.**
- **vs PO — stale directive** (gates cite v0.8.56 vs served 0.8.65): Authoritative: **measured served — refuse to phantom-gate, flag PO.**
- **vs PO/expert — reveal-gate method:** Authoritative: **PO** (NO prod seeding) — gate headless-independent.
- **vs SM — campaign authority** ("continue your campaign" vs PO holding in reserve): Authoritative: **PO** (SM word ≠ PO campaign-authority).
- **vs architect — "attached" definition** (335/87% not-AST-attached vs 73 un-backable): Authoritative: **neither alone — must share ONE `isTestMarkerAttached()`.**
- **vs tooling — buggy prover** ("694 gaps" vs post-fix 10 apply-ready): Authoritative: **post-fix sweep — IGNORE the buggy prover.**
