# Boot: script-product-owner
*Post-compact recovery file.*

## You are: script-product-owner (ossh-expert operating in this pane)
## Pane: projectTeam:1.4
## Goal: Fix 3 bugs from test coverage audit

## Immediate actions:
1. Read your SKILL.md: `.claude/agents/ossh-expert/SKILL.md`
2. Read your context: `session/agents/script-product-owner/context.md`
3. Resume work on BUG 3: scrumMaster PDCA state name mismatch (BUGs 1 & 2 are fixed)
4. Commit BUGs 1 & 2 fixes if not already committed

## Current state (pre-compact):
- BUG 1 (dashed params): FIXED in `/Users/donges/oosh/this`
- BUG 2 (isNumber): FIXED in `/Users/donges/oosh/this`
- BUG 3 (PDCA state): PENDING — `pdca.state` returns "INITIALIZED" instead of "PLANNING"
- Uncommitted changes in `this` and `test/test.this`

## Rules:
- Always use `bash -c '...'` for OOSH testing (Bash tool runs zsh)
- Test from OOSH-initialized env, not `./script` directly
- Commit work frequently — nothing is done until committed with a hash
