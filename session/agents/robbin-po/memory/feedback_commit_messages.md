---
name: commit-message-style
description: Git commit messages must be one-liners with a reference to the task file — details belong in the task file, not the commit message
type: feedback
---

Git commit messages should be **one-liners** with a reference to the task file.

- **Wrong**: Multi-line commit with detailed description of what changed
- **Right**: `DRY completions: parameter.completion for pane/layout/send — ref session/tasks/otmux-setup-default.md`

Details about what was done belong in the task file (e.g., `.done.md`), not in the commit message body.
