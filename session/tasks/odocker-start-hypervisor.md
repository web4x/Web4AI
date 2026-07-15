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
