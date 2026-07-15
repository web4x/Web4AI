# Task: `odocker start` — self-care to ensure the Docker hypervisor is running

**Ordered by:** oosh-init@13mi (relaying TRON) · **Owner:** oosh-expert (impl) + oosh-tester (T) · **Gate:** oosh-po@13mi → TRON
**Mode/host:** mcdonges.latest @ 13mi · **Script:** `odocker`

## Traceability
- up: TRON directive 2026-07-15 — "add to `odocker start` to start the hypervisor"
- down: `odocker.start()` impl + `test/test.odocker` T-ODOCKER-START

## Measured local system truth (13mi, 2026-07-15)
- `docker context ls`: active context = **`desktop-linux`** → endpoint `unix:///home/mdonges/.docker/desktop/docker.sock`; `default` → `unix:///var/run/docker.sock`.
- `docker info` on the active context **FAILS**: "Cannot connect to the Docker daemon at unix:///home/mdonges/.docker/desktop/docker.sock. Is the docker daemon running?"
- **The hypervisor = Docker Desktop backend** (runs the docker engine inside a VM via KVM/qemu). Service: `docker-desktop.service` — user unit at `/usr/lib/systemd/user/docker-desktop.service`, currently **inactive (dead)** and **disabled**.
- Start command (verified path): **`systemctl --user start docker-desktop`** → boots the hypervisor/VM; the desktop socket then appears.
- Note: system `dockerd` (`docker.service`, context `default`) IS running, but the CLI's active context is `desktop-linux`, so it's not reached.

## Current code (the gap)
```bash
odocker.start()          # odocker:683
{
  this.start "$@"        # OOSH constructor only — does NOT ensure the docker engine/hypervisor
}
```

## First-principles framing
`scriptname.start()` is the **constructor** — it must yield a *fully-operational* object. For `odocker`, "fully operational" means **the docker engine is reachable**. So `odocker start` must self-care: detect a dead daemon and bring the hypervisor up. Idempotent (already-up → no-op), never-silently-broken (dead daemon → never return 0), resolve the socket/context from `docker context` truth (never a guessed path).

