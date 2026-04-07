
## 2024-05-18 - [Webview Command Execution Validation]
**Vulnerability:** Arbitrary command execution via VS Code Webview IPC in `SidebarProvider.onDidReceiveMessage`. The `data.command` was blindly passed to `vscode.commands.executeCommand(data.command)` without validation, allowing a potentially compromised webview (due to XSS or malicious postMessage) to execute any registered VS Code command.
**Learning:** Webviews must be treated as untrusted boundaries. Even if the webview HTML is generated locally, a single injection vulnerability could lead to arbitrary command execution on the host machine.
**Prevention:** Maintain a strict, static `Set` of allowed commands (`ALLOWED_COMMANDS`) and validate all incoming IPC commands against it before passing them to `executeCommand`.
