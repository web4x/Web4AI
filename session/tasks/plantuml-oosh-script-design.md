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
| **A (architect lean)** | Add ONE generic primitive to odocker — **all-positional, NO FLAGS** (OOSH death-to-flags): `odocker.run.ephemeral <image> <workdir> <args…>` = internally `docker run --rm --security-opt seccomp=unconfined -v <workdir>:<workdir> -w <workdir> <image> <args…>`. plantuml delegates to it. | odocker stays generic ("run any image one-shot in a mounted dir", knows no plantuml); future one-shots reuse it. Small, clean. |
| B | plantuml creates a DockerWorkspace (Dockerfile `FROM plantuml/plantuml`) + uses `odocker.build`/`odocker.run`. | Heavyweight for a CLI one-shot; leaves a long-lived container; overkill. |
| C | plantuml calls raw `docker run` directly. | Breaks the layering — plantuml would know `docker`, not just `odocker`. Rejected. |

**Architect recommendation: Option A.** Keeps odocker domain-agnostic, gives plantuml a clean delegation target. **NO FLAGS on the OOSH interface** — `<image> <workdir> <args…>` are positional; the docker-runtime opts (`--rm`, `--security-opt seccomp=unconfined`, `-v`, `-w`) live INSIDE odocker (it's the docker expert — seccomp is a Docker-20.10.7 runtime concern, not a plantuml concern). plantuml call becomes: `odocker run.ephemeral plantuml/plantuml "$DIR" -tsvg <files>` — where `-tsvg` etc. are passthrough args to the *containerized plantuml binary* (NOT oosh-method flags — passthrough to a foreign CLI is allowed; oosh method signatures stay flag-free).

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
- **PO (oosh-po@WODA.prod, 2026-06-29) — calls on all 5:**
  1. **odocker primitive: APPROVE Option A.** `odocker.run.ephemeral <image> <workdir> <args…>` (all-positional; **`ephemeral` is the object.verb that encodes `--rm` — no flag**) is DRY-correct: a legitimate GENERIC Docker capability ("run any image one-shot in a mounted dir"), not plantuml-specific — odocker stays domain-agnostic and every future dockerized one-shot reuses it. seccomp/--rm/-v/-w live INSIDE the verb (docker-runtime concerns odocker owns), NOT as flags. B is overkill for a one-shot; C breaks layering (rejected, correctly). *(Notation corrected from stale flag-form draft per object.verb doctrine, ARON-caught.)*
  2. **Image pinning: PIN a version tag**, exposed as an overridable config var (e.g. `PLANTUML_IMAGE` / `PLANTUML_TAG`). Reproducibility is first-principle — a render must be deterministic regardless of when it runs; `:latest` can silently change output/break. Pin a known-good tag; upgrades are deliberate (change the var), not accidental.
  3. **`plantuml.check` lint: FOLLOW-UP, not v1.** v1 = install + render + post-render validation (that's the capability that unblocks the puml favor + Sprint22). The post-render error-stub detection ALREADY satisfies "never silently ship a failed render" + names which files errored. The pre-render lint (3 content-error classes) is faster feedback but a separate concern — track it as a committed follow-up (the 3 classes are real, from robbin-architect), don't let it gate v1.
  4. **Image install: ROUTE through odocker — add `odocker.image.ensure <image>`** (idempotent pull-if-missing); `plantuml.install` delegates to it. CONSISTENCY: if plantuml.install did `docker pull` directly it would violate the exact layering we set in #1/#C-rejection (plantuml knows only odocker, never docker). ALL docker access through odocker.
  5. **Naming: CONFIRM `install` / `render` / `status` (+ `check` follow-up).** Reads well (verb on the plantuml object, mirrors claudeCode/claudeFlow). `render` must accept BOTH `<file>` and `<dir>` (signature already says so). Add `render.completion` → .puml/dirs. No object.verb reversal issues (single verbs on plantuml).
  - **SYNTHESIS**: #1 + #4 together = odocker gains TWO small generic primitives (`run.ephemeral` + `image.ensure`), both domain-agnostic + reusable. plantuml becomes their FIRST consumer = the proof the layering works. **DOGFOOD**: the queued cross-team favor (robbin's 12 R22.3 .puml→svg) + future Sprint22 puml should run through `plantuml render`, NOT a one-off — make T-PLANTUML use a real robbin .puml as the known-good case. (Heads-up to expert: the favor I queued may become "build plantuml, then render via it" rather than an ad-hoc docker run — your call on timing vs the favor's low priority.)
  - **APPROVED to finalize**: architect, write the final spec on these 5 calls → oosh-expert implements `plantuml` + the 2 odocker primitives → oosh-tester T-PLANTUML (good-puml→real-svg, bad-puml→detected-stub). All real work (Tron directive), not parked.

## FINAL SPEC (architect, on the PO's 5 calls — 2026-06-29) — ready for expert
**Doctrine applied throughout: object.verb IS the no-flag principle. Every signature below is all-positional; variation lives in the verb.**

### odocker — 2 new GENERIC primitives (domain-agnostic; plantuml is first consumer)
- `odocker.run.ephemeral <image> <workdir> <args…>` — one-shot run. Verb `ephemeral` encodes one-shot semantics. Impl: `docker run --rm --security-opt seccomp=unconfined -v "<workdir>":"<workdir>" -w "<workdir>" <image> <args…>`. The `--rm`/seccomp/`-v`/`-w` are docker-runtime concerns INSIDE the verb — never exposed as oosh flags. `<args…>` are opaque passthrough to the image's entrypoint (foreign-CLI exception). Completion: `.completion.image` → local images.
- `odocker.image.ensure <image>` — idempotent: pull if missing, no-op if present (self-care/constructor contract). Returns 0 when the image is available. Completion: `.completion.image`.

### plantuml — new domain script (delegates ALL docker to odocker; never calls docker)
Config vars (PO #2): `PLANTUML_IMAGE` (default `plantuml/plantuml`), `PLANTUML_TAG` (default a PINNED known-good tag, NOT `:latest`) — overridable for deliberate upgrades.
- `plantuml.install` — `odocker.image.ensure "${PLANTUML_IMAGE}:${PLANTUML_TAG}"`. Idempotent.
- `plantuml.render <fileOrDir>` — resolve the render dir (the file's dir, or the dir itself); call `plantuml.install` (self-heal: ensure image first); then `odocker run.ephemeral "${PLANTUML_IMAGE}:${PLANTUML_TAG}" <dir> -tsvg <fileOrDir>` (`-tsvg` = passthrough to the plantuml binary, not an oosh flag). **Post-render validation (self-care — PO #3): for each output .svg assert size > error-stub threshold (~7KB) AND `grep -L "contains errors"`; report each failed file (never silently ship a stub).** Completion: `.completion.fileOrDir` → .puml files + dirs.
- `plantuml.status` — docker reachable? image present (`odocker.image.ensure`-dry / `odocker.list`)? diagnostics.
- `plantuml.usage`.
- **FOLLOW-UP (PO #3, not v1, but track):** `plantuml.check <file>` — pre-render lint for robbin-architect's 3 content-error classes (diagram-mode conflict / wrong-mode keyword / label punctuation). Committed follow-up, does NOT gate v1.

### Test contract — oosh-tester T-PLANTUML
- Good case: render a REAL robbin `.puml` (R22.3, DOGFOOD per PO synthesis) → assert a real .svg (> threshold, no "contains errors").
- Bad case: render a known-bad .puml (one of the 3 error classes) → assert `plantuml.render` DETECTS the error-stub and reports it (does NOT exit 0 silently / does not ship the stub as success).
- odocker primitives: `odocker.image.ensure` idempotent (twice = no-op); `odocker.run.ephemeral` runs + cleans up (`--rm`, no leftover container).

### Layering invariant (the proof this design exists to demonstrate)
`plantuml` → `odocker` → `docker`. plantuml contains ZERO `docker` calls (grep-guard candidate). odocker contains ZERO plantuml references. The 2 new odocker primitives are generic; plantuml being their first consumer proves the seam.

### Handoff
- architect: **FINAL SPEC DONE** (above). object.verb/no-flag clean; line-49 stale form reconciled (ARON catch).
- oosh-expert: implement `odocker.run.ephemeral` + `odocker.image.ensure` (generic, with completions) → then `plantuml` (install/render/status/usage + completion) with PLANTUML_IMAGE/TAG vars + post-render validation. Commit each.
- oosh-tester: T-PLANTUML per the contract above (dogfood a real robbin .puml).
