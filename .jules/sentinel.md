## 2024-05-20 - Arbitrary Command Execution via Webview Messaging
**Vulnerability:** The webview message handler in `SidebarProvider.ts` blindly passed arbitrary command strings from the webview to `vscode.commands.executeCommand`. If an attacker achieved XSS in the webview (e.g. via an unsanitized path), they could execute any VS Code command.
**Learning:** `vscode.commands.executeCommand` is a powerful API. Since webviews can run untrusted content and are susceptible to XSS, any messages they send back to the extension host must be treated as untrusted input and strictly validated.
**Prevention:** Always whitelist or validate command strings originating from webviews. For example, ensure the command starts with the extension's prefix (`quell.`).
