## 2025-03-25 - [Fix XSS in VS Code Webview]
**Vulnerability:** XSS vulnerability in VS Code Webview where malformed file paths were incorrectly escaped.
**Learning:** Webview Content Security Policy allows 'unsafe-inline' scripts; all dynamic data must be rigorously HTML-escaped before interpolation into HTML strings. For inline JavaScript event handlers (e.g., onclick, onkeydown), data must be appropriately JavaScript-escaped AND HTML-escaped.
**Prevention:** Always use dedicated `_escapeHtml` and `_escapeJs` methods when inserting variables into webview templates, keeping nested contexts in mind.
## 2025-03-25 - [Fix Arbitrary Command Execution in Webview IPC]
**Vulnerability:** Arbitrary command execution vulnerability in VS Code Webview where incoming IPC messages directly executed `data.command` without validation.
**Learning:** VS Code Webviews must be treated as untrusted boundaries. Even if the webview HTML is generated locally, incoming IPC messages must be strictly validated against a static allowlist before execution to prevent arbitrary command execution vulnerabilities on the host machine.
**Prevention:** Always use a static `ALLOWED_COMMANDS` Set to validate `data.command` in the `onDidReceiveMessage` event handler before passing it to `vscode.commands.executeCommand`.