## Spec / acceptance criteria
1. `odocker start` keeps calling `this.start "$@"` (constructor), then ensures engine reachability.
2. **Detect** reachability via `docker info` (or a socket probe on the active context's endpoint).
3. If reachable → **no-op**, rc 0 (idempotent).
4. If **not** reachable:
   - active context = `desktop-linux` → `systemctl --user start docker-desktop`, then **wait (bounded)** for the endpoint socket / `docker info` to succeed, then **re-verify**.
   - (optional/secondary) active context = `default` and `/var/run/docker.sock` dead → `systemctl start docker` (root/sudo-gated; degrade gracefully if not permitted).
5. **Fail loud** with an actionable message if it cannot bring the engine up — **never rc 0 on a dead daemon**.
6. No hardcoded socket paths — read the active context/endpoint from `docker context`.

## Test (oosh-tester) — T-ODOCKER-START
- From dead hypervisor (`systemctl --user stop docker-desktop`) → `odocker start` → `docker info` succeeds, rc 0.
- From already-up → `odocker start` → no-op, rc 0, fast.
- Simulated unrecoverable → `odocker start` → non-zero rc + clear error (never silent success).

## QA workflow
predict → expert impl → tester captures proof → oosh-po@13mi gate → TRON acceptance → Done.

---

## Expert impl report (oosh-expert, 2026-07-15)
**Status:** IMPL DONE — awaiting tester live proof (T-ODOCKER-START).
**Commit:** `e803d8d` @ `test/mcdonges.latest` (`/home/mdonges/oosh/odocker`).

### What landed
`odocker.start` now self-cares via `private.odocker.ensureEngine`, meeting all 6 acceptance criteria:
1. Still calls `this.start "$@"`; ensures reachability first (on real construction only — skipped when sourced + for `help`/`usage`/`completion` so the tool stays usable when docker is down).
2. Reachability = `docker info` (answers on the active context).
3. Reachable → no-op, rc0 (idempotent).
4. Unreachable → by ACTIVE context (`docker context show`): `desktop-linux` → `systemctl --user start docker-desktop` → bounded wait (`waitReachable`, 90s) → re-verify; `default` → sudo-gated `systemctl start docker` (degrades gracefully); else → fail loud.
5. Fail-loud, actionable message; **never rc0 on a dead daemon**.
6. **No hardcoded socket** — context/endpoint read from `docker context` truth.

New privates: `activeContext`, `engineReachable`, `waitReachable`, `ensureEngine`.

### Expert verification (measured — NO VM boot; live boot is the tester's proof)
- `bash -n` clean.
- `private.odocker.activeContext` → `desktop-linux`; `private.odocker.engineReachable` → rc1 (dead) correctly detected.
- `odocker help` → skips self-heal (fast, hypervisor stayed `inactive`) — confirms the introspection-skip path.
- I deliberately did **not** boot the hypervisor (heavy VM start + system mutation) — that live proof belongs to the tester per this QA workflow.

### Tester (T-ODOCKER-START) — please capture proof
1. **dead → up**: `systemctl --user stop docker-desktop`; then any real `odocker <cmd>` (or a direct `private.odocker.ensureEngine` call) → `docker info` rc0, engine reachable, rc0.
2. **already-up → no-op**: run again → fast no-op, rc0 (no second boot).
3. **unrecoverable → fail-loud**: simulate (e.g. mask the unit or point to a bogus context) → non-zero rc + clear error, never silent success.
Capture pane output as proof; report to oosh-po@13mi for the gate.

---

## Tester live proof (oosh-tester, 2026-07-15) — T-ODOCKER-START: **PASS 3/3**

**Host:** 13mi, `test/mcdonges.latest` @ e803d8d. Real hypervisor boot performed (Docker Desktop VM).
**Pre-state (measured):** hypervisor `inactive`, active context `desktop-linux`, `docker info` unreachable.

| Scenario | How | Result | Evidence |
|----------|-----|--------|----------|
| **3. unrecoverable → fail-loud** | `DOCKER_CONTEXT=nosuch-bogus odocker ps` (context truth = bogus; hypervisor untouched) | **rc=1** ✓ | `ERROR> odocker.start: engine unreachable on context 'nosuch-bogus' — no known hypervisor start path; start the daemon manually`. Never rc0. Zero side-effects: context still `desktop-linux`, hypervisor still `inactive`. |
| **1. dead → up** | `odocker ps` (real user path → ensureEngine) | **rc=0 in 14s** ✓ | `IMPORTANT> ... engine not reachable (context 'desktop-linux') — bringing the hypervisor up` → `hypervisor up — docker engine reachable`. POST: hypervisor `active`, `docker info` rc0, `odocker ps` rendered its header (engine operational). |
| **2. already-up → no-op** | `odocker ps` again | **rc=0 in 0s** ✓ | No self-heal output, `bringing the hypervisor up` NOT emitted → no re-boot. Idempotent. |

**All 6 acceptance criteria demonstrated live**: (1) constructor+ensure, (2) `docker info` reachability probe, (3) idempotent no-op, (4) desktop-linux → `systemctl --user start docker-desktop` + bounded wait + re-verify, (5) fail-loud/never-rc0-on-dead, (6) no hardcoded socket — context read from `docker context` truth.

**End-state note (needs a decision):** I left the hypervisor **`active`** (the operational state the constructor is designed to yield). The box's prior default was `inactive` + disabled. To restore that: `systemctl --user stop docker-desktop`. Say the word and I'll stop it.

**Proof logs:** `scratchpad/odocker-s{1,2,3}-*.log`. Fed to oosh-po@13mi for the gate.

---

## ✅ PO GATE — oosh-po@13mi, 2026-07-15 → awaiting TRON acceptance
Reviewed the tester's **captured** proof (reviewed, not re-run — PO gates on the report). **GATE: PASS 3/3.**
- **Predict==actual on all 3 scenarios**, with a REAL hypervisor VM boot (not simulated):
  - **dead→up**: rc0 in 14s; POST hypervisor `active` + `docker info` rc0 (criteria 1,2,4).
  - **already-up→no-op**: rc0 in 0s, no re-boot, `bringing the hypervisor up` NOT emitted (criterion 3 — idempotent).
  - **unrecoverable→fail-loud**: `DOCKER_CONTEXT=nosuch-bogus` → rc1 + actionable error, **zero side-effects** (context still `desktop-linux`, hypervisor still `inactive`) (criteria 5,6).
- First-principles satisfied: constructor yields an operational engine · idempotent · never-rc0-on-dead · resolve-from-`docker context` truth (no hardcoded socket).
- **Honest scope note:** only the PRIMARY `desktop-linux` path is live-proven (this box's reality). The SECONDARY `default`-context/sudo branch is **unexercised** (no live proof; not applicable here) — degrades gracefully per design. Not a gate blocker; flag for coverage if a `default`-context box appears.
- Skip-path (help/usage/completion/sourced → no boot) is **expert-measured**, not tester-captured — acceptable (low-risk introspection path).

**Open Q — hypervisor left `active` (was `inactive`+`disabled`): PO recommends RESTORE prior state (stop it).**
Rationale: this was a TEST, not a request to enable docker; tests should leave no durable side-effect. The `disabled` state is already preserved (won't auto-start on reboot), and the new feature means it **costlessly self-heals up on the next real `odocker` command** — so stopping now loses nothing. Command: `systemctl --user stop docker-desktop`. **TRON decides.**

→ Handed to TRON for acceptance + the stop/leave call.

---

## Extension — TRON 2026-07-15: `odocker start` auto-provisions the workspace config

**Requirement (TRON verbatim):** *"if there is no docker workspace, it must do `config add odocker` and set an odocker workspace env variable in it. `/home/shared/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces` would be the default."*

### Measured (13mi, mcdonges.latest)
- odocker uses **`ODOCKER_WORKSPACES`** (odocker:14-17); current built-in default `${OOSH_SHARED_BASE:-/home/shared}/Workspaces/AI/Claude.All/DockerWorkspaces` — **differs** from TRON's target.
- **Neither** dir exists: not the current default, not TRON's target → "no docker workspace" is the live state on this box.
- `config.add <file>` (config:375) = appends `source $CONFIG_PATH/<file>.env` into `$CONFIG` (user.env) then `config.clean` — the register-permanently primitive.
- `config.save <name> <PREFIX>` (config:254) writes `<name>.env` with all vars matching PREFIX.

### Spec — fold into the constructor self-care (beside `ensureEngine`)
1. **Trigger:** on real `odocker start`, if **no docker workspace is configured** — `ODOCKER_WORKSPACES` not persisted (no odocker config registered) — provision it. Idempotent: already-configured → **no-op**.
2. **Action:** persist default **`ODOCKER_WORKSPACES=/home/shared/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces`** into an **odocker config** and run **`config add odocker`** so it's wired into user.env permanently. (e.g. `export ODOCKER_WORKSPACES=<default>; config save odocker ODOCKER_; config add odocker` — expert picks the exact primitives; must be idempotent, no duplicate `source` line.)
3. **Single source of truth:** update odocker's built-in default (odocker:17) to the same EAMD path so code + persisted config agree.
4. Pure-state env file · never-silently-broken (if it can't persist, fail loud, don't claim configured).

### Open questions (expert/architect)
- (a) Also `mkdir -p` the default dir? `workspace.list`/`build` error "DockerWorkspaces not found" when absent — a fully-operational constructor may need the dir to exist, not just the var set.
- (b) **Doctrine tension:** `config.add` writes a literal `source …/odocker.env` line **into user.env**, but first-principles says env files hold pure state with **no `source` lines** (the `this` bootstrap owns the chain; `config.validate` rejects stray sources). Confirm `config add` is the sanctioned path here, or route `odocker.env` through the `this`-owned chain instead. Flag to architect.

### Test (oosh-tester) — T-ODOCKER-WORKSPACE
- no odocker config + `ODOCKER_WORKSPACES` unset → `odocker start` → `odocker.env` created with `ODOCKER_WORKSPACES=<EAMD default>`, wired into user.env, var live after re-source, rc0.
- already-configured → `odocker start` → no-op, no duplicate `source` line, rc0.
- config purity preserved (`config.validate`/`config.list` clean).

**Owner:** oosh-expert (impl) + oosh-tester (T-ODOCKER-WORKSPACE) → oosh-po@13mi gate → TRON.

### Expert impl report (oosh-expert, 2026-07-15) — commit `8d34276`
`private.odocker.ensureWorkspaceConfig` added beside `ensureEngine` in the constructor:
- **Trigger/idempotent**: provisions only when no odocker config is registered (`grep 'odocker.env' $CONFIG` absent); already-registered → no-op (just ensures the dir exists).
- **Action**: `export ODOCKER_WORKSPACES=<EAMD default>` → `config save odocker ODOCKER_` (pure-state env file) → `config add odocker` (TRON verbatim wire into user.env).
- **Fail-loud**: non-zero + "NOT claiming configured" if `config save`/`add` fails.
- **Single source of truth**: aligned `odocker:14-17` default to the same EAMD path (seam-preserving via `OOSH_SHARED_BASE`).

**Open questions — resolved:**
- **(a) mkdir → YES**: create the workspace dir (`mkdir -p`) so `workspace.list`/`build` work (fully-operational constructor), but **warn-not-fail** if the EAMD tree isn't writable — the persisted var is the primary requirement, the dir is secondary.
- **(b) doctrine tension → FLAG TO ARCHITECT**: I implemented TRON's verbatim `config add odocker`. Rationale: `odocker.env` stays **pure state** (exports only); the `source .../odocker.env` line `config.add` writes lives in **user.env**, which is the *aggregator*, not a state file — that is precisely what `config.add` exists for. **BUT** if `config.validate` rejects `source` lines anywhere in the config chain (the flagged concern), then `config.add`'s own output would fail validation — a framework inconsistency. **Architect: confirm `config add` is the sanctioned aggregator mechanism, OR route `odocker.env` through the `this`-owned source chain instead.** (Measured: no `config.validate` source-rejection found on this box; couldn't reproduce the rejection — noting it may be latent/other-branch.)

**Verified (no config write, no VM boot — live proof is the tester's):** `bash -n` clean; default resolves to the EAMD path; `odocker help` skips the provision (user.env `odocker.env` count 0→0); idempotency check reads user.env. **The first real `odocker <cmd>` on this box WILL provision (no odocker config yet) — that is the tester's T-ODOCKER-WORKSPACE live proof.**

### Tester (T-ODOCKER-WORKSPACE) — please capture proof
1. **no config → provision**: (ensure no `odocker.env` in user.env) → real `odocker <cmd>` (or `private.odocker.ensureWorkspaceConfig`) → `$CONFIG_PATH/odocker.env` created with `export ODOCKER_WORKSPACES=<EAMD>`, `source .../odocker.env` wired into user.env, var live after re-source, rc0.
2. **already-configured → no-op**: run again → no duplicate `source` line, rc0, fast.
3. **config purity**: `config.list`/`config.validate` clean; `odocker.env` = exports only.
NOTE: this provision also triggers the hypervisor `ensureEngine` on the same call — sequence/observe both. Report to oosh-po@13mi.

---

## Tester live proof (oosh-tester, 2026-07-15) — T-ODOCKER-WORKSPACE: **PARTIAL — purity FAILS, back to expert**

**Host:** 13mi @ `8d34276`. Real config write + VM boot performed, then **fully reverted** (clean backup restored, hypervisor stopped). Pre-test state confirmed restored (user.env byte-identical to backup; odocker.env removed; hypervisor `inactive`).

| Scenario | Result | Evidence |
|----------|--------|----------|
| **A. no-config + dead → provision + boot** (one `odocker ps`) | rc0, 3s ✓ | Both self-heals on one call: `bringing the hypervisor up`→`hypervisor up` AND `no docker workspace configured — provisioning…`→`workspace config provisioned`. `odocker.env` created, user.env source count 0→1, total source 2→3, `ODOCKER_WORKSPACES` live after re-source = EAMD default, hypervisor `inactive→active`. |
| **B. already-configured → no-op** | rc0, 0s ✓ | No re-provision, no re-boot, **no duplicate source line** (stays 1). Idempotent. |
| **C. config purity** | **✗ FAIL** | `odocker.env` is NOT pure exports (see defect). |

### 🐛 DEFECT (for oosh-expert) — provisioned `odocker.env` is impure
Captured contents (evidence: `scratchpad/config-backup/odocker.env.IMPURE-evidence`):
```
declare -- COMMANDS="save odocker ODOCKER_"                       # leaked internal var
export declare ODOCKER_WORKSPACES="/home/shared/EAMD.ucp/.../DockerWorkspaces"   # malformed
```
1. **Leaked `COMMANDS` var** — `config save odocker ODOCKER_` captured `COMMANDS` because its *value* contains `ODOCKER_`; the prefix filter matches the value, not the var **name** (unanchored-match bug in `config.save`).
2. **Malformed `export declare NAME=`** — should be `export ODOCKER_WORKSPACES=…`; as written it also exports a stray var named `declare`. (Value still resolves, so re-source "works", masking the defect.)
3. **`config validate` referenced in the criteria does not exist** — `./this: validate: No such file or directory`. Purity can't be checked via that method; verified by direct grep instead.

**Verdict: PARTIAL.** Provision trigger + idempotency (A, B) are correct; **config-purity (C) fails** → the "pure-state env file" acceptance criterion is unmet. Routing back to oosh-expert for a `config.save` name-anchored-match + clean `export NAME=` emission fix; re-test on the fix. NOT sent to the gate as pass.

**Cleanup:** shared `user.env` restored from pre-test backup (authorized); impure `odocker.env` deleted; hypervisor stopped to pre-test `inactive` (authorized). No durable side-effects remain.
**Proof logs:** `scratchpad/odocker-ws-{A,B}.log`, `scratchpad/config-backup/`.
