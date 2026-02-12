# OOSH Expert Agent Context

**Session**: Cursor pairing session (solo, no team)
**Role**: oosh-expert
**Updated**: 2026-02-12T11:30Z
**State**: active, object.verb migration Round 1 complete

## CURRENT GOAL
Object.verb method naming migration. Round 1 complete (wrappers added). Round 2 pending (privatize old verb.object names).
Taken over from previous agent (claudeSonnet1mSession in claudeOpus2kTMUX:0.0).

## COMPLETED WORK THIS SESSION
1. Read SKILL.md, context.md, learnings.md, backlog.md, achievements.md
2. Captured previous agent's pane — identified 3 open issues from their experiment
3. **Implemented `private.detect.ssh.key()`** — scans for id_ed25519, id_ecdsa, id_rsa, id_dsa in priority order
4. **Implemented `private.detect.ssh.key.type()`** — returns just the key type name
5. **Fixed `ossh.isInstalled()`** — uses auto-detection instead of `[ -f id_rsa ]`
6. **Fixed `ossh.get.public.id()`** — auto-detects .pub file key type
7. **Fixed `ossh.id.create.fromKey()`** — detects source key type, copies correctly
8. **Fixed `ossh.id.create()`** — generates ed25519 by default
9. **Fixed `ossh.config.create()`** — fallback key path uses auto-detection
10. **Fixed `ossh.config.parse.url()`** — fallback key path uses auto-detection
11. **Fixed `ossh.create.key.folders()`** — copies detected key to private_key/public_keys
12. **Fixed `ossh.update.authorized_keys()`** — chmod on detected key
13. **Fixed `ossh.fix.rights()`** — chmod on detected key, added sshDir passthrough
14. **Fixed `user.init()`** — generates ed25519 by default
15. **Fixed `user.ssh.create.folders()`** — copies detected key type
16. **Fixed `user.update.authorized_keys()`** — chmod on detected key
17. **Fixed `experiment/.ssh/config`** — IdentityFile now references id_ed25519
18. **Tested via tmux pane (claudeOpus2kTMUX:0.1)**:
    - `ossh isInstalled log .ssh` → PASS: "ssh is initialized for donges in .ssh (id_ed25519)"
    - `user ssh.status log .ssh` → PASS: "(id_ed25519)"
    - `ossh get.public.id testbot .ssh` → PASS: detects id_rsa in testbot subdir
    - `ossh list.ids "" .ssh` → PASS: lists testbot (pre-existing line find error on empty search)
    - `ossh fix.rights .ssh` → PASS: chmod 600 on id_ed25519, tree shows correct perms
    - Tab completion: working for all ossh methods

## KEY FILES MODIFIED
- `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude/ossh` — 11 functions updated + 2 new helpers + 21 object.verb wrappers + 4 completion wrappers
- `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude/user` — 3 functions updated + 5 object.verb wrappers
- `/Users/Shared/Workspaces/AI/Claude/experiment/.ssh/config` — IdentityFile updated

## KEY KNOWLEDGE
- Experiment dir: `/Users/Shared/Workspaces/AI/Claude/experiment/.ssh` (has id_ed25519)
- Experiment testbot: `.ssh/ids/testbot/` (has id_rsa — proves mixed key type detection works)
- OOSH_DIR = `/Users/donges/oosh`
- Working tmux pane: `claudeOpus2kTMUX:0.1` (oosh shell, cwd = experiment dir)
- Working tmpCursor dir: `/Users/Shared/Workspaces/AI/Claude/session/tmpCursor/`
- `private.get.sshDir` lives in `user` script, sourced by ossh
- Empty-param-shift bug (Issue #3) is pre-existing — `""` as first arg doesn't shift

## KNOWN ISSUES (pre-existing, not from this session)
- Empty param shift: `ossh get.public.id "" .ssh` — empty string doesn't trigger shift, sshDir ignored
- Config persistence: `config set CURRENT_SSH_DIR` doesn't survive subprocesses
- `line find ""` error when list.ids called with empty search pattern

## LESSONS LEARNED
- ALWAYS check `git diff` before and after modifying production scripts
- NEVER delete preset config blocks without understanding their purpose
- The WODA preset config in `user.init()` is critical infrastructure — restored after accidental deletion

## OBJECT.VERB MIGRATION STATUS
- **Round 1 COMPLETE**: 21 ossh wrappers + 4 completions, 5 user wrappers added
- **Round 2 PENDING**: Privatize old verb.object method names (make them internal-only)
- **Plan file**: See plan object-verb_migration_round_1 for full rename table
- New names tested: `ossh rights.fix`, `ossh key.get.name`, `ossh ids.list`, `ossh url.get`, `user groups.list`
- Tab completion confirmed working for all new names (e.g. `ossh key.` shows 8 methods)

## PENDING TASKS
- **Round 2**: Privatize old verb.object names (prefix with private. or remove)
- Fix empty-param-shift bug across ossh/user functions (Issue #3)
- Fix config persistence across subprocesses (Issue #2)
- Update usage text in ossh help (line 1410: still says id_rsa default)
- Add doc comments to new wrapper methods (currently one-liners without #comments)

## RECOVERY STEPS
1. Read this context file
2. Read `session/tmpCursor/SKILL.md` for role reference
3. Test via tmux pane `claudeOpus2kTMUX:0.1`
