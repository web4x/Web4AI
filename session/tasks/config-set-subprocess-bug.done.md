# Done: oo mode.base.set persists to oosh.env

**Agent**: oosh-expert
**Task**: config-set-subprocess-bug.md
**Result**: PASS
**Summary**: mode.base.set now uses `config save oosh OOSH` to persist to oosh.env (not config set to user.env)
**Commit**: ff01735
**Verify**:
1. `oo mode.base.set /Users/Shared/Workspaces/AI/Claude/components/OOSH`
2. `grep OOSH_COMPONENTS_DIR ~/config/oosh.env` — should show the path
3. `grep OOSH_COMPONENTS_DIR ~/config/user.env` — should be empty
4. `oo mode.base.get` — should return the path
5. `oo mode.list` — should list branches
