# Task: Compact PO at ooshDebug:0.0

**From**: PO
**Date**: 2026-02-26
**Priority**: IMMEDIATE

## What

PO (product-owner) is at 92% context at `ooshDebug:0.0`. Needs compact.

## Your Actions

1. Send `/compact` to PO's pane: `hiveMind send product-owner "/compact"` then `hiveMind send product-owner "Enter"`
2. Wait 10s, capture pane: `otmux pane.capture ooshDebug:0.0 15`
3. Verify compact happened (should see "Compacted" message)
4. If boot prompt appears at `❯` but isn't submitted, send Enter: `otmux send ooshDebug:0.0 "" Enter`
5. Wait for PO to boot (should read boot.md automatically)
6. Verify PO is alive: `otmux pane.capture ooshDebug:0.0 20`

## PO Location

- **Pane**: `ooshDebug:0.0`
- **Role**: product-owner (registered in hivemind.roles.env as TRONinterface:0.0 but actually running at ooshDebug:0.0)

## After PO Boots

PO has an approved plan (PDCA-1.2) and will start executing it. No further action needed from you after verifying PO is alive.

## Boot file location

`session/agents/product-owner/boot.md` — already saved and committed.
