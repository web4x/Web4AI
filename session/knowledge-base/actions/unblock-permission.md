# Action: Unblock a Permission Prompt

**Automated**: `hiveMind unblock <name|all>` — CMM3

1. Capture the stuck pane: `otmux pane.capture <target> 15`
2. READ the options — identify the pattern:
   - "1. Yes / 2. No" -> send `1`
   - "1. Yes / 2. Yes, allow from project" -> send `2`
3. Send the correct number: `otmux send.verified <target> "<number>" Enter`
4. Capture pane again — verify the prompt cleared
5. If not cleared: the send may not have landed. Retry once.
