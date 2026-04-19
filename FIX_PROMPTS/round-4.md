# Round 4 — Prompt for Claude Code

## Context

Working in: `C:\Users\craig\Github Repos\Quell` on branch `main`.

Round 3 landed 4 commits (CI scaffolding, UUID bump, clearVault command, redactTestKeys setting).
Tests are at 60/60. This round is: bug fix (broken demo), version bump + CHANGELOG, README polish,
DiagnosticProvider cleanup, npm publish prep, and .Jules rename.

Run `npm run compile` and `npm test` after each commit batch to confirm 60/60 stays green.

---

## Commit 1 — Fix broken demo + update related copy

### Why this matters

`quell.redactTestKeys` defaults to `false`, which means `AKIAIOSFODNN7EXAMPLE` is now silently
skipped by the scanner. The demo file (opened by `quell.openDemo`) only contains that key and the
matching AWS Secret Access Key. With the default setting, neither gets flagged — the demo shows
nothing. The Getting Started walkthrough step 2 tells users to "watch Quell flag it in real time"
and "use the Quick Fix lightbulb" — both of which are now broken.

Fix: replace the demo file contents with credentials that are NOT in the TEST_CREDENTIALS skip
list, so they fire reliably regardless of the `redactTestKeys` setting.

### In `src/extension.ts` — openDemoCmd (around line 858)

Replace the content array passed to `openTextDocument`. Current content:

```typescript
content: [
    '# Quell Demo — these are fake, officially-published test credentials',
    '# Try the Quick Fix lightbulb (or press Ctrl+.) on the line below',
    '',
    'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE',
    'AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
].join('\n'),
```

Replace with:

```typescript
content: [
    '# Quell Demo — fake credentials for testing (safe to share)',
    '# Watch the yellow squiggles appear, then press Ctrl+. for Quick Fix',
    '',
    '# GitHub Personal Access Token (fake)',
    'GITHUB_TOKEN=ghp_ABCDEFabcdef1234567890abcdef123456',
    '',
    '# PostgreSQL connection string (fake)',
    'DATABASE_URL=postgresql://admin:S3cr3tP4ssw0rd@db.example.com:5432/myapp',
    '',
    '# OpenAI Project Key (fake)',
    'OPENAI_API_KEY=sk-proj-ABCDEFabcdef1234567890ABCDEFabcdef1234567890ab',
].join('\n'),
```

These patterns match GitHub PAT (`ghp_` + 36 chars), PostgreSQL URI (password in connection string),
and OpenAI project key (`sk-proj-` + 40+ chars) — all covered by built-in regex patterns and none
in `TEST_CREDENTIALS`, so they fire at default settings.

### In `package.json` — walkthrough step 2 description (around line ~316)

Find the step with `"id": "quell.demo"` and update its description to match the new demo content:

Current description:
```
"description": "Click below to open a demo file with a fake AWS key. Watch Quell flag it in real time — then use the Quick Fix lightbulb (or Ctrl+.) to redact it.\n\n[Open demo file](command:quell.openDemo)",
```

Replace with:
```
"description": "Click below to open a demo file with fake GitHub, Stripe, and OpenAI credentials. Watch the yellow squiggles appear — then use the Quick Fix lightbulb (or Ctrl+.) to redact them.\n\n[Open demo file](command:quell.openDemo)",
```

### Commit message
```
git add src/extension.ts package.json
git commit -m "Fix demo file — replace AKIA test key with credentials that fire at default settings"
```

---

## Commit 2 — Version bump to v2.5.0 + CHANGELOG entry

### In `package.json` — root

Change `"version": "2.4.0"` to `"version": "2.5.0"`.

Also update the README code diff example which still shows 12-char UUIDs.
In `README.md`, find this block:
```
+ STRIPE_KEY={{SECRET_52c14bbbc02e}}
+ DATABASE_URL={{SECRET_f6d2e5e49c86}}
```
Replace with (16-char UUIDs):
```
+ STRIPE_KEY={{SECRET_52c14bbbc02ef7a1}}
+ DATABASE_URL={{SECRET_f6d2e5e49c86a3b2}}
```

### In `CHANGELOG.md` — add at the top (before `## [2.4.0]`)

