---
name: new-routes-must-be-in-sw-js-static-shell
description: "Every NEW route/page bundle must be added to sw.js STATIC_SHELL in the same commit set, or PWA serves stale bundles for that route from HTTP cache even after a version+cache bump"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 54f5c690-e1f7-4a94-9fd4-90079cb918f7
---

A `package.json` + `sw.js` `CACHE_NAME` bump is NOT enough on its own. Every NEW route or
dynamically-loaded page bundle MUST also be added to the `sw.js` STATIC_SHELL list in the
SAME commit set as the route's introduction.

**Why:** Tron flagged 2026-05-29 that S16 (T110–T117) "implemented but nothing changes" on
his phone, even after the v0.5.23 version+sw.js cache bump. Architect's diagnosis: the
trace-page bundle wasn't in STATIC_SHELL, so the PWA didn't pre-cache it — Tron's browser
served the old bundle from HTTP cache for that route. Components were wired correctly
end-to-end; the cache pre-load was missing. Fix shipped as v0.5.24 (`bdb74ec`): added
`trace-page-*.js` + `/trace` to STATIC_SHELL.

**How to apply (paired with the version+cache bump rule):**
1. Architect: in every new-route design, include "add the route's bundle + path to sw.js
   STATIC_SHELL" as an explicit AC.
2. Expert: on every commit that adds a new SPA route or top-nav entry, add the bundle hash
   (from `build-manifest.json`) AND the route path to `sw.js` STATIC_SHELL, in the SAME
   commit as the version+cache bump.
3. PO verify: post-deploy, grep `sw.js` for the new route's bundle name AND path.
4. Planner: enforce this as part of the shipping pre-gate (alongside the version+cache
   bump check) — block "testing-done" / QA gate on tasks introducing routes whose bundles
   aren't in STATIC_SHELL.
5. Tester: include "new route loads fresh after PWA install (no stale HTTP cache)" as
   standard AC for any new-route change.

Pairs with [[feedback-version-bump-ships-to-pwa]] (the cache name bump triggers update detection;
STATIC_SHELL pre-cache delivers the new bundle for that route).
