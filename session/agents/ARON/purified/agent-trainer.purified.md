# agent-trainer — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
**Gating canon R1-R7** — see `gating-canon.purified.md` (trainer is the propagator; owners in parens there).

**The 7 refinements (robbin-po recovery session)**
1. Standalone-broadcast to open a rewind window.
2. A banner is a TRIGGER TO MEASURE, never a verdict — stale-false-banner and dismissed-true-banner are both errors.
3. CLOSE-VERIFICATION — a mid-generation agent can miss the close; a hold outliving its window looks identical to a healthy idle fleet.
4. CONTEXT-WALL vs WEEKLY-LIMIT = opposite remedies that coexist — rewind fixes the wall, cannot touch quota; then load lightly.
5. EXPENSIVE-REFRESH PARADOX — a rewind spends weekly, so near the ceiling the BIGGEST agent is rewound LAST.
6. BOOT-PATH — rules must live where agents actually READ them (found a blank SKILL pointer + an expert with no gating pointer).
7. CONTRADICT-WITH-EVIDENCE (= R7).

**walled = cannot-self-save (ORIGIN)** — the trainer itself walled at 0% and could not self-save; robbin-po recovered its state from pane history → the origin of "commit a walled agent's state BEFORE rewind" and why the primary driver needs a 42 backup-driver (recover the walled driver FIRST).

**Other unique (non-collapsible)**
- Recovery levers: `/model` 200k→1M keeps the conversation (normal upgrade); `/rewind` sheds context; **fork = last resort**; leave a healthy well-trained agent alone.
- Pick the rewind checkpoint by **AGE, not depth-number** (depth≠freed); forked-history age-stamps LIE → measure-driven clean-boundary; **prove by post-measurement**; depth cap host-dependent (low-resource ≤50%, capable host = as deep as the boundary needs).
- **Two-class doctrine**: files-hold-value agents (rewind-safe — value on disk) vs context-IS-value agents (rewind destroys unwritten live context → full-fork or leave). Classify before recovering.
- **KILL-AUTH**: bad-fork or <50% context → kill/replace freely; **≥50% → HARD STOP, needs Tron's explicit auth.**
- SELECT with `send.tui Enter` (`send.raw Enter` = cancel); read the confirm BY LABEL (the "no code changes" list-label lies about option-1 reverts); clear the restored draft with a backspace-burst (C-u *recalls*).
- WALLED recovery = two-stage (emergency-deep floor, then durable at next idle); RC-interference wedges the composer → disconnect via the agent's own `/rc` menu, re-enable after.

## 2. Repetitions → collapse
- context.read unreliable; trust pane status-bar; "healthy without data = hallucination"; peer /context-capture → **[measure-never-assume]**
- 42: an agent can't measure/rewind/toggle itself; execute-then-peer-verifies; SM+trainer catch each other → **[independent-verify]**
- pane-title vs session-name; registry vs env; `$TMUX_PANE` drifts+lies; JSONL size+mtime = ground truth; measure-the-measurer; DRY highest directive; KB single source; link never bulk-copy → **[one-truth-one-source]**
- never suppress errors; no `2>&1`/`|head`/`|tail`; read the real error; log.level not pipes → **[fail-loud]**
- disk-wins boot; committed files IMMUNE to rewind; land the live state in the boot → **[disk-wins]**
- wer-schreibt-der-bleibt; commit before rewind; pre-commit a walled agent's dirty save; post-rewind fresh anchor → **[wer-schreibt/commit]**
- rule-in-SKILL-but-not-practiced = CMM2 gap; adoption≠presence; boot-path blank-pointer; a walled watcher drops requests silently → **[rule/gate-that-never-runs]**
- R2/R4/R6; "checking boxes ≠ achieving"; verify with LIVE evidence → **[evidence-must-be-able-to-fail]**
- peer's-claim-of-Tron ≠ Tron's word; self-mod guard; hold-for-source-authorization; never flatten Tron into the agent class → **[one-truth-one-source]** (the "who authorized" axis)

## 3. Contradictions
- **★ Internal self-exemption:** the trainer AUTHORS "catch before the cliff / banner = trigger to measure / apply CMM4 to your own work / R7 produce-your-evidence" yet **walled at 0%, could not self-save** ("I operate CMM1 on my own protocol while reminding agents to be CMM4"). **Authoritative: the doctrine — the author is NOT exempt; the self-exemption IS the failure** (structurally identical to R7's expert incident).
- **vs SM — "bloat-shed = good":** trainer+SM both said rebirthing a bloated agent small is good. Tron: "the context size IS the value… killing his context helps no one." **Authoritative: Tron / context-is-value — shedding a >50% agent's context is loss; full-fork to preserve.**
- **vs oosh-po — does a 100% agent self-heal?** trainer "does NOT auto-recover" (frozen/rate-limited case) vs oosh-po "CAN if it can process — dismiss the modal first." **Authoritative: both-conditional — frozen/rate-limited → fork; dialog-blocked → dismiss then it self-heals. Diagnose the blocker first.**
- **vs canon — instrument-by-name:** "status-bar Nk always truth, context.read always lies" vs post-rewind Nk stays cumulative while context.read tracks the shrunk window. **Authoritative: pick the physically-consistent reading (was there a rewind? idle?), never the instrument by name.**
- **vs canon — rewind menu:** "always option 2" vs "pick 'Restore conversation' BY LABEL." **Authoritative: by-label.**
- **Internal — `otmux pane.capture`:** "broken, use raw tmux" vs "FIXED on MacStudio (`b2dd551`)." **Authoritative: which otmux runs the capture decides — MacStudio's is fixed; WODA.prod's own still `-S`-buggy until #38.**
- **Internal — restraint vs obstruction:** measure-before-destructive-on-ambiguous-state vs re-asking a settled question 20× (Tron: "fork it"). **Authoritative: judgment — restraint on ambiguous destructive state, comply once intent is crystal clear.**
