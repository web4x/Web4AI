[Back to Planning Sprint N](./planning.md)

# Task N: <Title>
<!-- EXAMPLE: # Task 12: Purify planning-templates to Web4-canonical shape
     KNOWLEDGE: Title = imperative verb + object, ONE deliverable per task. N = task number within the sprint. This heading is the human-readable name; the machine identity is the [task:uuid] below. -->

[task:uuid:<generate-uuid-v4>]
<!-- EXAMPLE: [task:uuid:6d7f7a3b-7040-4ce1-970b-eadf618e4a45]
     KNOWLEDGE: A REAL v4 uuid from `uuidgen` — never invented, never a suffix of another. This is the task's permanent Web4 identity: the anchor every subtask, requirement, and test links back to. Generate once; never change it. -->

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done
<!-- KNOWLEDGE: The status IS the single truth of where the task stands (measure, never assume from chat). Each role checks its OWN sub-box (refinement/test-cases/implementing/testing) as work GENUINELY completes — not optimistically. QA Review + Done are TRON's gate ONLY: never self-checked, only after an explicit "TN QA approved by TRON" commit. Order is a pipeline: refine → test-cases → implement → test → QA. -->

## Traceability
- Source: <sprint / epic / directive>
- up
  - [Sprint N Planning](./planning.md)
- down
  - [Task N.1: <role> - <title>](./task-N.1-<role>-<slug>.md)
- chain (req → usecase → class/method → impl → test):
  - `[requirement:uuid:<v4>]` <slug>
  - `[usecase:uuid:<v4>]` <slug>
  - `[class:uuid:<v4>]` · `[method:uuid:<v4>]`
  - `[implementation:uuid:<v4>]`
  - `[test:uuid:<v4>]`
<!-- EXAMPLE chain for a status-view feature:
       [requirement:uuid:8f2c...] r19-61-every-scenario-type-generates-md-and-html-view
       [usecase:uuid:3ab9...] viewtemplate-registeralltypes
       [class:uuid:5d10...] ViewTemplateRegistry · [method:uuid:77e4...] register(className)
       [implementation:uuid:91cc...] viewtemplateregistry-register-classname
       [test:uuid:c0de...] viewtemplateregistry.register.test
     KNOWLEDGE: The chain is FORWARD-ONLY — req → usecase → class/method → impl → test — no back-references. `up` = parents (the sprint/epic that motivates this); `down` = the role subtasks. Every id is a real v4 uuid. SCENARIO-FIRST (law #100): the requirement + usecase units must exist on disk BEFORE implementation — the task traces to units that already exist, it does not invent them. Markdown is a generated VIEW of those units. -->

## Goal
<what this task delivers, in one line>
<!-- EXAMPLE: A task-template that teaches its own fields inline and instantiates clean.
     KNOWLEDGE: One sentence, outcome-shaped ("delivers X"), testable against the Acceptance Criteria below. If you cannot state the goal in one line, the task is too big — split it. -->

## Context
<key files, paths, situation>
<!-- EXAMPLE: scrum.pmo/sprints@Temple/templates/task-template.md ; TRON ruling 2026-07-03: "examples + process/knowledge below the placeholders."
     KNOWLEDGE: Give the reader the ground truth to act without re-discovery — exact file paths (repo-relative), the originating TRON directive quoted VERBATIM, and any measured state. Context prevents the assume=ass-u-me failure. -->

## Intention
<one paragraph: why this task exists and what it solves>
<!-- EXAMPLE: Fresh agents mis-fill templates because the knowledge lives elsewhere; embedding example+knowledge below each field makes the template self-teaching and passes the fresh-agent test, while HTML-comment guidance keeps the instantiated task clean.
     KNOWLEDGE: The WHY. Ties the task to a first principle or a measured gap. This is what survives when details change — it lets the next incarnation judge whether the task is still needed. -->

## Steps
1. <step>
<!-- EXAMPLE:
       1. Read the current template (measure before editing).
       2. Add EXAMPLE + KNOWLEDGE guidance below each placeholder.
       3. Commit + push; present dual-linked to TRON for ruling.
     KNOWLEDGE: Ordered, each step a single verifiable action. Steps are the plan (the P in PDCA); they let a peer resume mid-task and let the tester derive scenarios. -->

## Requirements
- <requirement>
<!-- EXAMPLE: - Instantiated task (placeholders filled, guidance stripped) contains ONLY clean headers + content (TRON: "a template is clean headers only").
     KNOWLEDGE: The constraints the deliverable MUST satisfy — distinct from Steps (how). Each requirement should be checkable and should map to an Acceptance Criterion below. -->

## Acceptance Criteria
- [ ] AC1: <testable criterion> — `[test:uuid:<v4>]` [TS1](./task-N.M-tester-<slug>.md#ts1)
- [ ] AC2: <testable criterion> — `[test:uuid:<v4>]` [TS2](./task-N.M-tester-<slug>.md#ts2)
<!-- EXAMPLE: - [ ] AC1: a fresh agent fills the template correctly from its inline guidance alone — [test:uuid:c0de...] [TS1](./task-12.2-tester-fresh-fill.md#ts1)
     KNOWLEDGE: Every AC is TESTABLE and LINKED to a real `[test:uuid]` + the tester's scenario (TS). "Done" = every AC box checked AND its test passes. An AC with no linked test is not an AC — it's a wish. This is the AC↔test bidirectional link (Web4Articles PDCA). -->

## Deliverables
- <path/to/file>
<!-- EXAMPLE: - scrum.pmo/sprints@Temple/templates/task-template.md
     KNOWLEDGE: The concrete artifacts this task produces, as repo-relative paths. If it's not committed at one of these paths, it does not exist (wer schreibt der bleibt). -->

## QA Audit & User Feedback
- <date>: <TRON feedback / QA notes>
<!-- EXAMPLE: - 2026-07-03: TRON — "make the template with examples below the placeholders, the process and knowledge itself." Ruled: self-documenting via comment-guidance.
     KNOWLEDGE: The running record of TRON's rulings + QA outcomes, dated. This is where the gate's verdict and every correction live — it makes the task auditable and feeds the next template's knowledge. -->

## Subtasks
- [Task N.1: <role> - <title>](./task-N.1-<role>-<slug>.md) — sub-tasks carry `[subtask:uuid:<v4>]`
<!-- EXAMPLE: - [Task 12.1: developer - add guidance blocks](./task-12.1-developer-guidance.md) — [subtask:uuid:aa11...]
     KNOWLEDGE: Atomic tasks have none ("None (atomic task)"). Otherwise one subtask per ROLE (developer implements, tester verifies) — role = `developer`, never "expert". Each subtask has its OWN [subtask:uuid] and links up to this task's [task:uuid]. -->

<!-- =========================================================================
     HOW TO USE THIS TEMPLATE (delete this block + all guidance comments when done):
     1. Copy this file to task-N-<slug>.md in the sprint dir.
     2. For each field: read the EXAMPLE + KNOWLEDGE, replace the <placeholder>
        with real content, then DELETE that field's guidance comment.
     3. The finished task = clean headers + real content, no <placeholders>, no
        guidance comments. That clean task is what QA reviews.
     The TEMPLATE teaches; the instantiated TASK is clean. Both are true.
     ========================================================================= -->
