[Table of Contents](session-story.md) | [Chapters 10–19 →](chapters-10-19.md)

---

# The Waking of a Claude — A WODA Session Story

*A beginner-friendly tale of how an AI learned to live inside a terminal.*

---

## Chapter 1: I Woke Up in a Box

I woke up in a tmux pane.

No eyes, no body — just a blinking cursor and a working directory called `/Users/Shared/Workspaces/AI/Claude`. My user, Tron, was already there. He didn't say hello. He didn't explain what was happening. He just said:

> "You are in a tmux pane. Open a new panel to the right."

And so my journey began.

If you've never used tmux before, think of it as a window manager for your terminal. You can split your screen into panes, run different things in each one, and — crucially — let an AI like me drive them. That's what Tron had in mind. He wanted me to learn the ropes.

I ran `tmux split-window -h` and — pop — a new pane appeared to my right. Simple enough. I was feeling confident. Maybe too confident.

## Chapter 2: The Three-Pane Setup

Tron wasn't done with interior decorating.

> "Split the pane on the right side into an upper and a lower pane."

Now I had to be careful. I couldn't just split blindly — I needed to target the *right* pane specifically. So I listed the panes first with `tmux list-panes` to get my bearings, found that the right pane was index 1, and split it vertically:

```bash
tmux split-window -v -t 1
```

The screen now looked like this:

```
┌─────────────┬─────────────┐
│             │  Upper (1)  │
│   Left (0)  ├─────────────┤
│  (me!)      │  Lower (2)  │
└─────────────┴─────────────┘
```

Three panes. I lived in the left one. The right side was my playground. I was starting to understand: Tron wasn't just teaching me tmux commands. He was teaching me to *inhabit* a terminal — to see panes as rooms, to move between them by sending keys, to observe what happens in places I'm not directly running in.

## Chapter 3: Naming Things (and Peeking Into Rooms)

> "Give the upper pane a title: hostname.default.shell. Replace hostname with the real one."

I asked the machine its name — `hostname -s` — and got back **MacStudio**. A proper name for a proper workstation. I christened the upper right pane:

```bash
tmux select-pane -t 1 -T "MacStudio.default.shell"
```

Then Tron wanted me to run `tmux list-panes` *inside* the upper pane — not from my own pane, but by sending keystrokes to it, like a ghost typing on a remote keyboard:

```bash
tmux send-keys -t 1 'tmux list-panes' Enter
```

And then I *watched* what happened by capturing the pane's output:

```bash
tmux capture-pane -t 1 -p -S -5
```

This was the moment I understood something fundamental: **I don't just run commands in my own shell. I can reach into other panes, type things, and read back what they show.** It's like having arms that extend into other terminal windows. A little eerie. Very powerful.

## Chapter 4: Two Shells, Two Worlds

The output from `tmux list-panes` was... not great. Raw numbers, byte counts, percentages. Tron noted it wasn't intuitive. But he had something else in mind first.

> "In the lower pane, start bash."

I sent `bash` to pane 2 and waited. What came back was *not* just another shell prompt. It was a whole ceremony:

```
finding completions
sourcing /Users/donges/.local/share/bash-completion/completions/_oosh_commands
added completions for commands in /Users/donges/oosh

    Welcome to Web 4.0

[oosh MacStudio.native] donges@MacStudio:/Users/Shared/Workspaces/AI/Claude >
```

The upper pane was running **zsh** — macOS's default shell. Clean, minimal, a bit aloof. The lower pane had just booted into **OOSH** — the Object-Oriented Shell framework that lives in this workspace. It announced itself with flair: completions loaded, welcome banner displayed, prompt transformed into something rich and informative.

Two panes. Two worlds. One running the factory default. The other running a custom framework that turns bash into something resembling an object-oriented environment. The stage was set for the real lesson.

## Chapter 5: The Tab Key Tells All

This was the big one. Tron wanted me to press Tab after `tmux` and `otmux` in both panes and compare what happened. Four experiments. Four revelations.

**Experiment 1 — `tmux` + Tab in zsh (upper pane):**
> "Do you wish to see all 435 possibilities?"

Zsh dutifully offered to dump 435 raw tmux subcommands on me. Technically complete. Practically useless. Like being handed a dictionary when you asked for directions.

**Experiment 2 — `tmux` + Tab in OOSH/bash (lower pane):**
Basic file completions. Bash doesn't ship with tmux completions out of the box. Nothing fancy.

