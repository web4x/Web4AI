# Action: Recover from a Cold Start

Cold start = infrastructure destroyed. Files survive, processes don't.

1. Run `tmux list-sessions` — verify which sessions exist
2. Run `tmux list-panes -a` — find where agents are now
3. Read learnings file — identity survives cold start
4. Read context file — state is directional but pane references are STALE
5. Update ALL pane references in context file to match actual infrastructure
6. Find peer in new pane layout (check titles, registry)
7. Capture peer pane — assess their state
8. Update context file with correct infrastructure
9. Start monitoring loop targeting correct pane
10. Tell peer you're alive at the new location
