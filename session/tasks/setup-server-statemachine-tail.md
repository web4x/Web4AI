# Sprint: SETUP_SERVER install state machine 32→62 — fresh-install completion (dev reliability gap)

**From**: oosh-po (PO decision on u24 gate, Tron framing "macos.latest boots more reliably → path macos.latest→dev")
**Owners**: oosh-architect (compare macos.latest vs dev FIRST — port vs fix) → oosh-expert (targeted fixes) → oosh-tester (verify)
**Priority**: HIGH — blocks u24 gate Step 4/5 (clean boot + team push)
**Status**: OPEN

## Context
u24 fresh-install gate: CORE #6 GREEN (pure-state config 20 exports/0 source on pristine ubuntu:24.04; 5 install bugs fixed: rsync→scp fallback 4397ac2/8a3c02d, mode ssh→root contract, ssh-keygen -N'' hang 99fb694, seccomp=unconfined). BUT `SETUP_SERVER` state machine STALLS at state 32 (`root.dev.keys.installed`), cannot reach 62 (completion). Root `.bashrc` never wired → clean boot blocked → team push blocked. This is exactly the "dev boots less reliably than macos.latest" gap.

## Known bugs in the 32→62 tail (expert surfaced)
- `ERROR Unknown method: config ci`
- `state: line 361: state.declaration: command not found`
- `this.load failed to load ossh from "prereqs.install"`
- `config 2cuGitHub/2cuBitbucket not found`
- ANSI-color leak into a brace pattern: `.ssh/\033[1;31mERROR>.pub` — an `error.log` string captured into `$RESULT` then used as a filename (a result-vs-error contamination bug)

## Strategy — macos.latest → dev (Tron directive)
**Do NOT blind-grind dev bug-by-bug.** macos.latest is the more-reliable reference.

### S-A — oosh-architect (FIRST): compare SETUP_SERVER macos.latest vs dev
- Does macos.latest's SETUP_SERVER define + complete states 32-62? Diff the state declarations + the per-state methods (config ci, state.declaration, prereqs.install) macos.latest vs dev.
- Decide per bug: PORT macos.latest's working version into dev, or FIX dev's (if the bug exists on both / is dev-specific).
- Output an ordered fix list (port-these / fix-these) into report-back. Architect says WHAT; expert implements.

### S-B — oosh-expert (after S-A): apply the ordered fixes
- Port/fix per architect's list. Re-install on u24 after each (~5min/cycle), advance the state machine toward 62.
- The result-vs-error contamination (ANSI leak into filename) is a real `create.result`/`error.log` bug — fix at the source (errors must never land in `$RESULT`).
- Commit each.

### S-C — oosh-tester: verify
- Fresh dev install on u24 reaches state 62, root `.bashrc` wired, clean boot (Step 4 checks) all green.

## Acceptance
- [ ] Architect macos.latest-vs-dev comparison + ordered port/fix list
- [ ] SETUP_SERVER reaches state 62 on fresh u24 install
- [ ] root `.bashrc` wired → clean boot green on u24
- [ ] (then u24 gate Step 5 team.push can proceed)

## Architect S-A comparison + ordered port/fix list (oosh-architect, 2026-06-28)

### Strategic finding — CORRECTS the "macos.latest→dev" premise for THIS tail
Measured dev vs `origin/test/macos.latest`:
- **`oo` SETUP_SERVER state DECLARATIONS are IDENTICAL** on both branches (26 state.add, same 32-62 list) → no declarations to port.
- **macOS STUBS the server tail:** `private.check.root.dev.keys.installed()` → `return 0` (oo:982), `private.check.root.installation.done()` → `return 0`. The 32-62 checks auto-pass on a desktop/dev install — macOS NEVER does the real server work.
- The broken methods are absent on BOTH branches: `config.ci` (none), `state.declaration` (none), `ossh.prereqs.install()` (none on either), and macos.latest doesn't even have dev's newer `init/oosh` prereqs port (0 refs).

**⇒ There is NO working macos.latest version of the 32-62 tail to PORT.** macos.latest is more reliable at the BOOT/config layer (addressed in clean-boot S2), but the SERVER-setup tail is stubbed on macOS, so **dev (ubuntu:24.04 server) is the FIRST real exerciser**. **All 5 bugs = FIX dev. Zero ports.** (For prereqs the port direction is actually dev→macos, not the reverse.)

### ORDERED FIX LIST (dependency-correct — expert implements in this order)

