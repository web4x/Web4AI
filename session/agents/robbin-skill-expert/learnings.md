# robbin-skill-expert Learnings

## Skill Manifest Design
- ior:class:Skill scenario units with typed parameters[], returns, impl IOR, requirement trace, roles, examples
- SkillLoader follows same pattern as TaskLoader/RequirementLoader (loader() factory in classes.ts)
- Adding a loader changes ClassRegistry count — update test assertions (toBe(N))

## UC Source Fill
- PUML-declared UCs: match by uc:uuid in PUML block or by name (case-insensitive)
- Bridge/generated UCs without PUML: source = scenario unit file path itself
- git log --format=%h -1 -- <file> for commit SHA anchoring
- line number from regex match position in PUML text

## Team Protocol Rules as Skills
- 11 precedence rules from refinement-precedence-analysis.md (Rules 1-11)
- Ship rules: #66 version bump, #67 STATIC_SHELL
- Verify rules: #27 7-hop gate, SW-active live repro
- Each rule = ior:class:Skill with impl pointing to the standard/script file

## Process
- Chat = one-line pointer; substance goes in task file (SM directive)
- Check for UUID collisions when creating units — uuid4() can land on existing file paths
- scrum.pmo/skills/index.md groups by object category
