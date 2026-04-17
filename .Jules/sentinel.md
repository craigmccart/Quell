## 2025-03-25 - [Fix XSS in VS Code Webview]
**Vulnerability:** XSS vulnerability in VS Code Webview where malformed file paths were incorrectly escaped.
**Learning:** Webview Content Security Policy allows 'unsafe-inline' scripts; all dynamic data must be rigorously HTML-escaped before interpolation into HTML strings. For inline JavaScript event handlers (e.g., onclick, onkeydown), data must be appropriately JavaScript-escaped AND HTML-escaped.
**Prevention:** Always use dedicated `_escapeHtml` and `_escapeJs` methods when inserting variables into webview templates, keeping nested contexts in mind.
## 2025-04-17 - [Fix Command Execution Vulnerability in VS Code Webview]
**Vulnerability:** The webview accepted arbitrary commands via `postMessage` and blindly executed them with `vscode.commands.executeCommand(data.command)`, allowing a maliciously crafted workspace file displayed in the webview to execute arbitrary commands within the VS Code Extension Host.
**Learning:** `vscode.WebviewViewProvider` does not automatically sandbox `onDidReceiveMessage` to your extension's commands. A maliciously injected link or script in the webview can invoke ANY registered command in the user's VS Code instance if `vscode.commands.executeCommand(data.command)` is called without validation.
**Prevention:** Always use a static `Set` of explicitly allowed commands to strictly validate any command strings received from webviews before passing them to `executeCommand`.
