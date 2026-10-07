#!/usr/bin/env python3
"""PreToolUse hook — SCRATCH-LOCATION GUARD.  *** DRAFT FOR REVIEW — NOT REGISTERED ***
Fires the scratch-location law (session/base-skills/scratch-location-law.md,
TRON 2026-10-06) at the MOMENT OF WRITING, instead of relying on recall.
Deploying it means adding it to .claude/settings.json PreToolUse = a change for
EVERY agent fleet-wide => needs TRON's GO (oopPO ruling 2026-10-07).

Blocks only CREATES (write, mkdir, redirect, cp/mv/ln dest, clone, worktree,
mktemp) whose target is under /tmp, /var/tmp or /root and NOT inside an
explicit allow-root.  Reads pass.  `rm <literal path>` passes (law: /tmp is for
cleanup only).  Unparseable input or unknown tool -> defer (exit 0, no opinion).

Harness-owned paths (/tmp/claude-0/... task outputs, /root/.claude/jobs/...)
are written by the HARNESS itself, not via tool calls, so this hook never sees
them.  An AGENT writing into its harness scratchpad IS blocked: the law forbids it.

Bash is TOKENIZED with shlex (quotes respected), never regex-scanned: a path
that only appears inside a quoted message (e.g. a report sent with otmux)
must not trigger — the rewind-autonomy hook's 'Up NN' regex blocked whole
report commands that merely mentioned the pattern.
"""
import sys, json, os, shlex

ALLOW_ROOTS = (
    "/var/dev/Workspaces/",                 # all repos (law governs placement INSIDE them)
    "/root/oosh/",                          # OOSH repo
    "/root/.claude/projects/",              # auto-memory (agents write it with Write)
    "/root/.claude/plans/",                 # plan-mode files
)
GUARDED = ("/tmp/", "/var/tmp/", "/root/")
CREATE_ALL_ARGS = {"mkdir", "touch"}        # every non-option arg is created
CREATE_LAST_ARG = {"cp", "mv", "ln", "install", "rsync"}  # destination = last arg
SEPARATORS = {";", "&&", "||", "|", "&", "(", ")", "\n"}

def decide(reason):
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason}}))
    sys.exit(0)

def resolve(path, cwd):
    p = os.path.expanduser(path)
    if not os.path.isabs(p):
        p = os.path.join(cwd or "/", p)
    return os.path.normpath(p) + ("/" if os.path.isdir(p) else "")

def forbidden(path, cwd):
    p = resolve(path, cwd)
    probe = p if p.endswith("/") else p + "/"
    if any(probe.startswith(a) for a in ALLOW_ROOTS):
        return None
    if any(probe.startswith(g) for g in GUARDED) or probe in ("/tmp/", "/root/"):
        return p
    return None

def deny_msg(what, p):
    return (f"SCRATCH-LOCATION LAW (TRON 2026-10-06): {what} -> {p} is OUTSIDE the "
            "allowed roots. Scratch lives ONLY in your component's own "
            "latest/test/gen (fixed names, wiped per run, never random). /tmp is for "
            "cleanup by literal path only. See session/base-skills/scratch-location-law.md. "
            "If this path is genuinely sanctioned, STOP and ask oopPO — do not work around the guard.")

def check_bash(cmd, cwd):
    try:
        lex = shlex.shlex(cmd, posix=True, punctuation_chars=";&|()<>")
        lex.whitespace_split = True
        toks = list(lex)
    except ValueError:
        return  # unbalanced quotes etc. -> no opinion
    i, at_cmd_pos, cur = 0, True, None
    args = []
    def flush():
        if not cur:
            return
        plain = [a for a in args if not a.startswith("-")]
        if cur == "mktemp":
            decide("SCRATCH-LOCATION LAW: mktemp creates a RANDOM scratch dir — forbidden "
                   "(fixed names only, in your component's latest/test/gen).")
        if cur in CREATE_ALL_ARGS:
            for a in plain:
                p = forbidden(a, cwd)
                if p: decide(deny_msg(cur, p))
        if cur in CREATE_LAST_ARG and len(plain) >= 2:
            p = forbidden(plain[-1], cwd)
            if p: decide(deny_msg(cur, p))
        if cur == "tee":
            for a in plain:
                p = forbidden(a, cwd)
                if p: decide(deny_msg("tee", p))
        if cur == "git" and plain[:1] == ["clone"] and len(plain) >= 3:
            p = forbidden(plain[-1], cwd)
            if p: decide(deny_msg("git clone", p))
        if cur == "git" and plain[:2] == ["worktree", "add"] and len(plain) >= 3:
            p = forbidden(plain[2], cwd)
            if p: decide(deny_msg("git worktree add", p))
    while i < len(toks):
        t = toks[i]
        if t in (">", ">>", ">|", "&>", "&>>") and i + 1 < len(toks):
            p = forbidden(toks[i + 1], cwd)
            if p: decide(deny_msg("redirect", p))
            i += 2; continue
        if t in SEPARATORS:
            flush(); cur, args, at_cmd_pos = None, [], True
            i += 1; continue
        if at_cmd_pos:
            if "=" in t and not t.startswith("="):   # VAR=value prefix
                i += 1; continue
            cur, args, at_cmd_pos = os.path.basename(t), [], False
        else:
            args.append(t)
        i += 1
    flush()

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)
tool = data.get("tool_name")
inp = data.get("tool_input") or {}
cwd = data.get("cwd") or os.getcwd()
if tool in ("Write", "Edit", "NotebookEdit"):
    path = inp.get("file_path") or inp.get("notebook_path") or ""
    p = forbidden(path, cwd) if path else None
    if p:
        decide(deny_msg(tool, p))
elif tool == "Bash":
    check_bash(inp.get("command") or "", cwd)
sys.exit(0)
