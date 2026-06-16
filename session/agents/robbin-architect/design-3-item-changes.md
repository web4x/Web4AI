# Design: 3 rb-object-item Changes

## (1) CHILD-COUNT BADGE — red circle LEFT of expander

**render() change** (line 93): insert badge span before oi-expand when has-children:

```js
${hasChildren ? `<span class="oi-badge">${childCount}</span><span class="oi-expand">›</span>` : ''}
```

childCount source: `getAttribute('child-count') || '0'`. RoomView sets `child-count` attr on Members/Files folder nodes. /trace tree sets it when rendering children.

**CSS:**
```css
.oi-badge { background: #e53935; color: white; font-size: 0.65rem; font-weight: 700; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 0 4px; }
```

DOM order: `[icon] [content] [badge] [>]` — badge sits naturally left of expander in flex row.

## (2) DRAG HANDLE = ICON ONLY

**connectedCallback change:** remove `this.setAttribute('draggable','true')` from line 19.

**render() change:** add `draggable="true"` to .oi-icon span:
```html
<span class="oi-icon" title="${type}" draggable="true">${icon}</span>
```

**onDragStart:** rebind to .oi-icon instead of this:
- connectedCallback: `this.querySelector('.oi-icon')?.addEventListener('dragstart', this.onDragStart)`
- disconnectedCallback: cleanup same.

**setDragImage** stays `= this` (full card ghost per R19.21.B):
```js
dt.setDragImage(this, 20, 20)  // unchanged — shows full card as ghost
```

**CSS:** `.oi-icon { cursor: grab; }` `.oi-icon:active { cursor: grabbing; }`

## (3) ICON-TAP = SQUARE COLLAPSE (width shrink, keep height)

**Current R16.7:** icon tap toggles `[collapsed]` → .oi-content display:none + .oi-expand display:none + padding:4px gap:0. Shrinks BOTH width AND height.

**NEW:** icon tap toggles `[collapsed]` → content/expand/badge hidden, BUT item keeps min-height. Width collapses to icon-only square.

**CSS:**
```css
rb-object-item[collapsed] { padding: 4px; gap: 0; width: 40px; min-height: 40px; }
rb-object-item[collapsed] .oi-content { display: none; }
rb-object-item[collapsed] .oi-expand { display: none; }
rb-object-item[collapsed] .oi-badge { display: none; }
```

40px = .oi-icon 32px + 2*4px padding = perfect square. Height preserved via min-height. Tap again removes `[collapsed]`, full width restores.

## RECONCILIATION

- **R16.7 collapse:** PRESERVED — icon tap still toggles `[collapsed]`. Visual change: square (not tiny) + same height.
- **R19.21.B drag ghost:** PRESERVED — `setDragImage(this)` shows full card. Drag handle moves to icon only.
- **children-open/toggle-children:** UNCHANGED — expander click behavior untouched.
- **New:** badge + icon-only-drag + square-collapse = 3 orthogonal features, no conflicts.
