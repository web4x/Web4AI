# Restore Comparison Report
**Agent**: oosh-tester
**Date**: 2026-02-16
**Context**: Feb 12 `git pull --rebase` destroyed commit `17340f6`. Restored files extracted to `/Users/donges/oosh/restore/`.

## Summary

| File | Lost Methods | Changed Logic | Already Recovered | Verdict |
|------|-------------|---------------|-------------------|---------|
| otmux | 0 | 1 (tree agent detection) | 0 | Expert tasked (1101Z) |
| claudeCode | 3 | 4 | 0 | **HIGH — needs work** |
| scrumMaster | 0 | 0 | 2 (subscription, dashboard) | **Current is BETTER** |
| ossh | 0 | 12+ (sshDir param, key detect) | 0 | **HIGH — functionality regression** |
| user | 0 | 8+ (sshDir param, key detect) | 0 | **HIGH — functionality regression** |
| hiveMind | 2 (sonnet1, pane.titles) | many | 15+ new methods | **Current is BETTER — skip** |

## Per-File Analysis

---

### 1. otmux

**Lost: Three-level tree view (agent detection sub-lines)**

The restored `otmux.tree()` includes agent detection code that shows session name + UUID as a third level under each pane. The current version has only the fast two-level tree.

**Status**: Already assigned to Expert as task 1101Z — create `otmux.tree.detailed()` as a separate method, keeping the fast `otmux.tree()` unchanged.

**Action needed**: None — Expert is on it.

---

### 2. claudeCode — **NEEDS WORK**

#### Lost Methods (3)

| Method | Purpose | Priority |
|--------|---------|----------|
| `claudeCode.list.named()` | List only sessions with custom names (from /rename) | MEDIUM |
| `claudeCode.session.name()` | Get session name by UUID (customTitle or firstPrompt) | HIGH — used by otmux.tree.detailed |
| `claudeCode.context.check()` | Full health check: %, velocity, log to burn-log, alert if low | HIGH — SM needs this |

#### Changed Logic (4)

| Area | Restored (better) | Current (worse) | Priority |
|------|-------------------|-----------------|----------|
| `FORCE_COLOR=2` | Auto-sets 256-color for non-truecolor terminals (fixes Apple Terminal) | Missing — Terminal.app renders black-and-white | MEDIUM |
| `claudeCode.session.id()` | Method 3: matches pane title to JSONL custom-title (multi-agent aware) | Missing Method 3 — jumps straight to "most recent JSONL" fallback | HIGH — causes wrong session resolution in multi-agent |
| `claudeCode.context.jsonl()` | Accepts `<pane>` param for per-pane JSONL resolution (centralized) | No pane param — callers duplicate pane-resolution logic inline | MEDIUM (DRY violation) |
| `claudeCode.start()` | Uses `$CLAUDE_CMD` (safe) | Adds `--dangerously-skip-permissions` | **CRITICAL — security regression** |

#### CRITICAL: `--dangerously-skip-permissions` in current

The current `claudeCode.start()` adds `--dangerously-skip-permissions` to every agent launch. The restored version does NOT have this. This is a PO-enforced violation — no agent may skip permissions. **Fix immediately.**

---

### 3. scrumMaster — **Current is BETTER**

The current version has improvements the restored version lacks:

| Feature | Restored | Current |
|---------|----------|---------|
| Session default | Hardcoded `cursorOrchestrator` | Dynamic from `hivemind.active.team` file |
| subscription/subscription.json | Missing | Present (re-implemented) |
| measure.health() PDCA cycle | Missing | Present (new) |
| Metrics file naming | `.env` | `.scenario.env` |

**Action needed**: None. Current scrumMaster is strictly better.

---

### 4. ossh — **FUNCTIONALITY REGRESSION**

The restored version has significant functionality the current version lost:

#### Lost Functionality

