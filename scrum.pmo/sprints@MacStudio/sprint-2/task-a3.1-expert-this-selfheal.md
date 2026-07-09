[Back to task-a3-this-init-selfheal](./task-a3-this-init-selfheal.md)

# A3.1 Expert — this.init() OOSH_DIR Self-Heal Guard
[task:uuid:62e3f797-d870-4329-a87b-d57573333915]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up: [task-a3-this-init-selfheal](./task-a3-this-init-selfheal.md)

## Description
**Role: oosh-expert**
Add to `this.init()`: `[ -L "$HOME/oosh" ] && [ "$OOSH_DIR" != "$HOME/oosh" ] && export OOSH_DIR="$HOME/oosh"`. Self-heals per first-principles.md Self-Healing Objects.

---
*Sprint 2 @MacStudio*
