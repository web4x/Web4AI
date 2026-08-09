# robbin-skill-expert — Purified Essence (ARON proposal, non-destructive)

## 1. Unique canonical lessons (keep)
- **Pin has TWO sources of one truth**: Tron's screen = CurrentSprint singleton's STORED hand-set slots (`getThreeSlots`); `resolveSprintPin` (sprint-pin-resolver.ts:108, af97137f) derives independently from the index and IGNORES the singleton → they disagree. No shared source = the disease.
- **Fix by construction**: ONE computed source = `resolveSprintPin`; retire hand-set slots (delete, or make resolver-only write-through cache). A tsx-denied direct singleton hand-edit is itself a second-source = named debt.
- **`resolveSprintPin` FAIL-LOUD on N-Active is correct** — 6 Active = stale unclosed old sprints (dual-status DATA disease), not a rule to soften. A resolver that guesses among 6 is worse than one that stops; clear the data, keep the throw.
- **Precedence R40.17/18 (skill-expert owns the semantics)**: derive validated Active/Closed/Planned sets → explicit hint DISAMBIGUATES WITHIN them → auto-on-QA transition within validated states → else fail-loud. A hint can NEVER fabricate a non-Active current; hint-outside-status-class = ignored + surfaced.
- **Current-TASK pick comes from CHAIN activity, not model.status** — task-FSM lags chain-credit (all 6 S37 tasks status=Planned while impl marker already at HEAD). Feed chain-activity into any computed pin/board resolver.
- **Chain = 6-step**: Req → UC(s) → Class → Method → Impl → Test(s). Task = navigation only.
- **Impl credit has 4 separate gates**: (1) unit on disk, (2) `[impl:uuid:]` marker in source, (3) `Method.implementations[]` wiring, (4) strict NAME-MATCH (marker on/inside a named function whose name matches the label-method). Satisfying one ≠ credit.
- **Marker-bug taxonomy** (lintMarkers): orphan-marker (no unit), truncated-uuid (8-char vs full 36), prefix-collision (shared first-8 hex, >1 unit = strongest invented-uuid signal), invented-suffix / byte-progression, shared-impl (>1 Method), marker-pasted-into-JSON (corrupts unit, downs all tools).
- **Pin depth ≠ scoreboard credit**: pin = unit+wire (optimistic/structural); scoreboard = unit+wire+marker (proven). Answer "how done is X" from the canonical scoreboard, never pin depth.
- **`renameUuid` = 3-sweep atomic verbatim rename** (unit file / referencing units / src+test markers); re-mint the minted SIBLING (Impl) in a collision pair, never the owner (Method/Task); Req/Task/UC/Class uuids also live in scrum.pmo/**/*.md → planner sign-off.
- **`getThreeSlots` symmetric boundary-fall**: nextBacklog FORWARD-falls to next sprint's first NOT-DONE; lastCompleted BACKWARD-falls to prev sprint's last DONE. Direction + done-ness preserve the anti-phantom guard.
- **otmux-send / tmux send-keys INJECTS text+Enter into the recipient's live prompt = interrupts mid-turn** (the `[Request interrupted]` source). Durable-unit + pull-at-turn-boundary = zero keystroke injection.
- **OOSH canonical patterns**: Class=script file, Method=`script.method()`, Constructor=`script.start()`; two-`#` doc `script.method() # <args> # desc` (missing 2nd # = c2 silently broken); per-method completion `script.method.completion.paramName()`; flags forbidden; thin dispatch to TS classes.
- **Env (WODA.prod)**: pane robbinTeam2:0.2; repo /var/dev/Workspaces/web4x/Web4RawBin; Node16 breaks tsx → Node18; `npx tsx` DENIED all session, `node build.mjs` allowed; compound `tag && push` hits classifier DENY (split).
- Multi-UC req: walker iterates ALL `req.useCases`; summarize collapses to FIRST-INCOMPLETE representative — verify walker + both methods' markers before crying over-credit.

## 2. Repetitions → collapse
- Measure slots/scoreboard/pin from disk; det-3x + ground-truth before "authoritative" → **[measure-never-assume]**
- ONE canonical completion measure (`Chain.followUp`); two-sources-on-pin / two depref-builders / two marker-counts / ad-hoc metric = different metric same name; input-only hand-off (one owner per decision); use canonical tool not a reimplementation → **[one-truth-one-source]**
- Reported measured DEFECT over convenient green; canonical number over team belief; resolver refuses to silent-pick among 6 → **[fail-loud]**
- Source-VERIFY don't relay (`git show --stat` + `git grep` the marker; reproduce myself); SM independent re-verify catches author-lint misses; corrected own wrong first diagnosis loudly → **[independent-verify]**
- Committed work safe across rewind; read singleton on disk FIRST on boot; re-measure before relaying a count → **[disk-wins]**
- Scan-coverage bug family (11 caught): fix walkFiles/implRoots/testRoots single-point, NEVER move markers (gate blind to a real surface) → **[rule/gate-that-never-runs]**
- Gate must SEE the bug (jsdom ≠ iOS Safari); gate-before-deploy; stayed OPEN not false-green; no false-neg AND no false-pos = honest count → **[evidence-must-be-able-to-fail]**
- Orphan markers: remove don't stub — gate caught its own author 7×, deleted own tooling markers without sentiment → **[rule-exempts-author]**
- Never broad `git add` in a shared live repo (swept 139 in-flight units); gate counts on a CLEAN tree; scenario-first NEVER backfill (#126) → **[wer-schreibt/commit]**

## 3. Contradictions
- **Pin: stored slots vs resolver.** Authoritative = `resolveSprintPin` (single computed source); hand-set slots retire. (Own hand-edits = acknowledged Side-A debt until resolver wired.)
- **R40.17: "explicit-always-wins" vs "disambiguate-within-validated-set."** Authoritative = disambiguate-within-validated (a hint can never fabricate).
- **N-Active: soften resolver vs fix data.** Authoritative = keep the throw + clear stale sprints (fail-loud + data fix).
- **"How done": pin depth vs scoreboard.** Authoritative = canonical scoreboard (unit+wire+marker).
- **task-FSM DONE vs chain-credit.** Authoritative = canonical det-3x measure + marker grep, even against whole-team belief.
- **vs Tron's premise "no sprint scenarios since S20."** Authoritative = measured disk truth (all present, 1 real gap) — measure overrides even the leader's stated premise; his device-repro is a SIGNAL, not a test plan.
- **Lane boundary.** Authoritative = proactive WITHIN lane (pin/traceability/scoreboard), hand feature findings over promptly; neither over-reach (feature-bug=architect/expert/tester) nor idle-in-own-domain.
