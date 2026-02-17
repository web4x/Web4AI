# Action: Send a Message to a Peer Agent

**Automated**: `hiveMind send.message <name> <message>` — CMM3

1. Capture target pane first — assess current state
2. If permission prompt visible: read options, send correct number (see unblock-permission.md)
3. Clear input: `otmux send <target> C-u`
4. Send message: `otmux send.verified <target> "message"`
5. Capture pane again — verify message was submitted
6. If not submitted: send Enter, re-verify
