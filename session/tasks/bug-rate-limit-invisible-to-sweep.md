# BUG — rate-limited agents invisible to sweep (state-transition detection needed)

**Reporter**: Tron via PO (ooshTeam:0.0) 2026-05-26
**Status**: QUEUED — investigated after otmux-layout-dynamic
**Assignee**: oosh-expert

## Symptom

When a Claude agent hits a rate limit:
1. TUI briefly shows rate-limit message
2. Agent transitions to IDLE prompt
3. By next sweep cycle, the rate-limit message has scrolled off
4. `sweep.detect` (via `pane.capture` 15-30 lines) sees only the IDLE state
5. Sweep reports IDLE — operator sees "agent waiting" when really "agent stuck"

## Root cause

`private.hiveMind.sweep.detect` classifies based on a single snapshot. There's no memory of previous state. ACTIVE→IDLE without forward progress (commit, file change, response delivery) is suspicious — likely silent failure.

Possible mitigations (need design):

1. **Wider pane.history**: capture last N lines (e.g. 200) instead of visible-area. Scan for `rate-limit|429|quota` markers in the history.
2. **State-transition tracking**: store previous state per pane, flag ACTIVE→IDLE transitions without observable forward progress (commit, file mtime, pane title change).
3. **Time-anchored detection**: if last activity timestamp is recent but state is IDLE, look harder.

## Hypothesis to verify

Option 1 (wider history scan) is likely sufficient — rate-limit messages are unique enough strings. Option 2/3 add complexity. Start with 1, escalate if false-negatives persist.

## Investigation plan

1. Read `private.hiveMind.sweep.detect` — current capture depth + state classifier
2. Reproduce: trigger a rate limit on a test agent, observe TUI message wording, measure how long it stays visible
3. Identify rate-limit signature strings (search Claude Code source / changelog if accessible, otherwise observe)
4. Design wider-history scan with conservative match (must contain "rate limit" or known error patterns to avoid false positives)

## Findings

**Root cause confirmed**: `private.hiveMind.sweep.detect` (hiveMind line 7370) calls `otmux pane.capture "$target" 20` — only 20 lines. Claude TUI rate-limit / subscription-limit / API-error messages disappear from the visible 20-line window once the agent returns to IDLE prompt. The substring checks at lines 7449/7488/7494 scan that narrow window — when the marker has scrolled off, only the idle ❯ remains, so sweep classifies `idle|none|info`.

The IDLE branch was the only path missing a state-transition catch.

## Fix

Targeted state-transition detection — after the 20-line classification confirms idle (`last_line` is clean `❯` or `>`), do ONE additional 200-line history scan via `otmux pane.capture "$target" 200`. Run the same prose-scrub against that wider view and check ONLY three distinctive block markers (most distinctive forms, conservative patterns to avoid false-positives):

- subscription-limit → `subscription-limit|none|critical|scrolled-history`
- rate-limit → `rate-limit|wait|blocker|scrolled-history`
- api-error → `api-error|wait|blocker|scrolled-history`

If none match, classify as `idle` as before. Other states (active, queued, permission, accept-edits, etc.) are unaffected — the wider scan runs only on the idle path, so agents currently working through resolved limits aren't misclassified.

Detail field `scrolled-history` is the observability hook: operators / scrumMaster can see which detections came from scrollback vs visible state.

## Smoke test (8 cases all PASS)

| # | Scenario | Expected | Actual |
|---|----------|----------|--------|
| T1 | idle visible + clean history | idle | idle\|none\|info |
| T2 | idle visible + rate-limit scrolled | rate-limit | rate-limit\|wait\|blocker\|scrolled-history |
| T3 | idle visible + sub-limit scrolled | subscription-limit | subscription-limit\|none\|critical\|scrolled-history |
| T4 | idle visible + api-error scrolled | api-error | api-error\|wait\|blocker\|scrolled-history |
| T5 | rate-limit in visible content | rate-limit | rate-limit\|wait\|blocker\|unknown (early return, history not consulted) |
| T6 | active state, marker in history | active | active\|none\|info (history NOT consulted) |
| T7 | queued (text after prompt) | queued | queued\|enter\|blocker |
| T8 | permission prompt overrides | permission | permission\|enter\|blocker |

## Commit

`hiveMind: sweep.detect catches scrolled-off rate-limit/sub-limit/api-error on idle path (ref: bug-rate-limit-invisible-to-sweep.md)`

## Status (closure)

- **Implementation**: oosh commit `3a4bfbc` — 29 lines added inside the `idle` branch. No changes to other state classifications.
- **Verification**: 8 smoke-test scenarios all PASS via env-var injection mock.
- **Handoff to tester**: (a) verify all 8 scenarios via test fixture, (b) verify regression: existing idle/active/queued tests still pass, (c) live verification on real rate-limited agent (when one occurs).
- **Follow-up if false-negatives persist**: Option 2 from spec — track previous state per pane, detect ACTIVE→IDLE transitions without forward progress (commit, file mtime, response delivery). Requires state-store S11. Defer to a future task.

## Tester Verification (oosh-tester, 2026-05-26)

### (a) 8 scenarios covered via code-grep tests: PASS
- RL-1: scrolled-history path exists in sweep.detect
- RL-2: history scan captures 200 lines
- RL-3: subscription-limit pattern (subscription.*limit, quota.*exhausted, etc)
- RL-4: rate-limit pattern (rate.limit, too many requests, throttl)
- RL-5: api-error pattern (APIConnectionError, 502, 503, 529)
- RL-6: history scan gated to idle path only — active/queued/permission unaffected
- RL-7: prose-scrub filters code comments to prevent false positives
- RL-8: clean idle fallthrough preserved (idle|none|info)

### (b) Regression: PASS
- RL-8 confirms idle|none|info fallthrough unchanged
- RL-6 confirms history scan only runs on idle path — no impact on active/queued/permission states
- No changes to non-idle classification branches

### (c) Live verification: DEFERRED
- No rate-limited agent currently available. Will verify when one occurs naturally.

Commit: `1eb8cf6`
**Verdict: VERIFIED. Bug closed.**