```markdown
## [2.5.0] - 2026-04-17

### 🛡️ Vault Management
- **Clear Vault command** — `Quell: Clear Vault (delete all stored secrets)` permanently removes all secrets from the OS Keychain. Uses a `globalState`-backed index (since VSCode SecretStorage has no enumeration API) to track which placeholders have been stored. Includes a modal confirmation before deleting.

### ⚙️ Test Key Filtering
- **`quell.redactTestKeys` setting** (default: `false`) — officially-published test/demo credentials (e.g. `AKIAIOSFODNN7EXAMPLE`) are now left alone by default, since they are intentionally safe and appear in READMEs and tutorials. Set to `true` to redact them like any other secret.

### 🔒 Security Hygiene
- **Placeholder length increased** — `{{SECRET_...}}` identifiers now use 16 hex characters (up from 12) for better collision resistance across large vaults.
- **CodeQL CI** — GitHub Actions workflow added: CodeQL security scan runs on every push/PR to `main` and weekly. Uses `security-extended` + `security-and-quality` query suites. The security tool now scans itself.

### 📋 Contribution scaffolding
- Added `CONTRIBUTING.md`, issue templates (bug, feature, pattern suggestion), and security advisory redirect.
```

### Commit message
```
git add package.json CHANGELOG.md README.md
git commit -m "Bump to v2.5.0, update CHANGELOG, fix UUID length in README example"
```

---

## Commit 3 — README: add missing commands and settings

### In `README.md`

**1. Add `clearVault` and `redactTestKeys` to the Configuration table.**

Find the configuration table (has `quell.autoSanitizeClipboard` as its last row). Add two rows after the `autoSanitizeClipboard` row:

```markdown
| `quell.redactTestKeys` | `false` | Redact officially-published test credentials (e.g. `AKIAIOSFODNN7EXAMPLE`) |
| `quell.clearVault` | — | Command: delete all stored secrets from the OS Keychain |
```

Actually `clearVault` is a command not a setting, so just add the setting row:
```markdown
| `quell.redactTestKeys` | `false` | Redact officially-published test credentials (e.g. `AKIAIOSFODNN7EXAMPLE`) |
```

**2. Add `clearVault` to the Commands table.**

Find the Commands table (ends with `Show Log`). Add a row:
```markdown
| Clear Vault | — | Delete all stored secrets from the OS Keychain |
```

**3. The README screenshot section** — the three screenshot lines are commented out. Leave them commented for now (screenshots still need to be taken). But change the placeholder filenames to be accurate:

Find this block:
```
<!-- Screenshots — drop PNGs into assets/ and uncomment these lines
![Quell sidebar dashboard](assets/screenshot-sidebar.png)
![Inline diagnostics and Quick Fix](assets/screenshot-diagnostics.png)
![Before and after redaction](assets/screenshot-redaction.png)
-->
```

Leave it as-is. Screenshots are round 5 work.

### Commit message
```
git add README.md
git commit -m "README: add clearVault command and redactTestKeys setting to docs tables"
```

---

## Commit 4 — DiagnosticProvider: use shared getConfig()

Currently `DiagnosticProvider.updateDiagnostics()` assembles a `ScannerConfig` inline by reading
each setting individually. The shared `getConfig()` function in `extension.ts` already does this
correctly (including custom pattern validation with warning deduplication). The diagnostic provider
duplicates this and will drift over time.

The problem: `getConfig()` is a module-level function in `extension.ts`, not exported. The cleanest
fix is to move `getConfig()` (and the `_warnedPatterns` Set it depends on) into a shared module, OR
just export it from `extension.ts`. Since `DiagnosticProvider` is already in the same extension
build context, exporting it is the simplest approach.

### In `src/extension.ts`

Change:
```typescript
function getConfig(): ScannerConfig {
```
To:
```typescript
export function getConfig(): ScannerConfig {
```

### In `src/DiagnosticProvider.ts`

At the top, add `getConfig` to the import from extension... wait, that creates a circular import
(`extension.ts` imports `DiagnosticProvider`, `DiagnosticProvider` would import `extension.ts`).

**Alternative: move getConfig to its own file.**

Create `src/configHelper.ts`:

```typescript
import * as vscode from 'vscode';
import { ScannerConfig, DEFAULT_CONFIG } from '../packages/scanner/src';
import { Logger } from './Logger';

const _warnedPatterns = new Set<string>();

export function getConfig(): ScannerConfig {
    const cfg = vscode.workspace.getConfiguration('quell');
    const rawPatterns = cfg.get<Array<{ name: string; regex: string }>>('customPatterns', DEFAULT_CONFIG.customPatterns);
    const customPatterns: Array<{ name: string; regex: string }> = [];
    for (const p of rawPatterns) {
        try {
            new RegExp(p.regex);
            customPatterns.push(p);
        } catch (e) {
            const key = `${p.name}::${p.regex}`;
            if (!_warnedPatterns.has(key)) {
                _warnedPatterns.add(key);
                Logger.warn(`Custom pattern "${p.name}" has an invalid regex and will be skipped: ${e instanceof Error ? e.message : String(e)}`);
            }
        }
    }
    return {
        enableEntropy: cfg.get<boolean>('enableEntropyScanning', DEFAULT_CONFIG.enableEntropy),
        entropyThreshold: cfg.get<number>('entropyThreshold', DEFAULT_CONFIG.entropyThreshold),
        minimumTokenLength: cfg.get<number>('minimumTokenLength', DEFAULT_CONFIG.minimumTokenLength),
        customPatterns,
        whitelistPatterns: cfg.get<string[]>('whitelistPatterns', DEFAULT_CONFIG.whitelistPatterns),
        redactTestKeys: cfg.get<boolean>('redactTestKeys', DEFAULT_CONFIG.redactTestKeys),
    };
}
```

