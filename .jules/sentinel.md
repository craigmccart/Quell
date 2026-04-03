## 2025-01-20 - Webview Arbitrary Command Execution Vulnerability
**Vulnerability:** Arbitrary command execution via VS Code Webview `onDidReceiveMessage` event.
**Learning:** The webview accepted command strings directly from postMessage and passed them unvalidated to `vscode.commands.executeCommand`. If an attacker could inject XSS into the webview (e.g., through unescaped file paths), they could execute arbitrary built-in VS Code commands, potentially leading to local file access, terminal execution, or installing malicious extensions.
**Prevention:** Always validate or whitelist command strings received from webviews before execution. Ensure all extension commands are prefixed uniquely (e.g., `quell.`) and check for this prefix before calling `executeCommand`.
