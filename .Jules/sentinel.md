## 2025-03-25 - [Fix XSS in VS Code Webview]
**Vulnerability:** XSS vulnerability in VS Code Webview where malformed file paths were incorrectly escaped.
**Learning:** Webview Content Security Policy allows 'unsafe-inline' scripts; all dynamic data must be rigorously HTML-escaped before interpolation into HTML strings. For inline JavaScript event handlers (e.g., onclick, onkeydown), data must be appropriately JavaScript-escaped AND HTML-escaped.
**Prevention:** Always use dedicated `_escapeHtml` and `_escapeJs` methods when inserting variables into webview templates, keeping nested contexts in mind.## 2026-04-16 - [Arbitrary Command Execution in Webview]
**Vulnerability:** The `SidebarProvider` directly executed commands received from the untrusted webview context (`vscode.commands.executeCommand(data.command)`) without validation.
**Learning:** VS Code Webviews must be treated as untrusted boundaries. Any IPC messages received from a webview must be strictly validated against a static allowlist before execution to prevent arbitrary command execution vulnerabilities on the host machine.
**Prevention:** Always implement a strict allowlist of approved commands (e.g., using a `Set`) and validate the `data.command` property against this list before calling `vscode.commands.executeCommand`.
