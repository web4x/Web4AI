---
name: Shell environment for OOSH
description: Do NOT source user.env on every command or suppress errors with 2>/dev/null. OOSH is on PATH via bashrc. Use commands directly as users would. OOSH has its own logging — let it show.
type: feedback
---

- Do NOT prefix every bash command with `source ~/config/user.env 2>/dev/null`
- OOSH is already on PATH via ~/.bashrc — just run commands directly
- Do NOT redirect stderr with `2>/dev/null` — OOSH has logging, let errors show
- Use OOSH commands exactly as a user would: `hiveMind consistency.audit`, not `source ... && hiveMind ...`
- Only source user.env once if bash version is wrong (bash 3.2 vs 5) — not on every command
