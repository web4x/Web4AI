[Back to Sprint 0](./planning.md)

# Task F2: sweep.detect false-positive hardening
[task:uuid:f2-fp-hardening]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (6 false-positive fixtures added)
  - [x] implementing (commit 1996c9a)
  - [x] testing (regex verified against 6 language comment markers)
- [x] QA Review
- [x] Done

## F2.1 — prose-scrub extended to strip all common line comments

Before:
```bash
grep -v '^[[:space:]]*#'                               # only shell #
```

After:
```bash
grep -vE '^[[:space:]]*(#|//|--|/\*|\*[^/]|<!--)'      # 6 comment styles
```

Covers:
- `#` — shell, Python, Ruby, Makefile, YAML, conf
- `//` — C, C++, JS, TS, Go, Rust, Java, Swift, CSS, Kotlin, Dart
- `--` — SQL, Haskell, Lua, Ada, Elm
- `/*` — C-family block comment open
- `*[^/]` — C-family block comment continuation (matches `* text` but not `*/`)
- `<!--` — HTML/XML/Markdown

## F2.2 — 6 false-positive fixtures added

At `test/test.data/sweep.detect/`:

| Fixture | Tests |
|---------|-------|
| `fp-js-slashslash-comment.txt` | `//` — JS source with rate-limit/subscription-limit words in comments |
| `fp-sql-dashdash-comment.txt` | `--` — SQL source with subscription-limit in comments |
| `fp-c-block-comment.txt` | `/*`+`*` — C source with APIConnectionError/ECONNREFUSED in comments |
| `fp-html-comment.txt` | `<!--` — HTML with MCP-disconnect in comments |
| `fp-python-docstring.txt` | `#` — Python with api-error/rate-limit in comments |
| `fp-menu-text-not-live.txt` | prose describing the permission menu without live ❯ |

Each must fall through to `active|none|info` — NOT flag the apparent state.

## Verification

```
$ cat <<'EOF' | grep -vE '^[[:space:]]*(#|//|--|/\*|\*[^/]|<!--)'
# shell comment — strip
// js comment — strip
-- sql comment — strip
/* c block open — strip
 * c block continuation — strip
<!-- html comment — strip
code line stays
  // indented js — strip
real content here
EOF
```
→ output: only `code line stays` + `real content here`. All 6 comment styles stripped. Indented variant also handled via `^[[:space:]]*` prefix.

## Commit

`1996c9a sweep.detect: prose-scrub strips //, --, /*, *, <!-- line comments + 6 false-positive fixtures (ref: task-f2-sweep-detect-false-positive-hardening.md)`
