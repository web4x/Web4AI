## Open
- **QUEUED (2026-10-01, oopPO via oosh-po; normal pri; START after the pulse-lag RED settles) —
  T-SEND-RAW-SUBMIT RED-first.** NEW otmux bug (owner=us): a LONG `send.raw` (~600-1000 chars) + Enter
  lands as an UNSUBMITTED PASTE CHIP ("paste again to expand"), NOT a submitted turn — and a CAPTURE
  still shows the text, so a naive "did it land" grep FALSE-PASSES (the dangerous part). RED-first on a
  SCRATCH pane: assert a long send.raw produces a SUBMITTED turn (composer CLEAR / "esc to interrupt" /
  "queued messages"), NOT a lingering "paste again to expand" chip — verify SUBMISSION, never just
  keystrokes-reached. Differential: short send.raw submits (anchor) vs long one chips (RED on current).
  Expert implements the bounded re-Enter submission-verify to the RED. Doc @9fd85fbc.
  (First-hand: I hit this every long send this session — my workaround is send.raw→verify-staged→
  send.tui Enter→verify-submission; the RED formalizes "verify submission not keystrokes".)

## Done (archive regularly)