| Feature | Restored | Current | Impact |
|---------|----------|---------|--------|
| `sshDir` parameter | All methods accept optional `<?sshDir>` for non-default .ssh dirs | Hardcoded `~/.ssh` everywhere | **Cannot manage multiple .ssh directories** |
| `private.detect.ssh.key()` | Auto-detects key type (ed25519, ecdsa, rsa, dsa) | Assumes `id_rsa` only | **Breaks on modern ed25519 keys** |
| `private.detect.ssh.key.type()` | Returns just the key type name | Missing | Used by other methods |
| `private.get.sshDir()` | Centralized sshDir resolution with default | Missing | DRY helper |
| Key generation | `ssh-keygen -t ed25519` (modern, secure) | `ssh-keygen` with no type (defaults to RSA) | **Security regression** |
| `ossh.parameter.completion.sshDir()` | Tab-completes sshDir paths | Missing | UX loss |

#### What Current Version Has That's Better

| Feature | Detail |
|---------|--------|
| Object.verb naming | Public API uses `ossh.key.push()` instead of `ossh.push.key()` |
| Private/public separation | Old implementations made private, clean public wrappers |
| Method signatures | Better docstrings |

**Action needed**: Merge restored functionality (sshDir param, key detection, ed25519) INTO the current naming structure. The current naming is correct OOSH style — the restored functionality needs to be retrofitted.

---

### 5. user — **FUNCTIONALITY REGRESSION**

Same pattern as ossh — the restored version has `sshDir` param support and key detection that the current version lost.

| Feature | Restored | Current |
|---------|----------|---------|
| `sshDir` parameter | `user.init()`, `user.ssh.create.folders()`, `user.in()` accept sshDir | Hardcoded `~/.ssh` |
| `private.detect.ssh.key()` support | Used for flexible key handling | Assumes `id_rsa` |
| Key type | Ed25519 | RSA (default) |

**Action needed**: Same as ossh — retrofit restored functionality into current naming.

---

### 6. hiveMind — **Current is BETTER — Skip**

1304 changed lines. The current version has ~15 new methods the restored version lacks:

**New in current (not in restored):**
- `hiveMind.delegate()` — file-based task delegation
- `hiveMind.team.register/remove/switch/active()` — multi-team management
- `hiveMind.peer.compact()` — seamless peer compact trigger
- `private.hiveMind.find.agents.dir()` — dynamic agent directory resolution
- Dynamic session defaults (from active team file, not hardcoded)
- Interval parameter for sweep/monitoring

**Lost from restored (minor):**
- `hiveMind.team.sonnet1()` — start Sonnet 1M context session
- `hiveMind.pane.titles()` — set pane border titles from registry

**Action needed**: None. Current hiveMind is strictly better. The two lost methods are low-priority convenience functions.

---

## Priority Ranking

| Priority | File | What to Fix |
|----------|------|-------------|
| **CRITICAL** | claudeCode | Remove `--dangerously-skip-permissions` from `claudeCode.start()` |
| **HIGH** | claudeCode | Restore `session.name()`, `context.check()`, session.id Method 3 |
| **HIGH** | ossh | Retrofit `sshDir` param + `private.detect.ssh.key()` + ed25519 into current naming |
| **HIGH** | user | Retrofit `sshDir` param + key detection into current naming |
| **MEDIUM** | claudeCode | Restore `list.named()`, `FORCE_COLOR=2`, centralized `context.jsonl(<pane>)` |
| **LOW** | otmux | Expert already tasked (1101Z) |
| **SKIP** | scrumMaster | Current is better |
| **SKIP** | hiveMind | Current is better |

---

## Recommendations for Tron

1. **Immediate**: Fix `claudeCode.start()` — the `--dangerously-skip-permissions` flag is a PO-level violation
2. **Expert task**: Restore claudeCode lost methods (session.name, context.check, list.named) — needed by otmux.tree.detailed and SM monitoring
3. **Expert task**: Merge restored ossh+user sshDir/key-detect functionality into current object.verb naming structure — do NOT revert the naming, retrofit the features
4. **No action needed**: scrumMaster (current better), hiveMind (current better), otmux (already tasked)
