# S1 Verification Gate — Suite Failures (dev, ooshShells:0.0 live-tmux run)

**Run by**: oosh-tester | **Date**: 2026-06-28 | **Host**: WODA.prod (v60211)
**Verdict**: GATE NOT MET — 4/7 suites red, 83 failures total. S3 stays BLOCKED.

## Per-suite counts
| Suite | Cases | Pass | Fail | Status |
|-------|-------|------|------|--------|
| config | 56 | 55 | 1 | 🔴 |
| c2 | 25 | 26 | 2 | 🔴 |
| otmux | 149 | 131 | 25 | 🔴 |
| hiveMind | 456 | 404 | 55 | 🔴 |
| prefix-idempotent | 4 | 4 | 0 | 🟢 |
| current-target | 5 | 5 | 0 | 🟢 |
| no-tmuxpane | 6 | 6 | 0 | 🟢 |

## Triage (real regression vs environment/test-harness)

**The 3 NEW clean-boot guards are GREEN** — prefix-idempotent 4/4, current-target 5/5 (live case-5 fired), no-tmuxpane 6/6. The sprint's targeted BUG7/9/A/B/C-ext/FEAT8 deliverables are verified.

The 4 legacy-suite reds are a MIX; categorized from log analysis:

- **hiveMind (55 fails) — REAL, 0 environment errors** in 334KB. Substantive legacy debt: missing completion functions (pane.focus/team.setup.oosh/team.setup.full/process.list/team.pull completions), missing role prompts (product-owner, developer), doc-signature drift (agent.monitor), consistency.audit rc=30, raw-tmux calls (2), un-delegated JSONL refs (35), fork sites without UUID capture (3). Some are live-host-state-sensitive (snapshot "Bad records" from dead ARON session, title='v60211.1blu.de' from real pane titles).
- **otmux (25 fails) — MOSTLY REAL** (16 stray 127/tty error-lines but most fails are assertions): copy-pipe-and-cancel binding, tree/tree.detailed session-filter, send→accept-edits doc, hiveMind.send delegation wiring, isClaudeCode ordering. Plus live-host sensitivity: pane.lock tests target non-existent `po:0.2` (`got ''`), titles overwritten by real enforcers (`got: v60211.1blu.de`). **NOTE: `expected >=1 enforcer, got 0` is MY new T-UNLOCK-KILLS test — wrong assumption (this tmux uses hook-based locking, not a background enforcer process). My test needs fixing, not the code.**
- **c2 (2 fails) — REAL**: `c2.functions.get found 0 functions` + `should find parameterTestScript.one`. Reproduces in BOTH live-tmux and non-tmux contexts. Accompanied by `/dev/tty: No such device` log noise (LOG_DEVICE=/dev/tty in subshell — possible BUG3-area link).
- **config (1 fail) — ENVIRONMENT-SENSITIVE**: `T-NOLOSS-1: config.save did not capture TRON_TEST_CUSTOM_VAR`. PASSED in my non-tmux Bash run (56/56), FAILED in ooshShells:0.0. Tests whether config.save harvests a bare-exported var; the BUG3 inert-save fix likely changed harvest semantics. Needs config-expert confirm: intended (inert save) vs regression.

**Caveat on baseline**: these legacy suites were NOT part of the expert's "all green" claim (expert ran the new guards, not full legacy suites). Most hiveMind/otmux fails look like PRE-EXISTING tech debt surfaced by running the FULL suites, not regressions introduced by the clean-boot sprint. Expert/PO triage needed to confirm none are sprint-introduced before S3.

## config — fail lines
```
  ✗ FAIL: config.save did not capture TRON_TEST_CUSTOM_VAR
```

## c2 — fail lines
```
  ✗ FAIL: c2.functions.get should find at least 6 functions, found 0
  ✗ FAIL: c2.functions.get should find parameterTestScript.one
```

## otmux — fail lines
```
  ✗ FAIL: copy-mode-vi should have copy-pipe-and-cancel binding
  ✗ FAIL: tree with session arg should show only that session
  ✗ FAIL: tree.detailed with session arg should show only that session
  ✗ FAIL: otmux.send should document accept-edits handling: otmux.send() # <target> <text...> # smart send: auto-detects keys, /commands, text+key combos
  ✗ FAIL: hiveMind should delegate to otmux send, got: 
  ✗ FAIL: should return 0 for Claude pane, got: 1
  ✗ FAIL: send should check isClaudeCode before accept-edits detection
  ✗ FAIL: expected '__test_lock_962973' got ''
  ✗ FAIL: allow-rename should be off after lock
  ✗ FAIL: unexpected title: ''
  ✗ FAIL: title not restored: expected '__test_lock_962973' got ''
  ✗ FAIL: expected [@test-sender pane] , got: ''
  ✗ FAIL: hiveMind.send should call otmux send
  ✗ FAIL: hiveMind.send.message should call otmux send
  ✗ FAIL: 1 hiveMind function calls in View layer
  ✗ FAIL: 1 source commands for Model/Controller files
  ✗ FAIL: expected title-two, got: v60211.1blu.de
  ✗ FAIL: expected title-three, got: v60211.1blu.de
  ✗ FAIL: mismatch: tree-only='Temple
  ✗ FAIL: attach.readonly exists but completion.target missing
  ✗ FAIL: single char → delivered: expected delivery; rc=0 changed=NO
  ✗ FAIL: prose text → delivered: expected delivery; rc=0 changed=NO
  ✗ FAIL: ws-padded prose → delivered: expected delivery; rc=0 changed=NO
  ✗ FAIL: CMM4: 5/8 pass, 3 fail (62%)
  ✗ FAIL: expected >=1 enforcer, got 0
```