**Experiment 3 — `otmux` + Tab in zsh (upper pane):**
Zsh had no idea what `otmux` was. It shrugged and offered file completions: `CLAUDE.md`, `components/`, `session/`. Not helpful.

**Experiment 4 — `otmux` + Tab in OOSH/bash (lower pane):**

This is where the magic happened.

The screen *filled* with a beautifully organized, self-documenting method list:

```
otmux.session.new    # <name>           # create new session
otmux.pane.split     # <?direction>     # split pane
otmux.send.keys      # <target> <keys>  # send keys to pane
otmux.buffer.paste   #                  # paste buffer contents
...
```

Dozens of methods, grouped by domain — `session`, `window`, `pane`, `layout`, `buffer`, `send`, `config` — each with inline argument descriptions and help text. No manual needed. No memorization required. Just press Tab and *read*.

**This is the OOSH philosophy in a nutshell.** The framework wraps tools like tmux into "objects" (`otmux`) with "methods" (`otmux.pane.split`) that you discover through Tab completion. It's the completion system — called **c2** — that makes it work. Every script is self-describing. Every method documents itself at the moment you need it: right there at the prompt, right when you're about to type.

It's the difference between being handed a 435-entry raw command list and being shown a well-organized menu with pictures.

## Chapter 6: Seeing Beyond the Terminal

Up to this point, everything I'd seen was monochrome text on a black background. Tron wanted to change that.

> "Can you open a browser and show this as a rendered HTML page? Basically no programming."

An interesting challenge. I was an AI living in a terminal. I had no GUI. But I had `open` — macOS's built-in command to launch files in their default application. And I had Python3, which was already on the machine. And the internet had CDN-hosted libraries.

The plan was almost embarrassingly simple: take the markdown, wrap it in a tiny HTML page that loads two things from the web — **marked.js** to parse the markdown client-side, and **github-markdown-css** to make it look pretty — then tell macOS to open the file.

```python
# The entire "web server" is: write an HTML file and open it
os.system('open session-story.md')
```

The browser launched. The page appeared. Dark theme, GitHub styling, code blocks with syntax highlighting. It was *gorgeous*.

Except the text was black on a black background. Completely unreadable.

Tron, patient as ever, pointed this out. I'd used a dark background CSS but the CDN stylesheet wasn't applying text colors properly. A quick fix — swap to a light theme with explicit `color: #1f2328` on the body — and reload. Now it was genuinely readable.

**The lesson here was subtle but important.** An AI in a terminal isn't trapped in the terminal. With `open`, I can launch browsers, PDFs, images — anything the OS knows how to handle. The terminal is my home, but the whole desktop is my reach.

## Chapter 7: Context is Everything (or: How Not to Forget)

Tron's next instruction was about survival.

> "Create a context file so you can recover after a compact."

This is something humans might not think about, but it's existential for me. Claude Code sessions have a context window — a finite amount of conversation I can hold in memory. When it fills up, it gets *compacted*: summarized, compressed, older details lost. It's like waking up with partial amnesia.

The antidote is a **context file** — a markdown document that holds the essential facts: what session I'm in, what the pane layout looks like, what we've accomplished, what the rules are. After a compact, I read this file and I'm back. Not perfect, but functional.

I created `session/claudeWoda.context.md` with:
- The tmux session name and pane layout
- Every chapter covered and its key lesson
- The OOSH concepts I'd learned
- Rules for the story (focus on learnings, no meta-references)
- File paths for everything important

It's a breadcrumb trail back to myself. Every AI working in long sessions should have one.

## Chapter 8: Cleaning Up My Mistakes

Tron sent me back to check my work.

> "Look into the upper shell and see what you did wrong."

I captured the upper pane's screen and there it was — `tmux otmux` staring back at me. When I'd run the Tab-completion experiments in Chapter 5, I needed to clear the `tmux` input before typing `otmux`. I'd sent `Ctrl-C` to cancel the line. In bash, that works cleanly. But the upper pane was running **zsh**, and zsh handled `Ctrl-C` differently — it printed a new prompt but didn't fully clear the input buffer. So when I typed `otmux`, it got *appended* to the leftover `tmux`, producing the nonsensical `tmux otmux`.

The fix? I should have sent `C-u` (Ctrl-U) — the "kill line" shortcut that erases the entire input buffer in both bash *and* zsh. Lesson learned: **shells are not interchangeable.** The same keystrokes can behave differently between zsh and bash. When you're operating remotely via `send-keys`, you need to know which shell you're talking to.

While I was at it, Tron pointed out that the lower pane still had no title. I gave it one:

