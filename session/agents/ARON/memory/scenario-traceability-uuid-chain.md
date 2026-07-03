---
name: scenario-traceability-uuid-chain
description: Web4RawBin scenario traceability — typed [type:uuid] chain (req→usecase→class/method→impl→test), first-class tracelink objects, markdown is a generated view.
metadata:
  type: reference
---

**TRON feedback 2026-07-03:** "refine the clean template according to the web4rawbin scenario traceability and the uuid format for the traceability chain." Researched at source: `/var/dev/Workspaces/web4x/Web4RawBin/scenario/`.

**The Web4RawBin scenario traceability model (authoritative):**
- **Every scenario unit is a UUID-keyed `.scenario.json`** in the sharded index (`scenario/index/<h>/<h>/…/<uuid>.scenario.json`). The `.md`/`.html` are **GENERATED VIEWS** of it — never hand-authored (scenario-first, law #100).
- **Unit types** (`scenario/sprints.md/`): requirement · usecase · class · method · implementation · test · task · **tracelink** · bug · changerequest · device · file · message · room · skill · user.
- **Traceability = first-class `tracelink` objects** (each its own UUID). A tracelink declares a TYPED relationship: `<type>:<uuid> <verb> <type>:<uuid>` — e.g. `requirement:12a4b6c8 implements task:f7a2c4e6`.
- **The forward chain:** `requirement → usecase → (puml/diagram) → class/method → implementation → test`, each stage a **`[type:uuid:<v4>]`** reference.
- **A unit's view has a `## Traceability` section** listing related units by type with links (e.g. `**Classes:** - [🔗 Assets](../class/assets.md)`).

**How to apply (task template):** the task's Traceability carries the typed-uuid **chain** (each `[type:uuid:<v4>]`), and each Acceptance Criterion links to its `[test:uuid:<v4>]`. See [[acceptance-criteria-link-tests]], [[dual-links-pdca]], [[template-is-clean-headers]].