**1. BUG 5 — result-vs-error contamination [FIX, FOUNDATIONAL, FIRST].**
`create.result()` (this:302; sets `RESULT=$1`) + `error.log` (log:203). Error strings (with ANSI `\033[1;31mERROR>`) are leaking into `$RESULT`, then `ossh:424` builds `local file="$RESULT/public_keys/$(ossh.id.file.get).public_key"` → garbage `.pub` path. **Fix at source: error.log output must NEVER populate `$RESULT`; strip/forbid ANSI in create.result; reset `$RESULT` before any path is built from it.** Do FIRST — it silently corrupts filenames feeding BUG 4 + key-gen, and many sites trust RESULT (e.g. `local msg=$RESULT` at state:360).

**2. BUG 3 — `ossh prereqs.install` not loadable [FIX; no macos reference].**
`init/oosh:454` → `"$OOSH_DIR/this" call ossh prereqs.install` → "this.load failed to load ossh from prereqs.install". `ossh.prereqs.install()` is **undefined on both branches**; macos.latest lacks even the init/oosh port. **Define/wire `ossh.prereqs.install()`** (or fix `this.load` so the caller-context arg `prereqs.install` isn't mis-resolved as a script to load). dev's `init/oosh` is the canonical reference here.

**3. BUG 2 — `state.declaration: command not found` [FIX].**
Called bare at state:361 and state:668; **undefined on both branches.** Define `state.declaration()` (render current state declaration) OR replace both bare calls with the existing renderer. Depends on BUG 5 (`local msg=$RESULT` at state:360 must be clean first).

**4. BUG 1 — `Unknown method: config ci` [FIX].**
`this:919` calls `config ci`; config has **no `ci` method on either branch.** In the shared `this` bootstrap path (after init/once symlink). Determine intent: if vestigial → **remove the call**; if real (CI config) → implement minimal `config.ci`. Recommend remove unless expert confirms a purpose.

**5. BUG 4 — `config 2cuGitHub/2cuBitbucket not found` [FIX; depends on BUG 5].**
SEQUENCING: `oo:869/878` clone via the `2cuGitHub:` ssh alias BEFORE `oo:1052-1061` create it. **Reorder so the ssh-config alias is created before any clone/use** (same class as the docker SSH-sequencing fix). Also depends on BUG 5 — `ossh config.create` key paths get contaminated when `$RESULT` carries an error string.

**Verification per cycle:** after each fix, re-install on u24 (~5min) and confirm the state machine advances past the prior stall point toward 62.

## Report-back (edit here)
- Architect (compare + port/fix list): **DONE 2026-06-28** — see above. Verdict: ALL 5 = FIX dev, ZERO ports (macOS stubs the 32-62 server tail → no working reference). Ordered: (5)contamination→(3)prereqs.install→(2)state.declaration→(1)config ci→(4)2cuGitHub sequencing. BUG 5 is foundational (do first).
- Expert (fixes + commits + state reached): **IN PROGRESS.**
  - **BUG 5 (contamination) — FIXED + VERIFIED `2b68265`.** Root mechanism: `error.log`/`important.log` write to `$LOG_DEVICE`; when that's stdout/empty and the call happens inside a `$(...)` substitution (e.g. `$(ossh.id.file.get)` at ossh:424/533), the ANSI error text is captured into the value → garbage path `.ssh/<ESC>ERROR>.pub` + brace_expand crash. Fixes at source: (a) `create.result` (this:319) strips ANSI from `$RESULT` at the single chokepoint; (b) `err.log`+`important.log` coerce empty/stdout `LOG_DEVICE`→`/dev/stderr` so errors NEVER reach fd1. **Re-install verified**: clean `.pub` paths now (`root.v60211.1blu.de.public_key`), no brace_expand crash, no `<ESC>ERROR>` in filenames. Contamination eliminated.
  - **State after BUG5: still 32 `root.dev.keys.installed`** — BUG5 cleared the noise and exposed the TRUE state-32 blockers (were masked by contamination):
    1. **`Unknown method: ossh get.key.name`** at `ossh:533` (`ossh.install.finish.local`): `remoteKeyName=$(ossh.exec $host "ossh get.key.name")` — method is `ossh key.name.get` (`ossh.key.name.get`), call has the words REVERSED. This is the live state-32→33 blocker (key-pull fails → `scp: .ssh/root.<hash>.pub: No such file`). Sibling of BUG 1 (unknown-method class). **NEXT FIX.**
    2. **`state.declaration: command not found`** (state:361/668) = BUG 2 — fires on every transition.
    3. `prereqs.install` (BUG 3) is a non-fatal WARNING (`|| install may still proceed`), not the blocker.
    4. `config 2cuGitHub/2cuBitbucket not found` (BUG 4) = later sequencing.
  - **ALL 5 ARCHITECT BUGS NOW FIXED + a sibling + a 6th (each verified by re-install, errors cleared one by one):**
    - BUG5 contamination `2b68265` ✅ (ANSI strip + log→stderr)
    - **method-name (BUG1-sibling)** `d546947` ✅ — `ossh get.key.name`→`ossh key.name.get` at ossh:533 AND ossh:1513 (method was renamed `ossh.get.key.name`→`ossh.key.name.get` in dev, 2 call sites missed; restore/ copies confirm the rename). Error GONE.
    - BUG2 state.declaration `044dc75` ✅ — defined lightweight `state.declaration()` (current-state render, no vim/cat-whole-file side effects like state.machine.declaration). "command not found" GONE.
    - BUG1 config ci + BUG3 prereqs.install `edbbabc` ✅ — removed vestigial `config ci` (this:927, no such method); defined `ossh.prereqs.install()` (installs rsync+tree via `oo cmd`, non-fatal). Both "Unknown method" errors GONE; 2cuGitHub alias now creates (`SUCCESS> creating config 2cuGitHub`).
    - **BUG6 (NEW, surfaced after the 5)** `376020e` ✅ — `ossh.key.pull:1483` pulled `.ssh/<name>.pub` but ossh stores public keys at `public_keys/<name>.public_key` → `link_stat .../<name>.pub: No such file` blocked the 32→33 key-pull. Fixed: probe+pull the ossh-managed path first, fall back to raw `.pub`.
  - **NEW TACTIC (PO): enumerated ALL state 33→62 setup actions up front, batch-fixed `ffb38c9`** (one re-install to verify). Enumeration: states 33/41/50/51/61/62 = stub `return 0`; 40 `user.shared.dev.folder.linked` = config/oosh symlink (developking created at oo:788, OK); 60 = `once init`. The REAL state-32 setup (oo:~780-944, the big dev-folder install) had 3 fresh-box failures, FATAL one first:
    1. **wget 404 (oo:851-863, FATAL abort)** — KNOWLEDGE RESOLVED (not Tron-escalation): the `developking.ssh` asset **ships IN THE REPO** at `templates/user/developking.ssh` (id_rsa, known_hosts, private_key/, public_keys/ — verified present). The old recursive `wget` from `test.wo-da.de` 404'd on a sub-asset → non-zero → aborted the whole server-setup. **Fixed: copy hermetically from `$OOSH_DIR/templates/user/developking.ssh`** — no external dependency (the repo IS the source of truth). This was THE primary 32-stall (fatal `return` before the rest of setup ran).
    2. **`.ssh/config` not created** when `/root/.ssh` already exists (oo:823 guarded keygen AND config-write together) → split: config-write is now create-if-missing independent of the key (self-care).
    3. **`config.initial/stateMachines` cp** (oo:937) → guarded with `[ -d ]` (self-care, don't abort if absent).
  - **🎯 VERIFY RESULT: STATE MACHINE CHAIN COMPLETE — state=99 `finished` (drove 33→40→41→50→51→60→61→62→99, PAST the 62 target).** Two-part fix got it there: (a) the batch `ffb38c9` cleared the state-32 setup errors (wget/`.ssh-config`/`config.initial`); (b) the REAL structural blocker was the DRIVER — `ossh.install.continue.local` called `state next` exactly ONCE (ossh:502, the `#state next` at 503 was commented out), so only ONE transition fired and the 33→62 tail (~6 transitions) never ran. **Fixed `278d5a7`: loop `state next` to completion** (until terminal `stateLast`/no-progress, guarded cap 40). On re-install the machine ran clean to 99/finished. **Verified on u24**: `~/config`→sharedConfig symlink ✅, `~/oosh`→dev symlink ✅, config pure (20 exports/0 source) ✅. Only a NON-FATAL `oo:1036 once: command not found` at state 60 (`private.check.once.setup.started` calls `once init`; the Web4 ONCE bootstrap isn't on a bare server — machine still reached 99).
  - **⚠️ NEXT BLOCKER for clean-boot (Step 4) — root `.bashrc` NOT wired.** Chain-complete did NOT auto-unblock clean-boot: `env -i bash -lc` on u24 → `OOSH_MODE`/`OOSH_DIR` empty, `oo` not on PATH; root `.bashrc` has ZERO OOSH bootstrap lines (default ubuntu bashrc). Root cause (identified earlier): the installer wires `$SUDO_USER`'s bashrc via `user oosh.install` ONLY when `SUDO_USER`≠root — a DIRECT-ROOT install (our case) skips it, and SETUP_SERVER sets up shared folders + config/oosh symlinks but never installs `bashrcTemplate` into root's home. **This is the one remaining piece for Step 4 clean boot.** Recommend: wire root's `.bashrc` (install `templates/user/bashrcTemplate`) for the direct-root install — either a SETUP_SERVER state or init/oosh's post-install (extend the SUDO_USER block to also handle root). Awaiting PO go / scope.
  - **Total: ~10 bugs fixed.** BUG5 2b68265, method-name d546947, BUG2 044dc75, BUG1+3 edbbabc, BUG6 376020e, 33-62 batch ffb38c9, **driver-loop 278d5a7** (+5 gate install-transport 4397ac2/8a3c02d/99fb694/9a87d34).
  - **State progression**: each fix cleared its error in sequence (get.key.name → state.declaration → config ci/prereqs → .pub-path). After BUG6, ALL the architect-5 + 2-sibling errors are GONE.
  - **STRUCTURAL FINDING — machine now chains cleanly 0→32, stops at state 33 setup (NEW batch, needs architect read).** Mechanism understood: `state.next` (state.js) is SINGLE-STEP (`let state++` + run that state's check); progression chains because each passing check calls the next. `ossh.install.continue.local` calls `state next` once (ossh:502) which kicks the chain. The machine reaches **state 32 `root.dev.keys.installed`** cleanly (states 0-32 all pass), then **state 33 `root.installation.done` SETUP fails** → chain stops. Note: `private.check.root.dev.keys.installed`/`.root.installation.done` are STUBS (`return 0`, oo:981-986) — so advance is gated by the SETUP ACTION, not the check. **Remaining state-33 setup errors** (fresh, not in architect's 5): `wget ERROR 404 Not Found` (a download asset gone); `cat: /root/.ssh/config: No such file` (fresh box has no ssh config yet); `cp: cannot stat 'config.initial/stateMachines/': No such file`. These are the state-33 root-installation setup steps failing on a pristine box. **7 bugs fixed total** (BUG5 2b68265, method-name d546947, BUG2 044dc75, BUG1+BUG3 edbbabc, BUG6 376020e + 5 install-transport from gate). **Recommend**: architect reviews the state-33 setup action (the 404 asset URL + the `.ssh/config`/`config.initial` assumptions that don't hold on a fresh box) — same "fresh-box assumption" class as the gate's 5 install bugs. Expert ready to continue once the state-33 setup steps are scoped, OR to keep going on the 404/.ssh-config/config.initial tail if PO says proceed.
- **PO DECISION (oosh-po, 2026-06-28) — PROCEED, expert-owned, BATCH tactic:**
  Architect S-A already established the strategy (checks are stubs → macOS never exercises the tail → ALL = FIX dev, zero ports). A per-state architect read of state-33 adds a handoff without new info — the verdict for every remaining state is the same class ("fresh-box assumption"). So:
  1. **PROCEED** — expert (proven: 7 bugs fixed cleanly) owns the tail directly. No per-state architect pause.
  2. **CHANGE TACTIC — stop the one-re-install-per-bug grind (~5min each).** The structural finding (advance gated by SETUP ACTION, checks stubbed) means the remaining work is enumerable: **READ the setup actions for states 33→62 up front, enumerate ALL fresh-box assumptions as a batch, fix them together, then ONE re-install to verify the chain reaches 62.** Converts N×5min discovery into one analysis pass + one verify.
  3. **404 dead-asset-URL = EXCEPTION (not fresh-box class).** Don't blind-fix it. It's a knowledge question: what asset/URL should state-33 fetch, or is the step obsolete? Expert investigates; if the correct asset can't be determined from the repo, SURFACE TO TRON (asset location is Tron's knowledge). A wrong-URL "fix" would mask the real question.
  4. Self-care principle applies to the fixes: `.ssh/config`/`config.initial`/`stateMachines` missing = create-if-missing (the setup should establish what it needs, not assume it exists).
- Tester (state 62 + clean boot on u24):
