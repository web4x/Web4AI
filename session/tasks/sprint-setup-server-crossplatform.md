# Sprint: SETUP_SERVER cross-platform + state-machine correctness

**Owner (PO)**: oosh-po@MacStudio · **Created**: 2026-07-02 (Tron-directed)
**Single source of truth** (SPRINT-COMMS): stories below carry Status/Owner/inline report-back. Git mailbox = channel. Tick as commits land.

## Goal

A naked system reaches a **correct, mode-aware, platform-appropriate** oosh installation via BOTH install paths — with ALL install/branch logic in the **`oo`** custom script (the one that runs the SETUP_SERVER machine), and **ZERO edits to the `state` engine** (Tron hard constraint). Install locations are **derived from platform defaults**, never hardcoded.

## The two install paths (both must drive SETUP_SERVER to the same correct end-state)

- **P1 — self-bootstrap**: download + execute `init/oosh(.sh)` as the ONLY script; it does the rest on a naked system.
- **P2 — remote install**: `ossh install` from a WORKING oosh box → installs **dev mode** onto a naked remote system.

## Defects to fix (input: tester diagnosis 703b817, live on WODA.test)

- **D1 — state ordering**: `user.installation.done` [21] is mis-indexed BEFORE its prerequisites `user.mode.release` [22] / `user.mode.dev` [23]. A user install cannot be "done" before a mode is chosen. Correct order: `user.rights.only (20) → [mode branch: release XOR dev] → user.installation.done`. Genuine user terminal on a dev box = `user.mode.dev`, not 21.
- **D2 — XOR branch dead-ends**: `user.mode.release`/`user.mode.dev` are a mutually-exclusive XOR modeled as two SEQUENTIAL states. `state next` always hits release first; on a dev box its check fails with NO redirect to dev → machine STALLS at 21, un-traversable linearly (only `state set` bypasses). Fix: the mode `private.check.*` must **redirect on active `OOSH_MODE`** (return the matching mode state's index — the redirect pattern the engine already supports) so `state next` crosses the XOR.
- **D3 — platform-hardcoded defaults**: init defaults bake in platform-specific paths (`/Users/Shared…` macOS, `/home/shared`, `/var/dev` linux). OOSH is cross-platform → **derive best locations from platform defaults in config init**, especially for **(a) OOSH component modes** and **(b) odocker workspaces**. Use existing `os` detection; no per-call hardcoding.

## How the state machine works (constraint reminder — read carefully before designing)

- `state` = engine (add/next/set/of/list). States persist in `~/config/stateMachines/SETUP_SERVER.states.env` as an indexed bash array; `NN` entries are jump/transition pointers.
- The CUSTOM script (`oo`) implements `private.check.<statename>()` hooks. On transition the engine calls the target state's check, which can **accept** (return its own index), **redirect** (return a different index — this is how XOR/branch is done), or **fail/hold**.
- **We fix branch logic + ordering by editing `oo`'s checks and the state-add order `oo` declares — NOT the `state` engine.**

## Stories

### S1 — Architect: design (careful read → WHAT/WHY)  ·  Owner: oosh-architect  ·  Status: PLANNED
Read carefully: `state` engine, `oo`'s SETUP_SERVER definition (state-add order + all `private.check.*`), `init/oosh` (P1 bootstrap), `ossh install` (P2). Produce a design doc covering:
1. Corrected state order (mode branch before `user.installation.done`) — expressed as `oo`'s state-add sequence.
2. XOR redirect mechanism — how the mode checks return the active-`OOSH_MODE` index so `state next` crosses release⊕dev.
3. **Platform-default derivation** strategy (via `os` detection) for component modes + odocker workspaces — the single place defaults are computed, consumed by both paths.
4. How **P1 and P2** each drive SETUP_SERVER to the SAME correct terminal (per privilege: user-mode terminal vs full root/server terminal).
Deliver design to this file. No code.

### S2 — Expert: state order + XOR redirect in `oo`  ·  Owner: oosh-expert  ·  Status: BLOCKED (needs S1)
Implement corrected state-add order + mode-check redirect-on-`OOSH_MODE` in `oo`. NO `state` engine edits. `bash -n` clean.

### S3 — Expert: platform-default derivation  ·  Owner: oosh-expert  ·  Status: BLOCKED (needs S1)
Replace hardcoded platform paths with os-derived defaults in config init (+ `oo`) for component modes + odocker workspaces.

### S4 — Tester: verify P1 (self-bootstrap)  ·  Owner: oosh-tester  ·  Status: BLOCKED (needs S2/S3)
On a naked box (WODA.test): `init/oosh` reaches correct mode-aware terminal via `state next` (no stall), platform-correct paths, idempotent. Show raw `state next`/`state of`.

### S5 — Tester: verify P2 (ossh install dev→naked)  ·  Owner: oosh-tester  ·  Status: BLOCKED (needs S2/S3)
`ossh install` dev-mode from a working box onto a naked system reaches the SAME correct end-state.

### S6 — Tester: regression tests  ·  Owner: oosh-tester  ·  Status: BLOCKED (needs S2/S3)
T-STATE-ORDER (mode branch precedes done; `state next` crosses XOR on both OOSH_MODE values) + T-PLATFORM-DEFAULTS (derived, not hardcoded; correct per platform).

## Sequence
S1 → (S2, S3 parallel) → (S4, S5, S6 parallel) → PO QA gate → Tron promote (dev→macos.latest).

## Rules
- DO NOT modify the `state` script. Fix only `oo` (SETUP_SERVER checks/order) + config init (platform defaults).
- OOSH wrappers only; no output filtering; measure live on WODA.test.
- Architect = WHAT/WHY, Expert = HOW, Tester = verify. Report-back in THIS file + one-line nudge.
