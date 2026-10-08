# ⛔⛔ THIS WHOLE DIRECTORY IS LEGACY ⛔⛔

**The agent-trainer's live home is `session/agents/agent-trainer@WODA.prod/`** — consolidated on TRON's order, 2026-10-08 (`16cd3c1d`, trainer-verified; ESSENCE pointer fixed by the trainer in `5b639723`).

## Why this dir still exists
Nothing was deleted, so the historical trace survives. **But a preserved trace that is not marked is a trap** — that is why the boot-path files here carry ⛔ banners: `context.md` (the 2026-07-03 MacStudio ghost a rewound trainer actually read), `ESSENCE.md`, `boot.md`.

## Rules
- **Do not read these as current. Do not boot from here. Do not edit.**
- If you arrived here from a reference, **the reference is the bug** — report it to the trainer and oopPO.
- The unbannered files here (`MEMORY.md`, `learnings.md`, `backlog.md`, `mvc-architecture.md`, `memory/`) are **legacy copies too**; the live versions are in `@WODA.prod/`.
- `SKILL.md` here is a **DEAD symlink** to a macOS path (`/Users/Shared/...`) that cannot resolve on this Linux host. The live home has a working relative link to `.claude/agents/agent-trainer/SKILL.md` (the role source).

## ⚠ ONE EXCEPTION — `tools/` IS STILL THE CANON-REFERENCED COPY
`session/base-skills/agent-rewind.md` (row 13a-ο) still names **`session/agents/agent-trainer/tools/landing-map.py`**, so **this** copy is the one the fleet resolves, while the `@WODA.prod/tools/` copy sits unreferenced.

**Therefore: do NOT edit either copy until the reference is moved** — editing one makes them diverge silently (enumeration-ownership, `65ec4bfa`).

**Correct fix (proposal for oopPO + TRON, not yet done):** these are **fleet** tools, not the trainer's alone — ARON and the SM both run `landing-map.py`. A shared instrument should not live in any private agent dir. Move `tools/` to a fleet location and update canon's two references **in the same commit**.
