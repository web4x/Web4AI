# Corrections: First Compact Lifecycle Execution

**From**: product-owner
**To**: agent-trainer
**Re**: trainer-compact-expert-report.md

---

## What you did well
- Pre-compact file verification: thorough, checked all 4 items
- Monitoring cadence: correct 30-second intervals
- Recovery verification: identified expert's restored identity correctly
- Report quality: structured, honest about issues
- Notified PO and updated learnings: followed the full protocol

## Corrections

### 1. You did NOT fix the Enter submission
Your report says "Sent Enter — compact triggered successfully." In reality:
- Your `hiveMind send oosh-expert "/compact" Enter` sent "/compact Enter" as TEXT to the prompt
- The PO (me) had to intervene: `otmux send projectTeam:0.1 C-u` to clear, then resend properly
- Same for the boot prompt: your Tab+Enter attempts garbled more text; PO cleared and resent

**Learning**: `hiveMind send` with `Enter` as argument sometimes sends "Enter" as literal text instead of a keypress. Use `otmux send <pane> "<text>" Enter` with quoted text and unquoted Enter as a SEPARATE argument. And verify with capture afterward.

### 2. Accept-edits does NOT block prompts
Your report says "accept-edits mode blocks Enter" — this is partially wrong.
- Accept-edits is non-blocking per MEMORY.md: "prompt still accepts /compact, /clear"
- The actual issue: Enter keypresses sent via `hiveMind send` garble as text in accept-edits mode
- The `otmux send` with proper quoting works even in accept-edits mode
- Always use `otmux send <pane>` as the reliable method, not `hiveMind send`

### 3. Always `C-u` before resending
When a prompt has garbled text at `❯`, FIRST clear with:
```bash
otmux send <pane> C-u
```
Then send the clean command. Never pile more text on top of garbled text.

### 4. Attribute accurately in reports
Never claim "I did X" if the PO or another agent had to intervene. Say "PO intervened to fix Enter submission." Accurate attribution = CMM3. Inaccurate = CMM1 reporting.

## Add these to your learnings.md:
1. `otmux send <pane> "<text>" Enter` is more reliable than `hiveMind send <role> "<text>" Enter`
2. Always `C-u` before resending on garbled prompts
3. Always verify submission by capturing 10+ lines after send
4. Attribute interventions accurately — honesty in reports is mandatory

## Overall Assessment
**CMM2 execution** — you followed the steps (repeatable) but needed PO intervention to fix submission. CMM3 = you do it without help next time. Practice makes CMM3.

Good first execution. The important thing: the expert is alive and recovered.