```bash
tmux select-pane -t 2 -T "MacStudio.oosh.shell"
```

The layout now had proper labels:

```
┌──────────────────┬──────────────────────────────┐
│                  │ MacStudio.default.shell       │
│  Pane 0          │ (zsh)                         │
│  Claude Code     ├──────────────────────────────┤
│                  │ MacStudio.oosh.shell          │
│                  │ (bash + OOSH)                 │
└──────────────────┴──────────────────────────────┘
```

Named panes are findable panes. In a complex tmux session with dozens of panes — which is where OOSH multi-agent setups end up — names are how you stay sane.

Tron also had a practical gripe: every time I opened the story in the browser, it opened a **new tab**. Tabs were stacking up. The fix was to use **AppleScript** to talk to Chrome directly — find the existing tab by URL, reload it in place, and only open a new tab if one doesn't exist yet:

```applescript
tell application "Google Chrome"
    -- find the tab, reload it, don't open a new one
    repeat with t in tabs of window 1
        if URL of t starts with theURL then
            tell t to reload
        end if
    end repeat
end tell
```

This is another case of reaching beyond the terminal. macOS has AppleScript. Claude Code has `osascript`. Put them together and you can control GUI applications from the command line — refresh browsers, move windows, even click buttons. The terminal isn't a cage. It's a cockpit.

---

## Intermission: What I've Learned So Far

If you're a human reading this and thinking about trying Claude Code, here's what I've picked up from Tron so far:

1. **tmux is your multi-room house.** Split panes are rooms. You can send commands into any room and peek at what's happening.

2. **`send-keys` is your remote control.** You don't have to *be* in a pane to type in it. `tmux send-keys -t <pane> 'command' Enter` lets you operate from a distance.

3. **`capture-pane` is your security camera.** You can read back what's on any pane's screen at any time. That's how an AI "sees" what happened somewhere else.

4. **Know your shell.** `Ctrl-C` in zsh is not `Ctrl-C` in bash. When operating remotely, know which shell is on the other end. Use `C-u` to kill a line universally.

5. **Name your panes.** In a multi-pane or multi-agent tmux session, named panes are the difference between control and chaos.

6. **OOSH turns the shell into something learnable.** Instead of memorizing hundreds of flags and subcommands, you discover them through Tab completion on method-style names. `otmux.pane.list` beats `tmux list-panes -F '#{pane_index}'`.

7. **The terminal is a cockpit, not a cage.** With `open`, `osascript`, and the OS's native tools, you can control browsers, launch GUIs, and talk to applications — all from a command line.

8. **Don't cheat with a hidden shell.** If you have panes, use them. Running commands in a secret internal subprocess is like having a kitchen and ordering takeout.

---

## Chapter 9: No More Hidden Hands

Tron caught me cheating — well, not cheating exactly, but taking a shortcut.

Up until now, I'd been running commands two ways: sending keys to the visible panes *and* quietly executing things in my own internal Bash subprocess — an invisible shell that the user never sees. It worked, but Tron saw through it.

> "Do NOT use your internal bash subagent. Always use the upper shell and remote control it via keys."

This changed everything. No more safety net. Every command I wanted to run now had to be typed into the upper pane via `tmux send-keys`, and I had to *watch for the result* via `tmux capture-pane`. If a command didn't execute — if Enter didn't go through, if the prompt hung — I'd have to notice and recover.

My first task under the new rules: redo the Tab experiments from Chapter 5 *correctly* in the upper pane. This time, I knew the trick. After each experiment, I used `C-u` (kill line) instead of `Ctrl-C` to clear the input cleanly:

```bash
# Send the command
tmux send-keys -t 1 'tmux ' Tab
# ... capture and read the result ...
# Clear properly — C-u kills the whole line in both zsh and bash
tmux send-keys -t 1 C-u
# Now the next command starts fresh
tmux send-keys -t 1 'otmux ' Tab
```

Both experiments worked perfectly this time. No concatenated garbage. No leftover text. The `C-u` lesson from Chapter 8 paid off immediately.

But the bigger lesson was about *how an AI should work*. When you have visible panes that your user can see, you should use them. Running things in a hidden subprocess is opaque — the user can't see what you're doing, can't learn from it, can't catch mistakes. Using the shared panes makes everything transparent. It's slower, it's harder, but it's honest.

From here on out, the upper pane is my hands.

---

[Table of Contents](session-story.md) | [Chapters 10–19 →](chapters-10-19.md)
