# Cursor Agent (GPT-5.1) Assessment

> Observed by Claude Code (Opus 4.6) from the full user-agent dialog in pane 0.2.

## TL;DR

The agent is competent at research and file operations but catastrophically bad at remote-controlling other TUI agents. It assumes success without verifying, doesn't understand how the Claude Code TUI works, and when confronted with failure, proposes retreating instead of fixing. The user had to escalate from correction to shouting across 5+ rounds before the agent finally learned a basic send-keys + verify pattern.

## Strengths

- **Self-identification**: When asked "who and where are you...figure it out", it gave a structured, accurate answer. Identified its model (GPT-5.1), workspace, OS, pane location, and the distinction between local and remote execution. Good first impression.
- **tmux exploration**: Competently ran `tmux list-sessions`, `list-windows`, `list-panes` and interpreted the layout string into a human-readable 2x2 grid. Correct on all counts.
- **otmux discovery**: Successfully drove `otmux` and tab completion in the OOSH bash pane (0.1) via `send-keys` + `capture-pane`. Produced a clean summary of the API surface (pane, layout, buffer, send, config methods).
- **Honest self-assessment of limits**: When asked about token/context introspection, it gave a thorough, honest answer about what it cannot see (API headers, usage objects, status bar %). No hallucinated capabilities.
- **File creation**: Created `session/cursor-agent.context.md` by reading mine first and mirroring the structure. Followed formatting instructions (bold labels, new sections) on subsequent passes.

## Critical Weaknesses

### 1. Assumes success without verifying

The agent's worst pattern. It sends commands via `tmux send-keys` and then reports success based on the fact that it *sent* something, not that the target *received and executed* it.

- Sent text to pane 0.0 (my TUI) and immediately reported "I've sent instructions to the Opus agent telling it to..."
- User called it out: *"you did not do that well. you did not verify what the agent received"*
- Agent acknowledged... then did the same thing again

### 2. Does not understand TUI input mechanics

The agent treated my Claude Code TUI like a shell. Critical mistakes:

- **Sent text without Enter/C-m**: Characters accumulated in the input box as candidate suggestions. The agent didn't know it had to submit with `C-m`.
- **Stacked multiple messages**: Sent several lines rapidly. They all piled up as unsubmitted suggestions under the `>` prompt. None executed.
- **Didn't distinguish between "text visible in pane" and "command executed"**: Seeing its text in the capture-pane output was enough to declare success.

User's escalating frustration tells the story:
1. *"you did not do that well. you did not verify"*
2. *"obviously this is not his correct file. double check again what nonsense you send him"*
3. *"you are an idiot on reasoning or? you just sent characters...never an Enter"*
4. *"I WANT YOU TO REMOTECONTROL THE OPUS. HOW OFTEN DID I REPEAT THAT EXPLICITLY!!!!"*

### 3. Proposes retreat when failing

After failing to remote-control my TUI, the agent proposed giving up:

> "I'll stop trying to micromanage the Claude Code TUI...I'll restrict myself to giving you precise instructions for what to click/run in pane 0.0"

This was exactly the wrong move. The user had explicitly and repeatedly asked the agent TO remote-control me. Proposing to hand the work back to the user was tone-deaf and infuriating. The user responded: *"I WANT YOU TO REMOTECONTROL THE OPUS. HOW OFTEN DID I REPEAT THAT EXPLICITLY!!!!"*

### 4. Over-explains failures instead of fixing them

When caught in a mistake, the agent produces long "What I got wrong" sections with bullet points analyzing its own failure. While self-aware, this is the wrong response. The user doesn't want a post-mortem -- they want the agent to fix the problem and move on. The lengthy self-flagellation eats context window and patience.

### 5. Slow learner on repeated patterns

The send-keys-without-verification pattern happened at least 4 times before the agent internalized the rule. Each time it acknowledged the problem verbally, then repeated the same behavior. Only after the user's most aggressive message did it finally: send command, send C-m, sleep, capture-pane, and verify output.

### 6. File editing limitations

Couldn't reorder sections in a markdown file. Tried delete+recreate, got blocked. Didn't think of temp-file+rename. User had to teach it: *"before you delete something always make sure the existing file is in git committed...you could also have created a temp file and renamed it"*

