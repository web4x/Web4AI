# Bug: sprint.json traceability view — always shows same content, ignores scenario parameter

**Priority**: HIGH
**Date**: 2026-06-03
**From**: Tron directive

## Problem

Clicking on sprint.json goes to the traceability view but:
1. **Always shows the same content** regardless of the provided scenario parameter
2. Does NOT scroll to the selected element
3. Does NOT open the element's details

## Required Behavior

1. **Scroll to selected element** — the scenario parameter determines which item to focus
2. **Open its details** — show the selected element's detail view
3. **For sprint.json specifically**: show ONLY that item's view, then **lazy-load children** — don't load the entire tree upfront

## Key Principle

The scenario parameter is the navigation target. The view must respect it:
- `sprint.json?scenario=<uuid>` → scroll to that UUID, open details
- For sprint-level views: show the sprint item first, lazy-load tasks/subtasks on demand
- NOT: load everything then ignore the parameter

## Acceptance Criteria

- [ ] Clicking sprint.json with different scenario parameters shows different content
- [ ] View scrolls to the selected element
- [ ] Selected element's details are open/expanded
- [ ] Sprint view shows only the item, children lazy-loaded
- [ ] No full-tree preload (performance)
