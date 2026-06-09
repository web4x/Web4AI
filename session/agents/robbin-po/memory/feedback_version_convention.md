---
name: Web4 version convention
description: Never modify x.x.x.0 versions (prod releases). Work on x.x.x.1+ (dev). New components start at x.x.x.0.
type: feedback
originSessionId: fe80b13c-c559-45f0-92f4-a55c95488460
---
Never modify 0.x.x.0 versions — those are production releases. Development work goes on 0.x.x.1+ (dev versions).

Exception: NEW components that don't exist yet start at 0.x.x.0 as their first version.

**Why:** 0.x.x.0 is the stable baseline. Modifications go to the dev version so prod isn't broken.

**How to apply:** When modifying existing components, work on the latest .1+ version. When creating a brand new component, 0.x.x.0 is correct.
