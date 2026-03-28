## 2024-10-26 - Prevent Arbitrary Command Execution in Webview
**Vulnerability:** The webview message handler in SidebarProvider allowed execution of any `vscode.commands.executeCommand` because it lacked validation on the command string.
**Learning:** Webviews can be an XSS vector. If a webview can execute extension commands without restriction, an attacker could potentially execute any VS Code command.
**Prevention:** Strictly validate or whitelist command strings before passing them to `vscode.commands.executeCommand` (e.g., checking `command.startsWith('quell.')`).
