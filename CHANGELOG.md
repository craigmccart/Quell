# Changelog

All notable changes to VyberGuard will be documented in this file.

## [2.0.0] - 2026-03-05

### ✨ Rebrand & Redesign
- **Renamed from VibeGuard to VyberGuard** — new identity across all UI, commands, and branding
- **Premium sidebar redesign** — glassmorphism cards, teal accent gradients, pulse animations, breathing status dot, shimmer effects, and refined typography
- **Updated extension icon** — sleek shield + lock design

### Fixed
- Payment provider regex (Stripe, PayPal, Square) now catches a wider range of key formats, including keys with underscores and varying lengths
- Sidebar "Intercepted" label renamed to "Detected" for clarity — Scan All finds secrets, it doesn't redact them
- Stale "VibeGuard" references cleaned up across all files

## [1.5.0] - 2026-02-28

### Added
- **AI Indexing Shield** — one-click protection that generates `.cursorignore`, `.windsurfignore`, `.antigravityignore`, `.aiderignore`, and `.aiignore` files to block AI IDEs from reading secret files
- **Copy Redacted** (`Ctrl+Shift+C`) — copies selected text with secrets replaced by `{{SECRET_...}}` placeholders, ready to paste into any AI chat
- **Sanitized Paste** (`Ctrl+Shift+V`) — pastes clipboard content with secrets automatically stripped
- **Clipboard Sentry** — passive clipboard monitoring that warns when a secret is detected on your clipboard (polls every 3 seconds, purely informational)
- **Vibe Check** — automatic first-install workspace scan with actionable "Enable AI Shield" notification
- **Premium sidebar dashboard** — activity bar panel with shield toggle, session stats, findings list, tool grid, and engine info
- **Exposure badge** in status bar showing raw secret count after workspace scan

### Changed
- Status bar now shows multiple states: idle, AI Shield ON, scanning, alert, clean
- Sidebar includes live session statistics (scans count, detected secrets)

## [1.1.0] - 2026-02-23

### Added
- 75+ secret detection patterns (up from 14) covering AWS, Google, Azure, OpenAI, Anthropic, Stripe, GitHub, GitLab, Slack, Discord, JWTs, database connection strings, private keys, and more
- Shannon Entropy analysis for catching unknown/proprietary API keys
- Status bar indicator with live scanning/alert/safe states
- Dedicated Output Channel logging ("VyberGuard" in Output panel)
- User-configurable settings: entropy toggle, threshold, min token length, custom patterns, whitelisting, inline decorations, confirmation dialog
- Inline editor decorations for placeholder tokens (orange borders + 🔒 icons)
- "Redact Selection" command with context menu integration
- "Scan Workspace" command for full project scanning
- File save watcher that warns about raw secrets
- Confirmation dialog before file redaction
- Comprehensive test suite (56 tests)
- README and extension icon

### Fixed
- Basic Auth regex was broken (only matched 1 character instead of full credentials)
- `EnvManager` used blocking `fs.readFileSync` — now uses async `vscode.workspace.fs.readFile`
- Placeholder IDs now use `crypto.randomUUID()` instead of `Math.random()`
- Removed overly broad Postmark/UUID regex that caused false positives
- Added `.env` to `.gitignore` (was missing — security risk)

## [1.0.0] - 2026-02-19

### Added
- Initial extension skeleton with Chat Participant
- Basic secret detection (14 regex patterns)
- Shannon Entropy scanning
- Redact Active File command
- Restore Secrets command
- Hover provider for placeholders