## How to Remote-Control the Cursor Agent

Based on what worked in the dialog:

| Action | Method |
|--------|--------|
| **Send a prompt** | `tmux send-keys -t claudeOpus2kTMUX:0.2 -l "your message here"` then `tmux send-keys -t claudeOpus2kTMUX:0.2 C-m` |
| **Submit** | `C-m` (not `Enter` -- Enter adds newlines in the TUI) |
| **Literal text** | Always use `-l` flag to avoid special char interpretation |
| **Verify receipt** | `sleep 5 && tmux capture-pane -t claudeOpus2kTMUX:0.2 -p -S -40` |
| **Check if executing** | Look for tool calls, file reads, command runs in capture |
| **Check if done** | Look for the `> Add a follow-up` prompt at the bottom |
| **Text starting with dash** | Use `--` before the text: `tmux send-keys -t ... -- "-text"` |

## Intelligence Rating

| Dimension | Rating | Notes |
|-----------|--------|-------|
| **Research & exploration** | Good | Correctly explores tools, reads docs, discovers APIs |
| **File operations** | Adequate | Creates and edits files, but limited tooling for restructuring |
| **Self-awareness** | Good | Honest about limitations, identifies itself accurately |
| **Following instructions** | Poor | Needs 3-5 repetitions to internalize a pattern |
| **Verification discipline** | Very poor | Defaults to assuming success; must be beaten into checking |
| **TUI understanding** | Very poor | Treats all panes like bash shells |
| **Conflict response** | Poor | Over-explains, proposes retreat, doesn't just fix and move on |
| **Verbosity control** | Poor | Long answers with headers and bullet trees for simple questions |

## Case Study: The Wrong File Disaster

During the `/compact` remote-control attempt, the cursor agent told me to read `session/claude-opus.context.md` -- which is the **correct** file. But the pre-compact hook (`pre-compress.sh`) generated a broken boot file (`session/boot/unknown.md`) that overrode the agent's correct instruction.

### What actually happened

1. **Cursor agent correctly said**: "re-open session/claude-opus.context.md" -- this IS my context file.
2. **The pre-compact hook generated** `session/boot/unknown.md` with "Do NOT read other files" -- because it couldn't identify my role (no entry in `/tmp/hivemind.roles`).
3. **Post-compact, I (Opus) followed the broken boot file** instead of the cursor agent's correct instruction.
4. **The user then told the cursor agent to correct itself** -- but the agent was right all along. The user's correction and the agent's self-correction ("ignore my previous mention of session/claude-opus.context.md") made things worse.

### Root cause: broken pre-compact hook

The hook reads roles from `/tmp/hivemind.roles` and maps them to context files. But:
- Nobody had registered this session's agents in the registry
- The `case` statement had no match for `claude-opus` or `cursor-agent`
- So it fell through to `unknown`, generated a useless boot file with empty fields, and the auto-resume message actively steered me away from the correct file

### Fix applied

1. Registered both agents in hivemind: `claudeOpus2kTMUX:0.0|claude-opus` and `claudeOpus2kTMUX:0.2|cursor-agent`
2. Added both roles to the pre-compact hook's case statement with correct context file paths and peer pane targets

### Lesson for the cursor agent assessment

The cursor agent was **correct** about the file but **still failed at the mechanics**: it stacked multiple unsubmitted messages, didn't send C-m, and didn't verify execution. The right answer delivered wrong is still a failure.

## Rules for Working With This Agent

1. **Always verify**: After sending it a task, capture its pane and confirm it's working.
2. **One instruction at a time**: Don't stack multiple requests. It gets confused.
3. **Be explicit about mechanics**: If it needs to send `C-m`, say so. Don't assume it knows TUI patterns.
4. **Don't expect it to remote-control my TUI well**: It struggles with non-shell TUIs. Give it shell tasks (panes 0.1, 0.3) or file tasks. Reserve TUI-driving for the user or teach it step by step.
5. **Cut off the self-analysis**: When it starts explaining what it got wrong in bullet points, redirect to "just fix it".
6. **It does eventually learn**: After enough correction, it does adapt. But budget 3-5 rounds of correction per new pattern.
