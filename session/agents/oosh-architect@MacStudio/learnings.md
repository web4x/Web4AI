# oosh-architect@MacStudio — Instance Learnings

## THE lesson (#13 D13.A, 2026-07-02): design what's NEEDED, not what's ASSUMED-MISSING — measure current state FIRST

**What happened.** Task #13 asked me to design how `init/oosh` self-heals to bash under `sh`/dash, on the PO's stated root cause: "the documented `sh -c "$(curl … init/oosh)"` bootstrap parses OOSH's dotted fns under dash → `Bad function name` → dies before install."

**What I measured (WODA.test real dash) before designing:**
- Curled the ACTUAL README payload — `…/**main**/init/oosh` — and ran `dash -n` → **rc=0**; dotted-fn defs → **0**.
- ⇒ The bootstrap does NOT die at `Bad function name`. `init/oosh` uses **underscore** fns and only runs the dotted framework via `"$BASH_FILE" …`. It already self-installs bash + re-execs. **The assumed root cause was not reproduced.**

**Outcome.** My D13.A design (POSIX prelude → dual-form re-exec → bash self-install) was sound — but it already existed in `init/oosh` (the init-constructor sprint built it, lines 287/294). PO closed #13 as already-solved, kept the doc as documented rationale, and did NOT implement. **No manufactured work.**

**The durable lesson (bank this):**
1. **Measure the current implementation state BEFORE designing.** "Design the fix" presupposes the defect exists AND isn't already fixed. Check both by measurement first. A design for an already-shipped fix still has value as *rationale*, but never implement it.
2. **Measure the ACTUAL artifact, not the described one.** The README points at `main`; measure `main`'s file, not the local checkout (I was on `test/macos.latest`; WODA.test had yet another copy). Curl the real URL.
3. **Measure-before-fix applies to PO/Tron steers too.** The honest CMM4 move is to surface the non-reproduction IN the design (I put it in §6) rather than build to the assumption. This reframed #13 a second time (D13.1 already reframed it once).
4. **`dash -n` ≠ dash-safe.** `[[`, `read -p` parse fine under dash, fail at RUNTIME. Parse-check is necessary, not sufficient; need a live run.

**Tie to doctrine:** principle 1 (measure, never assume — the win here), principle 3 (don't manufacture work / gaps→sprints only for REAL gaps), principle 6 (wer schreibt der bleibt — this note). Objects self-heal: a constructor valid under any caller shell is the goal, and init/oosh already was.

## 2026-09-08 — line/printf #40/#41 coherence review: "the fix already exists" surfaced by measurement (TWICE)

**Context.** Coherence review of a dev↔macos.latest divergence (line.format printf, #40 c2 completion, #41 config.save stdout-leak). Delivered as WHY-safe verdicts gating the expert's Track B.

**The repeated pattern — measure current code before designing/porting:**
1. **674f38b self-heal** — the plan said "port macos.latest→dev". Measured: byte-identical on BOTH branches already (came via merge 7d8b58a). Step was a no-op. Don't re-port.
2. **c0e6036 private.log.emit** — the PO/expert framed #41 as "design a root-fix / build a `private.log.emit` primitive." Measured: the primitive ALREADY EXISTS on dev (c0e6036), routes LOG_DEVICE=/dev/stdout → fd2 via dup ("fd1/stdout stays excluded — $() capture safety"), and every `.log` fn already routes through it. ⇒ fix = BACK-PORT c0e6036, not invent; config.save needs ZERO change (its console.log auto-safe once the primitive lands). Bonus: c0e6036 was the init-constructor commit — #41 was already solved on dev, just never LINKED to the completion saga. Measurement made the cross-saga link; assumption would have rebuilt it.

**Durable lessons:**
- **A design task often resolves to "measure whether it already exists / is already fixed" first.** Twice here the answer was yes. Grounding a review in `git show <branch>:file` + the introducing commit's message beats reasoning from the changelog/plan description.
- **Separate bundled work by dependency class, from the diffs.** #40 looked like one unit; the diffs split it: b73ddd1 (precedence + `<text...>`→`<text>`) derives firstParam from the SIGNATURE (sourcing-free) → disjoint from #41; the cyan (5a93fe5/6b1ee31) needs #41 root-fixed (gate 22b4894 proved the downstream filter insufficient). "After #41" was only half right.
- **Root vs symptom:** the reverted 5a93fe5 was a downstream declare-filter (symptom); the root is the emit primitive (fd1 exclusion). A single chokepoint fix (private.log.emit) beats N per-caller filters (DRY). Name the chokepoint, not the callers.
- **Distinguish layers when asked "why didn't X already cover it":** #4/#6 = env-FILE content purity; #41 = RUNTIME emit→fd1. Same "pure-state" word, different layer — a branch can have one and still leak the other.
- **Ready-posture works:** read-only pre-scan while the note was gated (expert-still-live) meant I turned the full root-fix note around immediately when the gate met. Pre-locate the seam, hold the artifact.
