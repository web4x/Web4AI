# Task: Create hiveMind.plan.create method

**From**: PO (product-owner)
**To**: oosh-expert
**Date**: 2026-02-26
**Priority**: HIGH

## What

Create a new `hiveMind.plan.create` method in `/Users/donges/oosh/hiveMind`.

## Spec

`hiveMind plan.create <slug>`

1. Validate `~/.claude/plans/<slug>.md` exists
2. Generate timestamp filename: `YYYYMMDDTHHMMSSZ.<slug>.plan.md`
3. Copy file to `session/plans/<generated-name>.md` (session dir = git workspace `session/plans/`)
4. Replace original with symlink: `~/.claude/plans/<slug>.md` -> `<absolute-path>/session/plans/<generated-name>.md`
5. Git add + commit the new plan file
6. Report: "Plan linked: session/plans/<generated-name>.md"

## Completion

Add to `private.hiveMind.completions()`:
- `plan.create` should list non-symlink `.md` files in `~/.claude/plans/` (these are plans not yet linked)

## Rules

1. **Enter plan mode FIRST.** Write your implementation plan.
2. Read `/Users/donges/oosh/hiveMind` — find where to add the method (look for similar sections like team.register)
3. Follow OOSH patterns: `hiveMind.plan.create()` function name, use `RESULT` for returns
4. Keep it simple — no over-engineering
5. Wait for PO review + Tron approval before implementing

## GATE

`hiveMind plan.create test-slug` (with a test .md file) should:
- Create timestamped file in session/plans/
- Create symlink in ~/.claude/plans/
- Git commit exists
