---
name: oosh-ctx-percent-is-free
description: OOSH "ctx N%" = FREE/remaining %, NOT used %. Cross-checked: context.read agrees with /context.
metadata:
  type: reference
---

OOSH tools (`scrumMaster` sweep, `claudeCode context.read`) report **`ctx N%` = FREE/remaining percent, NOT used percent.** So `ctx 33` = 33% free = **67% used**.

**Verified 2026-07-03 (SM 2-way measure of ARON):** OOSH ctx 33% + context.read 33.0 ↔ `/context` Free 32.7% / Messages 63.7% → they MATCH once you read OOSH as free%. So `context.read` is trustworthy (resolves the old woda worry that it lies).
**How to apply:** to get USED% from OOSH, compute `100 - ctx`. Never confuse the two. And ARON cannot self-measure context (42) — a peer runs `/context` + OOSH and compares. See [[research-first-then-ask]], [[clean-perspective-of-truth]].
