# Task: Create 3 New Agents for ossh/user Testing

**From**: Orchestrator (claude-opus)
**To**: Product Owner — coordinate with Agent Trainer to create these agents
**Priority**: High

## Background

We extended the `ossh` and `user` scripts to accept an optional `<?sshDir>` parameter on all functions, defaulting to `~/.ssh`. This allows operating on alternative SSH identity directories. A test environment exists at:

```
/Users/Shared/Workspaces/AI/Claude/experiment/.ssh/
├── id_ed25519       (600) — real ed25519 private key
├── id_ed25519.pub   (644) — real public key
├── config           (644) — SSH config
├── known_hosts      (644) — host entries
└── authorized_keys  (644) — authorized keys
```

The changes need testing. Create 3 new agents and have them test.

## New Agents to Create

### 1. ossh-expert (implementation specialist)
- **Role**: OOSH expert specialized in `ossh` and `user` scripts
- **Pane**: Assign to an idle pane (0.1 oosh-expert is idle, or use 1.3 developer)
- **Scope**: Knows the ossh/user scripts, understands the `private.get.sshDir()` pattern, can fix issues found during testing
- **First task**: Read `/Users/donges/oosh/ossh` and `/Users/donges/oosh/user`, understand the sshDir parameter changes

### 2. ossh-tester (test specialist)
- **Role**: Tests all ossh/user commands against the experiment `.ssh` directory
- **Pane**: Assign to an idle pane (0.2 oosh-tester or 1.2 task-agent)
- **First task**: Run test sequence (see Test Plan below)

### 3. ossh-po (quality guardian for ossh)
- **Role**: Product owner for the ossh/user scripts — reviews test results, ensures backward compatibility
- **Pane**: Assign to an idle pane (1.4 script-product-owner)
- **First task**: Review the test results from ossh-tester, verify no regressions

## Test Plan for ossh-tester

All tests use the experiment directory. The experiment `.ssh` dir has ed25519 keys (not RSA), so some tests will reveal a secondary issue (hardcoded `id_rsa` naming).

### Phase 1: Basic Resolution
```bash
cd /Users/donges/oosh

# Test 1: Set identity to experiment dir
./user in /Users/Shared/Workspaces/AI/Claude/experiment/.ssh

# Test 2: Verify resolution
./user get.current.identity
# Expected: /Users/Shared/Workspaces/AI/Claude/experiment/.ssh

# Test 3: Check status with explicit sshDir
./ossh isInstalled log /Users/Shared/Workspaces/AI/Claude/experiment/.ssh
```

### Phase 2: Identity Management
```bash
# Test 4: List identities (should show empty — no ids/ subdir yet)
./ossh list.ids "" /Users/Shared/Workspaces/AI/Claude/experiment/.ssh

# Test 5: Create a sub-identity
./ossh id.create testbot /Users/Shared/Workspaces/AI/Claude/experiment/.ssh

# Test 6: List identities again (should show testbot)
./ossh list.ids "" /Users/Shared/Workspaces/AI/Claude/experiment/.ssh
```

### Phase 3: Config Management
```bash
# Test 7: List config
./ossh config.list /Users/Shared/Workspaces/AI/Claude/experiment/.ssh/config

# Test 8: Create a config entry
./ossh config.create testhost root@localhost:22
./ossh config.save.last /Users/Shared/Workspaces/AI/Claude/experiment/.ssh/config

# Test 9: Get config entry back
./ossh config.get testhost /Users/Shared/Workspaces/AI/Claude/experiment/.ssh/config
```

### Phase 4: Structure Management
```bash
# Test 10: Create OOSH folder structure (will fail on id_rsa — document this)
./user ssh.create.folders /Users/Shared/Workspaces/AI/Claude/experiment/.ssh

# Test 11: Switch back to main
./user in main

# Test 12: Verify main is restored
./user get.current.identity
# Expected: /Users/donges/.ssh (or $HOME/.ssh)
```

### Phase 5: Backward Compatibility
```bash
# Test 13: All commands without sshDir param should still work with ~/.ssh
./ossh isInstalled log
./ossh config.list
./ossh list.ids
```

## Known Issue to Document

The scripts still hardcode `id_rsa` as the key filename. Our experiment uses `id_ed25519`. The ossh-expert should document where this matters and propose a fix (e.g., auto-detect key type by checking for `id_ed25519`, `id_rsa`, `id_ecdsa` in order).

## Coordination

1. **Agent Trainer** creates the 3 SKILL.md files in `.claude/agents/`
2. **PO** reviews the SKILL.md files
3. **ossh-tester** runs the test plan
4. **ossh-expert** fixes any issues found
5. **ossh-po** reviews results and signs off

## Acceptance Criteria

- [ ] 3 new agents created with proper SKILL.md files
- [ ] All Phase 1-5 tests executed and results documented
- [ ] Backward compatibility confirmed (Phase 5)
- [ ] Known issues documented (id_rsa vs id_ed25519)
- [ ] No regressions in existing ossh/user functionality