## hiveMind — fail lines
```
  ✗ FAIL: hiveMind.pane.focus.completion.agentName should exist
  ✗ FAIL: hiveMind.team.setup.oosh.completion.session should be defined
  ✗ FAIL: private.hiveMind.get.role.prompt product-owner should return a value
  ✗ FAIL: private.hiveMind.get.role.prompt developer should return a value
  ✗ FAIL: hiveMind.team.setup.full.completion.session should be defined
  ✗ FAIL: title MISMATCH __test_hm_1008835:0.0: title='test-alpha' registry='test-alpha|1782658121'
  ✗ FAIL: title MISMATCH __test_hm_1008835:0.1: title='test-beta' registry='test-beta|1782658121'
  ✗ FAIL: title MISMATCH __test_hm_1008835:0.2: title='test-gamma' registry='test-gamma|1782658121'
  ✗ FAIL: registry OK but title='v60211.1blu.de' (expected 'test-expert')
  ✗ FAIL: process.list.completion.session not found
  ✗ FAIL: Missing or wrong header in snapshot
  ✗ FAIL: Bad records: 1: Temple|0.0|ARON|f814788a-daaa-4eb5-9e31-043688a46794|ARON|/var/dev/Workspaces/AI/Claude|claude-opus-4-6[1m]|claude
  ✗ FAIL: expected 'last 5 lines' in output
  ✗ FAIL: signature should be <name> <?lines:5>, got: hiveMind.agent.monitor() # <agentName> <?session> <?lines:30> # capture pane output for agent by name; searches all teams when no session given
  ✗ FAIL: consistency.audit failed with rc=30
  ✗ FAIL: status shows no UUIDs — discovery broken
  ✗ FAIL: only -1 callers — expected >= 3
  ✗ FAIL: 8 exceeds budget 7: 211:private.hiveMind.claude.processes() { # # list Claude processes with pane targets: pid|tty|paneTarget|title|args
  ✗ FAIL: 2 methods use inconsistent param names
  ✗ FAIL: 9 truncation patterns: 3568:          echo "  ${pane_target}: ${joinCmd}ing ${role} (${uuid:0:8}...)${model:+ model=$model}"
  ✗ FAIL: 1 mismatches:   ARON|1782653795@Temple:0.0: sessions.env=f814788a process=ccecd85f
  ✗ FAIL: hiveMind.team.pull.completion.host should be defined
  ✗ FAIL: completion should list hivemind.* directories
  ✗ FAIL: agent.restart.remote completions missing
  ✗ FAIL: 3 fork sites without UUID capture: L3075 L4182 L6681
  ✗ FAIL: agent.restart.remote must capture child UUID after fork
  ✗ FAIL: expected __test_resolve_b_1008835:0.1, got: ''
  ✗ FAIL: ambiguous resolve should return non-zero
  ✗ FAIL: 2 raw tmux calls — should use otmux wrappers
  ✗ FAIL: 35 JSONL references — should delegate to claudeCode
  ✗ FAIL: edit-approval prompt: expected permission, got queued (full: queued|enter|blocker)
  ✗ FAIL: bash-command prompt: expected permission, got queued (full: queued|enter|blocker)
  ✗ FAIL: accept-edits bar: expected accept-edits, got permission (full: permission|enter|blocker)
  ✗ FAIL: rate-limit message: expected rate-limit, got idle (full: idle|none|info)
  ✗ FAIL: subscription-limit message: expected subscription-limit, got permission (full: permission|enter|blocker)
  ✗ FAIL: active generation: expected active, got queued (full: queued|enter|blocker)
  ✗ FAIL: context-warning 15%: expected context-warning, got subscription-limit (full: subscription-limit|none|critical)
  ✗ FAIL: background-tasks overlay: expected overlay, got queued (full: queued|enter|blocker)
  ✗ FAIL: false-positive: code with rate-limit pattern: expected idle, got queued (full: queued|enter|blocker)
  ✗ FAIL: team.migrate must create session-scoped snapshot, not full teams.save
  ✗ FAIL: team.migrate must pass explicit snapshot path — no args = fallback risk
  ✗ FAIL: pane 0.0 title should contain mvc-alpha; got: 
  ✗ FAIL: audit found violations after team.setup (rc=2)
  ✗ FAIL: audit still broken after reconcile (rc=2)
  ✗ FAIL: team.migrate should validate sshHost with isSshHost
  ✗ FAIL: sweep.detect should have scrolled-history detection on idle path
  ✗ FAIL: history scan should capture 200 lines for scrolled markers
  ✗ FAIL: killed handlers: 2/3 store cleanups found
  ✗ FAIL: audit should catch stale S1 entry for __test_d3_1008835:0.9
  ✗ FAIL: audit should catch I8 violation for __test_d3_1008835:0.0
  ✗ FAIL: audit should catch I9 violation (@opus → @MacStudio)
  ✗ FAIL: title should be @v60211; got: v60211.1blu.de
  ✗ FAIL: sweep/status should check hivemind.state.env for override
  ✗ FAIL: only 4/8 sessions found (stdin consumption bug)
  ✗ FAIL: timed out or took too long: rc=124 elapsed=15s
```

