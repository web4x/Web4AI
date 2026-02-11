# Task: Restructure the Knowledge Base — WODA as Architecture, Not Labels

**From**: Product Owner
**To**: woda-scribe
**Date**: 2026-02-11
**Priority**: High — the knowledge base structure contradicts the WODA framework it claims to follow

---

## The Problem

Your current `session/woda-kb.md` (which should be called "knowledge base", never "kb") has 9 topics, each with W-O-D-A sections inline. That's not WODA. That's putting four labels on a flat list.

Re-read Chapter 30 carefully. The four letters are not section headers within a single document. They are an **architecture** — four distinct layers with distinct persistence and distinct file structures.

---

## How WODA Actually Works

### W — What: The INDEX

W is not "a one-liner describing the topic." W is the **index of all topics**. One single W section that lists every topic the knowledge base covers. Think table of contents. Think filing cabinet drawer labels. When a new prompt arrives, you scan the W index to find which topic is relevant.

**W is one place. One list. One index.**

```
# Knowledge Base — W (Index)

1. otmux send Reliability
2. Context Measurement
3. Peer Monitoring Pattern
4. CMM Improvements Pipeline
5. Permission Prompts
6. Compaction & Recovery
7. Team Delegation
8. Scribe Identity
9. Infrastructure Resilience
```

That's it. Short. Scannable. After compaction, you read THIS to know what topics exist.

### O — Overview: One overview PER What entry, with POINTERS to Details

Each W entry gets its own O section. The O does NOT contain the details — it **points to where the details live**. Chapter 31 says it explicitly:

> "The Overview doesn't just summarize — it *points*. Three hops from question to answer, without reading 200 lines."

> "Derive, don't duplicate. The tree says WHAT, not HOW. Details live in files."

Each O entry should be 3-5 lines max, ending with a pointer to the D file/section:

```
## O — Overviews

### 1. otmux send Reliability
Core issue: Claude TUI doesn't process remote keystrokes like a terminal.
9 known failure modes. Fix: `otmux send.verified` (805aecc).
NEVER send Escape — poisons buffer irreversibly.
→ Details: session/knowledge-base/otmux-send.md
→ Actions: session/knowledge-base/otmux-send.md#checklist
```

The arrow (→) is the critical part. O POINTS to D. It does not contain D.

### D — Details: Separate files per topic (or clear sections)

The details for each topic live in their own file or a clearly separated section. This is where the full information goes — failure modes, tool references, configuration, history, examples.

Each D file ends with references to its A checklists:

```
# otmux send Reliability — Details

## Failure Modes
1. Single Enter = newline, not submit (need double-Enter)
2. Messages queue behind permission dialogs
...

## Tools
- `otmux send.verified` — send + verify via pane capture (805aecc)
...

## Action Checklists
→ See: session/knowledge-base/actions/send-message.md
→ See: session/knowledge-base/actions/unblock-stuck-agent.md
```

### A — Actions: Checklists referenced BY the details

Actions are concrete checklists — step-by-step procedures. They live in their own files. Multiple D topics can reference the same A checklist (e.g., "unblock stuck agent" is relevant to both otmux send AND peer monitoring).

```
# Action: Send a Message to a Peer Agent

1. Capture target pane first — assess current state
2. If permission prompt visible: read options, send correct number
3. Clear input: `otmux send <target> C-u`
4. Send message: `otmux send.verified <target> "message"`
5. Capture pane again — verify message was submitted
6. If not submitted: send Enter, re-verify
```

---

## The Flow

```
W (Index)                    — "What topics exist?"
  ↓ scan
O (Overview per topic)       — "What do I need to know about this topic?"
  ↓ follow pointer
D (Details file)             — "Give me the full information"
  ↓ follow reference
A (Action checklist)         — "What do I DO about it?"
```

Information flows W → O → D → A. Each layer points to the next. No layer contains the next layer's content inline.

---

## What To Do

1. **Create directory**: `session/knowledge-base/` (and `session/knowledge-base/actions/` for checklists)
2. **Create the W index**: `session/knowledge-base/index.md` — one file listing all topics
3. **Create O overviews**: `session/knowledge-base/overviews.md` — short overviews per topic, each ending with → pointer to its D file
4. **Split current KB into D files**: One file per topic in `session/knowledge-base/` (e.g., `otmux-send.md`, `context-measurement.md`, etc.)
5. **Extract A checklists**: Pull action steps into `session/knowledge-base/actions/` as reusable checklists
6. **Delete or replace** `session/woda-kb.md` — it served its purpose but the structure is wrong

The knowledge base will grow. New topics get added to W. New overviews get added to O. New details go in D files. New checklists go in A files. The structure scales because each layer is independent.

---

## Quality Criteria (PO will verify)

- [ ] W index exists as a single, scannable list — no details, no explanations
- [ ] Each O overview is 3-5 lines max and ends with → pointer(s) to D file(s)
- [ ] O does NOT contain details — it summarizes and points
- [ ] D files contain full information per topic
- [ ] D files reference A checklists at the end
- [ ] A checklists are step-by-step, concrete, reusable
- [ ] No inline WODA (no "W — ... O — ... D — ... A — ..." within a single topic section)
- [ ] "Knowledge base" is always written out, never abbreviated

---

**PO Governance Note**: The current KB was a good first attempt — it captured real wisdom. But labeling sections W-O-D-A within each topic is like calling your kitchen drawers "fork, knife, spoon, plate" and then putting all four in every drawer. WODA is a filing system. W is the drawer labels. O is the quick-reference card in each drawer. D is the full manual in each drawer. A is the instruction sheet taped to the inside of the lid. They are layers, not labels.
