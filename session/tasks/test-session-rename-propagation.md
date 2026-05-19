# Test: Session Rename Propagation to hiveMind

**From**: oosh-expert
**To**: oosh-tester
**Commits**: pending (not pushed yet)

## What Changed

1. **hiveMind.session.renamed <old> <new>** — updates roles.env, sessions.env, teams.env, active.team when a session is renamed
2. **otmux.session.rename** — captures old name before tmux rename, notifies hiveMind after (observer pattern)

## Tests

### T-RENAME-PROP-1: session.renamed updates roles.env
```bash
# Setup: add test entry to registry
echo "__test_old_sess:0.0|test-agent" >> ~/config/hivemind.roles.env
hiveMind session.renamed __test_old_sess __test_new_sess
grep __test_new_sess ~/config/hivemind.roles.env  # should find it
grep __test_old_sess ~/config/hivemind.roles.env  # should NOT find it
# Cleanup
sed '/test-agent/d' ~/config/hivemind.roles.env > /tmp/r.tmp && mv /tmp/r.tmp ~/config/hivemind.roles.env
```

### T-RENAME-PROP-2: session.renamed updates sessions.env
```bash
echo "__test_old_sess:0.0|fake-uuid" >> ~/config/hivemind.sessions.env
hiveMind session.renamed __test_old_sess __test_new_sess
grep __test_new_sess ~/config/hivemind.sessions.env  # should find
# Cleanup
sed '/fake-uuid/d' ~/config/hivemind.sessions.env > /tmp/s.tmp && mv /tmp/s.tmp ~/config/hivemind.sessions.env
```

### T-RENAME-PROP-3: session.renamed updates teams.env
```bash
echo "__test_old_sess|Test team" >> ~/config/hivemind.teams.env
hiveMind session.renamed __test_old_sess __test_new_sess
grep __test_new_sess ~/config/hivemind.teams.env  # should find
# Cleanup
sed '/Test team/d' ~/config/hivemind.teams.env > /tmp/t.tmp && mv /tmp/t.tmp ~/config/hivemind.teams.env
```

### T-RENAME-PROP-4: otmux session.rename triggers hiveMind update
```bash
otmux new __test_rename_prop
# Add to registry
echo "__test_rename_prop:0.0|rename-test-agent" >> ~/config/hivemind.roles.env
# Rename via otmux
otmux session.rename __test_rename_prop __test_renamed_prop
# Verify propagation
grep __test_renamed_prop ~/config/hivemind.roles.env  # should find
otmux kill __test_renamed_prop
# Cleanup
sed '/rename-test-agent/d' ~/config/hivemind.roles.env > /tmp/r.tmp && mv /tmp/r.tmp ~/config/hivemind.roles.env
```

### T-RENAME-PROP-5: same name = no-op
```bash
hiveMind session.renamed sameName sameName  # should return 0, no changes
```
