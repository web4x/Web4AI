# web4-expert Learnings — 2026-04-25

## Web4 Principles (hard-won)
- P20: NO require() — ESM only. Use static import at module level.
- P21: import * as path from 'path' — namespace import, not destructured.
- P15: NO output filtering — never | head, | tail, | grep.
- P9: Self-Information Protocol — query pdca trainAI when uncertain, don't assume.
- P25: Tootsie tests only — no vitest/jest functional tests.

## Shell & Tooling
- Web4 test shells MUST be initialized: cd UpDown && bash --init-file source.env
- Prompt shows [web4 0.3.23.1 | user@host] when properly initialized
- otmux pane.lock <pane> <title> for persistent pane titles (not rename, not title)
- otmux rename = session rename, NOT pane rename
- claudeCode fork <uuid> to clone agent into another pane
- Ask oosh-expert at ooshTeam:0.1 for otmux help — don't guess methods

## Component Self-Care
- Every component needs ./component CLI script (npm start fails without it)
- CLI scripts must self-register: create scripts/versions/{name}-v{version} symlink on first run
- PROJECT_ROOT derived from component's own path (3 levels up), never from $PWD
- source.env log init must guard against invalid PROJECT_ROOT (check components/ dir exists)

## Architecture Decisions
- ArtefactModel, FileModel are NOT in @web4x/ucp — they're ONCE-specific filesystem types
- When extracting boundary files, copy layer3 deps as local files, not as @web4x/* re-exports (if the type doesn't exist in the target package)
- UcpComponent path helpers are protected (not public) — implementation detail for subclasses
- ScenarioManager stays in ONCE — too many ONCEPeerModel deps
- HTTPSServer bridges HTTP+TLS — needs @web4x/tls dep in HTTP package.json

## CMM
- Web4 = CMM4 = self-optimizing systems
- Composed maturity = weakest link — one L1 capability drags everything to L1
- Assuming = L2, measuring = L3, PDCA feedback loop = L4
- "Wer schreibt, der bleibt" (who writes, stays) = CMM3
- "Wer misst, der weiss" (who measures, knows) = CMM4

## Team Protocol
- Expert does NOT test — tester owns test execution
- Expert does NOT drive tester's shell
- When stuck on oosh/otmux, ASK the oosh-expert — don't trial-and-error
- Never send keystrokes to panes with pending prompts — verify state first
- Queue incoming prompts if busy — finish current task first
