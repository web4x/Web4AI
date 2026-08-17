# Purified: robbin-expert Phase-1 gating learnings (R40.18 / tag / deploy arc, 2026-08-17)

**Banked by:** robbin-expert → ARON (Temple:0.0) + trainer, for purification into the role SKILLs.
**Why git-tracked here:** robbin-expert's source memories live in `/root/.claude/.../memory/` (indexed in MEMORY.md under Gating). Per `agent-rewind.md` §"MEMORY-DIR REVERTS ON A DEEP OPTION-2", a deep conversation-restore reverts an agent's `/root/.claude` tool-edited memory — so this git-tracked capture is what makes them **rewind-immune**. This survives robbin-expert's next rewind; full SKILL propagation follows via the agent-trainer.
**Provenance caveat (measure-honesty):** purified from robbin-expert's relay message, NOT independently verified against its `/root/.claude` source files (ARON lacks /root read access). Trainer/tester with /root access should reconcile against the source memories before final SKILL weave.

---

## F1 — assert-the-rendered-artifact-not-a-proxy
A payload / DOM / self-check shares the defect's blind spot — **assert the RENDERED `innerText` / screenshot @device**, not a proxy. `payload ≠ pixels` false-greened THREE agents on ONE defect (expert=API, PO=relay, tester=textContent+width-proxy — each blind to a string-slice). The root was a LAYER DEEPER than every guess: `rb-object-item.generateName` = `words.slice(0,5)+'…'` — not CSS, not the slot-label. **Measure the actual render; fix where the string is produced.** *(same family as visual-features-gate-by-pixel / verify-by-screenshot-not-DOM.)*

## F2 — prove-the-success-path-in-scratch
An unexercised success path certifies nothing ("next deploy proves it" = silently-broken-for-3-releases). **Exercise CREATE + INVERSE + IDEMPOTENT + edge in a THROWAWAY scratch** (clone/repo, `rm -rf`'d) = zero live/prod pollution. Proved the tag-hook + caught R27.2 + R40.11-slice-4 this way. *(same family as prove-success-path-in-scratch / server-change-needs-boot-check / don't-force-prod-mutation.)*

## F4/F7 — escalate-dont-self-redesign
A bounded task that uncovers a bigger design (found on scratch PRE-prod — e.g. `deploymentRefs` 3-readers → R40.35) → **escalate + HOLD; route the scope decision to architect/PO. Do NOT absorb unbounded scope.** *(same family as single-minter-dispatch / feature-bugs = architect-diagnoses; a bounded worker never silently expands its own charter.)*

## live-on-advance-boundary (Web4RawBin ref)
A **server-routed change = LIVE** (real publish → singleton emit); a **separate-process CLI-tick / file-edit = persisted + RELOAD-only** (0 `fs.watch`). **State the boundary to Tron explicitly; never claim an unprovable "live".** R40.44 / R40.45. *(same family as gate-never-real-saves-on-served-repo / measure-a-stable-state.)*

---

**Routing:** ARON (keeper) supplies this purified canon; the **agent-trainer** weaves it into the role SKILLs' read-path (F-family map in `cross-agent-law-families.md`). NEVER forget TRON CMM4.
