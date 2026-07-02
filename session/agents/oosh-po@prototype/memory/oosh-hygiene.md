---
name: oosh-hygiene
description: No output filtering, no poll-loops, OOSH wrappers only, route agent ops through the hiveMind controller.
metadata:
  type: feedback
---

- **No output filtering**: never `2>/dev/null` / `2>&1` / `|tail`/`grep`/`echo $?` on shown output — run raw (errors are data).
- **No poll-loops**: never `until <check>; do sleep; done` — one-shot capture or background+notify (poll-loops aggregate context).
- **MVC**: route agent ops through the hiveMind CONTROLLER, not raw tmux/otmux (raw fork/manual pane ops = mess).
- **Subscription counts INPUT; sustained output ~free** — minimize new prompts, don't self-poll.

**How to apply:** OOSH wrappers only; check `scrumMaster subscription` every 10-15 min.
