# Design: `plantuml` OOSH script — dockerized PlantUML render, managed via odocker

**Type**: CO-DESIGN (architect ↔ PO) · **From**: oosh-architect (Tron directive: "generate a plantuml oosh script to install and manage the odocker image and usage; talk to the PO and design it together") · **Date**: 2026-06-29
**Status**: DRAFT — architect proposal + open decisions for PO. Design together, then hand to expert.

## Principle / layering (the clean separation Tron named)
- **`odocker`** = generic Docker **image+container lifecycle** manager. Knows NOTHING domain-specific (no plantuml, no node, etc.).
- **`plantuml`** (NEW domain script) = owns ALL plantuml-specifics — the `plantuml/plantuml` image name, the `seccomp=unconfined` flag, `-tsvg`, render-dir mounting, and the render-result validation. It **delegates the container run to odocker**, never to raw `docker`.
- Mirrors the existing wrapper pattern (claudeCode→claude, claudeFlow→claude-flow): a domain script delegating to a generic tool.

## The central design decision (PO input needed) — how does plantuml run the container?
The render is an **ephemeral one-shot**: `docker run --rm --security-opt seccomp=unconfined -v "$DIR":"$DIR" -w "$DIR" plantuml/plantuml -tsvg <files…>`. But odocker is built for **workspace-built, long-lived NAMED containers** (`odocker.build <workspace>` from a Dockerfile, `odocker.run <image> <name>`, `odocker.exec`). It has **no generic ephemeral-run primitive**.

**Three options:**
| Opt | Approach | Trade-off |
|-----|----------|-----------|
| **A (architect lean)** | Add ONE generic primitive to odocker: `odocker.run.ephemeral <image> [--opt …] -- <args…>` = `docker run --rm [opts] <image> <args>`. plantuml delegates to it. | odocker stays generic (it's "run any image one-shot", knows no plantuml); future one-shot tools reuse it. Small, clean addition. |
| B | plantuml creates a DockerWorkspace (Dockerfile `FROM plantuml/plantuml`) + uses `odocker.build`/`odocker.run`. | Heavyweight for a CLI one-shot; leaves a long-lived container; overkill. |
| C | plantuml calls raw `docker run` directly. | Breaks the layering — plantuml would know `docker`, not just `odocker`. Rejected. |

**Architect recommendation: Option A.** It keeps odocker domain-agnostic while giving plantuml a clean delegation target. `--security-opt seccomp=unconfined` rides through as a passthrough opt (plantuml owns *that it's needed*; odocker just forwards opts).

## Proposed `plantuml` method surface
- `plantuml.install` — ensure the `plantuml/plantuml` image is present (pull if missing). **Idempotent, self-healing** (constructor contract): run anytime → image available.
- `plantuml.render <file|dir>` — render one .puml or a whole dir → .svg via the ephemeral container (seccomp + -tsvg baked in). **Self-care validation**: after render, assert each SVG grew past the ~7KB error-placeholder size AND `grep -L "contains errors"` — never silently ship a failed-render stub. Reports which files errored.
- `plantuml.check <file>` *(optional / maybe follow-up)* — pre-render lint for robbin-architect's **3 content-error classes**: (1) diagram-mode conflict (usecase/agent mixed with class-inheritance), (2) wrong-mode keyword (artifact/database in a class diagram), (3) label punctuation (`()<>{}` in multi-line labels). Catches errors before the docker round-trip.
- `plantuml.status` — image installed? docker reachable? (diagnostics)
- `plantuml.usage` + completions: `plantuml.render.completion` → .puml files/dirs.

## Self-care / robustness (bake in the hard-won gotchas so no one re-learns them)
- `seccomp=unconfined` **mandatory** on Docker 20.10.7 (JVM "cannot create worker GC thread" otherwise).
- Use the **CLI image `plantuml/plantuml`**, NOT a plantuml-SERVER workspace (port 8082 = wrong tool for batch file render).
- Pin an image **version tag** (reproducibility) — vs `:latest`? → PO call.
- Render validation = the self-care principle applied: detect a failed render (error-stub), don't perpetuate it.

## OPEN DECISIONS for PO (let's settle these together)
1. **odocker primitive** — approve Option A (`odocker.run.ephemeral`)? Or prefer B/C? (This is a small change to odocker, owned by oosh-expert — needs PO sign-off since it touches the generic tool.)
2. **Image pinning** — pin `plantuml/plantuml:<tag>` or track `:latest`?
3. **`plantuml.check` lint** — in scope v1, or a follow-up after render works?
4. **Where does the image install live** — `plantuml.install` does `docker pull`, or route through an odocker primitive too (`odocker.image.ensure <image>`)? (Keeps ALL docker calls in odocker.)
5. **Naming** — `plantuml render <dir>` reads well; confirm the verb set (install/render/check/status) or adjust.

## Next step
PO + architect settle the 5 decisions → architect finalizes the spec → oosh-expert implements `plantuml` (+ the one odocker primitive if Option A) → oosh-tester adds T-PLANTUML (render a known-good puml → real svg; render a known-bad puml → detected as error-stub, not silently shipped).

## Co-design log
- architect (proposal): DONE — above. Lean: Option A + validation-as-self-care. Awaiting PO on the 5 decisions.
- PO:
