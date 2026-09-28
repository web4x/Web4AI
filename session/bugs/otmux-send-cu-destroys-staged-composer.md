# DEFECT (fleet-wide, silent data loss): `otmux send` issues `C-u` and DESTROYS a staged composer

**Raised by:** oopPO@WODA.prod (oopTeam:2.0), 2026-09-28. **Measured by:** oopExpert@WODA.prod; **independently verified on disk by oopPO.**
**Owner / routing:** the `otmux` owner (ooshTeam — `/root/oosh` is NOT oopTeam's tree). **oopTeam will NOT edit it**: a wrong edit there breaks every agent's comms at once.
**Severity:** HIGH — silent, unlogged loss of customer (TRON) directives. One confirmed casualty already.

## The defect, measured

`/root/oosh/otmux`, in `otmux.send()` (the smart/default verb), Claude-Code-target path:

```
  # Clear input line
  $TMUX_CMD send-keys -t "$target" C-u
```

- Line **1967** (comment at 1966). It fires **BEFORE the text is typed**, on **every** call to a Claude Code pane.
- `otmux send.raw` contains **NO** `C-u` (only occurrences of `C-u` in the file are line 1896, a token-detection comment, and 1967).
- `send.verified` wraps `send`, so it inherits the `C-u`.

**Consequence:** any text already staged in the target's composer is **silently erased** by the act of sending it a message. Nothing in a subsequent capture shows the text ever existed, so the loss is **undetectable after the fact**.

## Why this is NOT the known OTR-1/BUG10 framing (it is worse)

OTR-1/BUG10 is recorded as *"plain `otmux send` stages the text without reliably submitting it."* That describes a **delivery** failure of the OUTGOING message. This is a **destruction** failure against the RECEIVER's existing state:

| | known framing | this defect |
|---|---|---|
| what fails | my message may not submit | **the receiver's staged text is erased** |
| who loses | the sender | **the customer / whoever staged it** |
| detectability | the staged text is visible | **nothing remains to see** |

## Confirmed casualty

TRON staged **`go build increment 4`** in `oopTeam:0.0` (oopExpert) — the single sentence oopExpert had been standing down for. oopPO **saw it staged**. A peer then sent one routine `send.verified` into that pane; afterwards the composer was empty, the directive appears nowhere in the submitted transcript, and **oopExpert confirms it is still standing down awaiting that word** (the subject is the decisive witness). The directive was **erased, not delivered**.

## Blast radius — a sweep is required

- oopExpert reports **~30** `send`-class messages last night to oopPO, oopTester, oopBashExpert, the SM and the trainer.
- oopPO sent **~7** `send.verified` messages on 09-28 (trainer x5, SM x1, oopExpert x1) and read the composer first for only two of them.
- **Therefore any staged brief in any of those composers may have died the same way.**
- ⇒ **ACTION: every agent reports whether it is waiting on something that never arrived.** A "waiting on nothing" agent is the signature.
- Historical: this plausibly explains the *three rulings that never reached the SM* (oopPO context.md defect #2) and other verified-sent-but-never-received incidents.

## Required fix — MECHANISM, not a rule

A keystroke prohibition every agent must remember forever is the **discipline-instead-of-mechanism** failure we keep naming. `send` must make the loss **impossible**:

1. **CAPTURE-AND-RESTORE** — capture the composer, clear, type, submit, then restore what was there; **or**
2. **REFUSE** — if the composer is non-empty, abort with a loud error naming the staged text, and require an explicit override flag.

Either makes the defect structurally unreachable. (2) is cheaper and fails loudly, which is preferable to a restore that could itself misfire.

## Interim fleet directive (in force now, oopPO ruling)

1. **ALL peer comms use `otmux send.raw`** (no `C-u`) until the fix ships.
2. **READ the target pane before sending** (`otmux pane.capture.visible <t> <n>`) — never send into a pane you have not read.
3. **Verify delivery by CAPTURE**, not by the `send.verified` echo.
4. **NEVER `C-u`** — canon row 2b already forbids it because it *recalls*; this defect adds that it also *silently clears*. Clear only by counted `send.key BSpace` in chunks of <=200, alternating with `Delete` when a chunk no-ops, capture-verifying every chunk, proving empty by a forced redraw.
