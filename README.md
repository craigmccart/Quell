# 🛡️ VyberGuard

![Hero Banner](assets/hero-banner.png)

**Stop leaking secrets to AI.** VyberGuard intercepts your prompts, scans for API keys, tokens, passwords, and connection strings — and replaces them with secure placeholders before the AI ever sees them. Real values are stored safely in your OS Keychain.

> 100% offline. Zero network calls. Zero telemetry. Your secrets never leave your machine.

---

## 🚨 The Problem

Every time you paste code into an AI chat (Copilot, Cursor, Windsurf, Antigravity), secrets get silently transmitted to cloud-hosted models:

| What You Do | What Leaks |
|---|---|
| Paste `.env` asking "why won't my DB connect?" | Database passwords, API keys |
| Copy `payment.ts` asking "why is Stripe failing?" | `sk_live_XXXXXXX` (live Stripe key) |
| AI IDE indexes your workspace | Every `.env`, `config.json`, `credentials.yml` |

**VyberGuard is the security layer between you and the AI.**

---

## ⚡ How It Works

![How It Works](assets/how-it-works.png)

1. **You write code** with real secrets
2. **VyberGuard scans** using 75+ regex patterns + Shannon entropy analysis
3. **AI receives safe placeholders** — `{{SECRET_xxx}}` instead of your real keys

```diff
# Before (DANGEROUS)
- STRIPE_KEY=sk_live_51Mzxyz123abcABCDEF
- DATABASE_URL=postgres://admin:p4ssw0rd@db.example.com:5432/mydb

# After VyberGuard (SAFE)
+ STRIPE_KEY={{SECRET_52c14bbbc02e}}
+ DATABASE_URL={{SECRET_f6d2e5e49c86}}
+ AWS_REGION=us-east-1  ← non-secret, left unchanged
```

---

## ✨ Features

### 📋 Copy Redacted (`Ctrl+Shift+C`)
Select code → press the shortcut → paste into any AI chat. Secrets are replaced, non-secrets are preserved. The primary workflow.

### 📥 Sanitized Paste (`Ctrl+Shift+V`)
Paste from any source with secrets automatically stripped. Works with code copied from browsers, terminals, or other files.

### 🔍 75+ Secret Patterns
Regex-based detection covering:

| Category | Examples |
|---|---|
| **Cloud** | AWS (`AKIA...`), Google Cloud, Azure |
| **AI/ML** | OpenAI, Anthropic, Hugging Face, Gemini |
| **Payments** | Stripe (`sk_live_...`), Square, PayPal |
| **Version Control** | GitHub PATs, GitLab, Bitbucket |
| **Communication** | Slack, Discord, Telegram, Twilio |
| **Databases** | PostgreSQL, MongoDB, Redis, MySQL URIs |
| **Auth** | JWTs, Bearer tokens, Basic Auth, OAuth |
| **Crypto** | RSA, EC, OpenSSH, PGP private keys |
| **Hosting** | Vercel, Netlify, Heroku, DigitalOcean, Fly.io |
| **+ 30 more** | SendGrid, Shopify, Datadog, NPM, PyPI... |

### 📊 Shannon Entropy Analysis
Catches high-randomness tokens that don't match any known pattern — configurable threshold and minimum token length.

### 🤖 AI Indexing Shield
One-click toggle that generates `.cursorignore`, `.windsurfignore`, `.antigravityignore`, `.aiderignore`, and `.aiignore` files — blocking AI IDEs from silently indexing your secret files.

### ⚡ Clipboard Sentry
Passive clipboard monitoring that warns you within 3 seconds when a secret is on your clipboard. Purely informational — never modifies your data.

### 🔒 Secure Storage
Secrets stored in your **OS Keychain** via VS Code's SecretStorage API (Windows Credential Manager / macOS Keychain / libsecret). Never written to disk in plaintext. Restorable anytime.

### 📝 Inline Decorations
`{{SECRET_xxx}}` placeholders get orange dashed borders and 🔒 icons in the editor. Hover for restore options.

### 💬 Chat Participant (`@vyberguard`)
Talk to `@vyberguard` in VS Code's chat panel. Every prompt is scanned before it reaches the AI. Use `/context` to safely share `.env` file structure.

### ⚠️ Save Warning
Get notified when saving a file that still contains raw secrets — with a one-click "Redact Now" option.

---

## ⚙️ Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `vyberguard.enableEntropyScanning` | `true` | Enable Shannon Entropy analysis |
| `vyberguard.entropyThreshold` | `4.5` | Minimum entropy to flag (2.0–7.0) |
| `vyberguard.minimumTokenLength` | `20` | Minimum token length for entropy scanning |
| `vyberguard.customPatterns` | `[]` | Custom regex patterns (`[{name, regex}]`) |
| `vyberguard.whitelistPatterns` | `[]` | Regex patterns to exclude from detection |
| `vyberguard.showInlineDecorations` | `true` | Show inline decorations for placeholders |
| `vyberguard.confirmBeforeRedact` | `true` | Confirmation dialog before file redaction |

---

## 📦 Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| Copy Redacted | `Ctrl+Shift+C` | Copy with secrets redacted |
| Sanitized Paste | `Ctrl+Shift+V` | Paste with secrets stripped |
| Redact Active File | — | Redact all secrets in current file |
| Redact Selection | — | Redact secrets in selected text |
| Restore Secrets | — | Restore placeholders from Keychain |
| Scan Workspace | — | Full workspace secret audit |
| Show Log | — | Open the VyberGuard output panel |

---

## 🔐 Privacy & Security

- **100% offline** — zero network calls, zero telemetry, zero external APIs
- **OS Keychain storage** — secrets encrypted at rest by your operating system
- **Non-destructive** — real values always restorable from the Keychain
- **Open source** — [audit the code yourself](https://github.com/craigmccart/VyberGuard)

---

## 🤝 Compatible IDEs

| IDE | Supported | AI Shield |
|-----|-----------|-----------|
| VS Code | ✅ | `.aiignore` |
| Cursor | ✅ | `.cursorignore` |
| Windsurf | ✅ | `.windsurfignore` |
| Antigravity | ✅ | `.antigravityignore` |
| Aider | ✅ | `.aiderignore` |

---

## 🚀 Getting Started

1. Install VyberGuard (VSIX or Marketplace)
2. Open any workspace
3. Press `Ctrl+Shift+C` to copy code safely for AI chat
4. Enable the **AI Indexing Shield** in the sidebar to block AI file indexing
5. Use `@vyberguard /context` to safely share `.env` structure

---

## 📄 License

[MIT](LICENSE) — free and open source.
