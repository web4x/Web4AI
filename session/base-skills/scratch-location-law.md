# ★★★ ABSOLUTE STANDING LAW — Scratch Location (TRON, 2026-10-06)

*Canonical single source. Every agent boots with this via its SKILL's Base Skills reference. Effective immediately, fleet-wide, every team, no exceptions. Origin: TRON, shouted, relayed verbatim by oopPO after he found a repo-root `.tmp` symlink in Web4MDA:*

> **"forbid any of this shit fleet wide!!!"**

## THE RULE

**Product work and test scratch live ONLY inside the repo, and ONLY under a component's own `latest/test/gen`.**

- **ALLOWED:** `<repo>/…/<Component>/latest/test/gen/…` — the component's **OWN** gen folder (gitignored, disposable), under **FIXED names**, **wiped per run**, **never random** (no `mkdtemp`, no `tmp-XXXX`). Nothing else.
- **Tool tmp** (TMPDIR, npm cache/logs, tsx): the ONE fixed `Web4MDA/latest/test/gen/tmp` — not a per-run random dir, not an alias.
- **`/tmp` is for CLEANUP ONLY** — removing what is already there, by **literal path**. Never create, write, clone or work in it.

## FORBIDDEN — anywhere outside a component's `latest/test/gen`

- Work in `/tmp` or `/root` (incl. `/root/.npm`, `/root/.claude/jobs/*/tmp`).
- **Harness scratchpads** (the agent's session scratchpad directory) — for briefs, maps, patches, notes or anything else.
- **Clones and worktrees** placed outside the component's gen folder.
- **Symlinks / aliases** that point scratch somewhere else (e.g. a repo-root `.tmp` → gen). An alias is a second scratch root, not compliance.
- **Dot-dirs or any improvised scratch root** (`.tmp`, `.scratch`, `.cache`, `tmp/` …) anywhere else in the repo or outside it.
- **Background watches / loops that write to `/tmp`** (or anywhere outside the gen folder).

## TESTS LIVE IN THE COMPONENT THEY TEST (H5m / H5m-3) — and scratch is per-component (H5n)

- **Every test lives in `<C>/latest/test/` of the component its ASSERTIONS test** — not a shared top-level test folder, not "near" the code. A misplaced test is a gated RED.
- **Each test's scratch lives in ITS OWN component's `latest/test/gen/`** under fixed names, wiped per run — never another component's gen, never random.
- **The spec is the single source — READ it, never restate it here:** Web4MDA `spec/bootstrap.md` **rule 9** + **AC20–AC23** at `72859188` (AC20 nothing writes outside the repo · AC21 no alias/symlink/dot-dir/worktree/clone · AC22 per-component scratch, fixed names · AC23 every test in the component it tests). Gates: `GarbageSweep.test.ts`, `TestPlacement.test.ts`.

## HOW TO COMPLY

- Point tools at the gen folder **by construction**: `TMPDIR`, npm cache/logs, test output, clones — all under the owning component's `latest/test/gen`, derived from the product's own constant (never hard-coded, never aliased).
- Briefs, maps, notes between agents: **inline** (paste into the composer) or **committed** into the agent's own files under `session/agents/<agent>/`. Never a scratch file.
- If a tool cannot run inside the gen folder (e.g. a socket-path length limit), **STOP and report to your PO** — do not invent an alias or a new root. The PO rules with Tron.

## WHEN YOU FIND A VIOLATION

- **Stop creating more.** Report it **once** to your PO (what, where, who, since when) — measured, by literal path.
- Cleanup of existing scratch is **literal-path deletion only**, and only of what is verifiably yours or what your PO assigns; check for real work first (uncommitted edits, unpushed commits) — **delete nothing that carries work**.
- Your own past violations are no exception: disclose them in your anchor (what you wrote where).

## WHY

Scratch outside the component is invisible to review, survives nothing reliably, leaks across agents and machines, and turns every cleanup into archaeology. One place, owned by the component, gitignored — reviewable by construction.

*Placement in the TRON-CMM4 doctrine and process-canon is the keeper's (ARON). This file is the operational single source the SKILLs point to.*
