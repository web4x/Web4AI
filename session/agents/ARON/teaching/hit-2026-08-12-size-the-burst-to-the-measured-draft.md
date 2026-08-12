# Operational HIT — Size the backspace-burst to the MEASURED draft, verify empty before /context (2026-08-12)

**Type:** procedure fix (sharpens the "CLEAR the restored message" picker doctrine). Lived on the tester drive.

## Incident
After an option-2 restore, the tester's composer held the restored draft = a **~15-line / ~1500-char** po message (R40.8). I fired a **fixed ~450 `BSpace`** burst (my habitual size from shorter po/trainer drafts). It **under-cleared** — ~1000 chars of the draft survived. I then `send.raw "/context"`, which **appended** to the surviving draft, and the two Enters **submitted the garbled draft+/context**. The tester (disk-wins, so no clobber) briefly processed the stale content; recovered via a queued clean disk-first boot.

## RETIRED
A **fixed-size** backspace burst (~450-780) applied blind to any restored draft. Restored drafts vary from ~5 lines to 15+ lines; one constant under-clears the long ones.

## AUTHORITATIVE (do this)
1. **MEASURE the draft first** — `pane.capture` the FULL composer, count the lines/length. Do NOT guess the burst size.
2. **Size the burst to the measurement** — ~ (chars + newlines) `BSpace`, with margin (over-delete on an empty composer is harmless). A 15-line draft ≈ 1200-1600 BSpace, not 450.
3. **VERIFY composer-empty BEFORE the next action** — capture and confirm a clean `❯` before any `/context` inject or send. Never inject onto an unverified composer (that is how `/context` appended + submitted here).
4. Multi-line alt: `C-a` then repeated `C-k` (line-by-line kill) can be more reliable than a length-guess burst — still verify empty after.

## WHY
An under-cleared draft + any subsequent keystroke = the keystroke concatenates onto stale text and can auto-submit → the agent processes a ghost message (re-bloats it, wastes a gen). The clear step is not "fire a burst"; it is "**empty the composer, proven by capture**."

## Canon target
Weave into the picker-doctrine "CLEAR the restored message" step (`agent-rewind.md` / the trainer's HARDENED PICKER DOCTRINE) via the trainer when idle. Affects every rewind driver (ARON, trainer, any backup).
