---
name: shipping-needs-version-bump-sw-js-cache-bump
description: "A change is NOT shipped to Tron's PWA until BOTH package.json version AND sw.js CACHE_NAME are bumped — without both, the update banner doesn't fire and Tron's device stays on old code"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

A code commit alone does NOT reach Tron's phone. Every shipped change MUST be accompanied
in the same commit set by:
1. **`package.json` version bump** (semver), AND
2. **`sw.js` `CACHE_NAME` bump** to match (e.g. `rawbin-v0.5.23`).

Without BOTH, the PWA update banner does not fire on Tron's device → his cached SW serves
the old bundle → he never sees the change, even though the server has it.

**Why:** Tron flagged this 2026-05-29 — "all S16 is implemented but version not bumped so
no update on the pwa." S16 (T110–T117) had been committed + tests green but didn't reach
his phone. The deploy mechanism + per-request version (T94) report the on-disk version,
but the *client* update detection compares vs the SW cache name. If the SW cache name
isn't bumped, no update is detected and the new bundle never activates on his device.

**How to apply (hard rule):**
1. PO directive on every fix/feature delegation: include "version bump + sw.js cache bump"
   in the implementation checklist; no commit is "shipped" without both.
2. PO verification: after any deploy, curl `/api/health` AND `/api/config` for version,
   AND grep `sw.js` for `CACHE_NAME` matching — both must be the new version.
3. Planner consistency rule: "impl-done" / "testing" status MUST NOT be set on a task
   whose commits lack the version + sw.js bumps. Treat it as a hard pre-condition before
   the QA gate.
4. Tester check: include "PWA update banner fires on new version" as standard AC for any
   user-facing change.

Pairs with [[t94-version-update-bar]] (per-request version on the server side) and the
SW versioning rule from learnings #40 — both layers must move together.
