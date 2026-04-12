## 2024-04-12 - Fix Webview Arbitrary Command Execution
**Vulnerability:** Webview arbitrary command execution where unvalidated messages from webviews could be directly passed to `vscode.commands.executeCommand`.
**Learning:** Webviews must be treated as untrusted boundaries. Unchecked commands sent via IPC can lead to arbitrary command execution on the host system.
**Prevention:** Strictly validate incoming IPC messages against a static allowlist (`ALLOWED_COMMANDS` Set) before executing any commands from webviews.