### In `src/extension.ts`

Remove the `_warnedPatterns` Set and `getConfig()` function entirely (they move to configHelper.ts).
Add import at the top:
```typescript
import { getConfig } from './configHelper';
```

### In `src/DiagnosticProvider.ts`

Replace the inline config-building block in `updateDiagnostics()` — currently:
```typescript
const config = vscode.workspace.getConfiguration('quell');
const enableEntropy = config.get<boolean>('enableEntropyScanning', DEFAULT_CONFIG.enableEntropy);
const scannerConfig: ScannerConfig = {
    enableEntropy,
    entropyThreshold: config.get<number>('entropyThreshold', DEFAULT_CONFIG.entropyThreshold),
    minimumTokenLength: config.get<number>('minimumTokenLength', DEFAULT_CONFIG.minimumTokenLength),
    customPatterns: config.get<Array<{ name: string; regex: string }>>('customPatterns', DEFAULT_CONFIG.customPatterns),
    whitelistPatterns: config.get<string[]>('whitelistPatterns', DEFAULT_CONFIG.whitelistPatterns),
    redactTestKeys: config.get<boolean>('redactTestKeys', DEFAULT_CONFIG.redactTestKeys),
};
```

Replace with:
```typescript
const scannerConfig = getConfig();
```

Add the import at the top of `DiagnosticProvider.ts`:
```typescript
import { getConfig } from './configHelper';
```

And remove the now-unused imports from DiagnosticProvider (if `ScannerConfig` and `DEFAULT_CONFIG`
are no longer referenced directly — check after the change and clean up).

After making these changes, run `npm run compile` to verify there are no import errors, then
`npm test` to confirm 60/60.

### Commit message
```
git add src/configHelper.ts src/extension.ts src/DiagnosticProvider.ts
git commit -m "Extract getConfig() to configHelper.ts, eliminating duplicate config-reading in DiagnosticProvider"
```

---

## Commit 5 — npm publish prep for @quell/scanner

The `packages/scanner/package.json` is nearly publish-ready. One gap: the `@quell` scope on npm
is private by default. Without `publishConfig`, `npm publish` will fail with "402 Payment Required"
because it thinks you want a private package under a paid scope plan.

### In `packages/scanner/package.json`

Add `publishConfig` after the `"license"` field:

```json
"publishConfig": {
    "access": "public"
},
```

Also verify (don't change if already correct):
- `"main": "dist/index.js"` ✓
- `"types": "dist/index.d.ts"` ✓
- `"files": ["dist", "README.md", "LICENSE"]` ✓
- `"version": "0.1.0"` — leave at 0.1.0 for first publish

### Commit message
```
git add packages/scanner/package.json
git commit -m "Add publishConfig to @quell/scanner package.json for public npm scoped publish"
```

---

## Commit 6 — .Jules rename (cosmetic git hygiene)

The directory `.Jules/` should be lowercase `.jules/` to match the tool's convention. Git on
Windows may not see a case-only rename as a change without force. Do this in two steps:

```
git mv .Jules .jules_tmp
git mv .jules_tmp .jules
git add -A
git commit -m "Rename .Jules/ to .jules/ (case convention)"
```

If git mv fails (Windows case-insensitive filesystem), an alternative is:
```
git rm -r --cached .Jules
git add .jules
git commit -m "Rename .Jules/ to .jules/ (case convention)"
```

---

## After all commits — push and update PROJECT_STATUS.md

```
git push origin main
```

Then update `PROJECT_STATUS.md`:
- Move round 4 commits into "What's landed"
- Round 5 notes: screenshots (3 PNGs: sidebar, diagnostics, redaction-before-after),
  then do the actual `npm publish` from packages/scanner/ (run `npm run build` first),
  then marketplace version bump + vsix build + publish.

---

## Compile and test verification

After every commit, Claude Code should run:
```
npm run compile
npm test
```

Expected: compile clean (no TS errors), 60 passed, 0 failed.
