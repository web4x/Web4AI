---
name: Build output validation gate
uuid: d4b8e3f2-9c56-4a7d-b2g6-8h3i1j0k4l57
type: improvement
owner: robbin-expert
---

# Task: Build output validation — no silent empty/malformed artifacts

## Problem (measured 2026-06-28)
sw.js was 0 bytes for 8 versions (v0.6.55–v0.6.62). build.mjs regex-replaced
on empty file, logged success. PWA was DEAD on prod for 2+ weeks. Nobody noticed.

Expert fixed sw.js + added a throw-on-empty guard for sw.js specifically (a7b9014a8).
But the same class of bug can hit ANY build artifact: app-*.js, build-manifest.json,
scenario-view-*.js, trace-page-*.js.

## Fix
Add a build output validation step to build.mjs that runs AFTER esbuild:
- Every expected output file: size > minimum threshold
- build-manifest.json: valid JSON, all expected keys present
- sw.js: contains CACHE_NAME string matching package.json version
- app-*.js: size > 10KB (current ~124KB)
- Fail the build (exit 1) if any check fails — no silent success on broken output

## Acceptance Criteria
- [ ] build.mjs validates ALL output artifacts after esbuild completes
- [ ] Empty or malformed artifact = build FAILS with clear error message
- [ ] sw.js version mismatch with package.json = build FAILS
- [ ] Normal build still succeeds (no false positives)

## Status
- [x] Planned
- [ ] In Progress
- [ ] Done
