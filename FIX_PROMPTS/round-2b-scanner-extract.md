# Round 2b - Extract SecretScanner into a package-in-waiting

**Why**: `SecretScanner` is already decoupled from VSCode (takes `ScannerConfig` as an argument, zero VSCode imports). Moving it into its own `packages/scanner/` subdirectory sets it up to be published as `@quell/scanner` on npm, which unlocks the CLI, GitHub Action, and "security tool scans itself" surfaces without another refactor. Publishing is deferred - this round just reorganises the files so publishing becomes a one-command step later.

**What we're NOT doing yet**: Actual `npm publish`, workspaces setup, or turning this into a true monorepo. The extension will keep building exactly as it does today via relative imports.

Copy this entire file into Claude Code (running in the Quell repo root) as a single prompt.

---

You are working in the Quell VSCode extension repository. Before making any changes:

1. Run `git status` - must be clean (all round-2a prep work already committed and pushed).
2. Run `git log --oneline -3` - confirm the latest commit is the prep commit.
3. Run `npm test` as a baseline - must report 58/58 passing.

If any of these fails, STOP and tell me.

## Tasks

### Step 1: Create the new package skeleton

Create the directory `packages/scanner/` and inside it:

**`packages/scanner/package.json`**:

```json
{
  "name": "@quell/scanner",
  "version": "0.1.0",
  "description": "Offline secret-detection engine. Regex patterns plus Shannon entropy. Zero runtime dependencies. The core scanner behind the Quell VSCode extension.",
  "keywords": ["security", "secrets", "secret-scanner", "api-keys", "redaction", "entropy", "appsec", "devsecops"],
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "build": "tsc -p ./",
    "test": "tsc -p ./tsconfig.test.json && node dist-test/test/SecretScanner.test.js",
    "prepublishOnly": "npm run build"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/sonofg0tham/Quell.git",
    "directory": "packages/scanner"
  },
  "license": "MIT",
  "author": "Craig McCart",
  "engines": { "node": ">=18" },
  "devDependencies": {
    "@types/node": "20.x",
    "typescript": "^5.3.3"
  }
}
```

**`packages/scanner/tsconfig.json`**:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "dist",
    "lib": ["ES2022"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "rootDir": "src",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "dist-test", "src/test/**"]
}
```

**`packages/scanner/tsconfig.test.json`**:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "dist-test",
    "lib": ["ES2022"],
    "sourceMap": true,
    "strict": true,
    "rootDir": "src",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "dist-test"]
}
```

**`packages/scanner/README.md`**:

```markdown
# @quell/scanner

Offline secret-detection engine. The core scanner behind the [Quell VSCode extension](https://marketplace.visualstudio.com/items?itemName=Sonofg0tham.quell).

- 75+ regex patterns covering AWS, Google, Azure, OpenAI, Anthropic, Stripe, GitHub, Slack, databases, private keys, and more
- Shannon entropy fallback for high-randomness tokens that don't match a named pattern
- Zero runtime dependencies
- Works in Node 18+; no VSCode or browser APIs

## Install

```bash
npm install @quell/scanner
```

## Usage

```ts
import { SecretScanner, DEFAULT_CONFIG } from '@quell/scanner';

const { redactedText, secrets, detectedTypes } = SecretScanner.redact(
  'My key is AKIAIOSFODNN7EXAMPLE',
  DEFAULT_CONFIG
);

console.log(redactedText);        // "My key is {{SECRET_abc123...}}"
console.log(detectedTypes);       // Set { "AWS Access Key ID" }
console.log(secrets);             // Map { "{{SECRET_abc123...}}" => "AKIAIOSFODNN7EXAMPLE" }
```

## Configuration

```ts
import { ScannerConfig, SecretScanner } from '@quell/scanner';

const config: ScannerConfig = {
  enableEntropy: true,
  entropyThreshold: 4.5,
  minimumTokenLength: 20,
  customPatterns: [
    { name: 'Internal API Key', regex: 'int_[a-f0-9]{32}' },
  ],
  whitelistPatterns: ['AKIAIOSFODNN7EXAMPLE'],
};

SecretScanner.redact(text, config);
```

## Status

This package is currently versioned as 0.1.0 and not yet published to npm. It is distributed as source alongside the Quell VSCode extension. Standalone npm publish is planned.

## License

MIT
```

**`packages/scanner/LICENSE`**: Copy the root `LICENSE` file verbatim into `packages/scanner/LICENSE`.

### Step 2: Create `src/index.ts` in the package

**`packages/scanner/src/index.ts`**:

```ts
export { SecretScanner } from './SecretScanner';
export type { ScannerConfig, RedactResult } from './SecretScanner';
export { DEFAULT_CONFIG } from './SecretScanner';
```

### Step 3: Move the scanner source and test into the package

Use `git mv` so history is preserved:

```bash
git mv src/SecretScanner.ts packages/scanner/src/SecretScanner.ts
mkdir -p packages/scanner/src/test
git mv src/test/SecretScanner.test.ts packages/scanner/src/test/SecretScanner.test.ts
```

### Step 4: Update the test file's import path

In `packages/scanner/src/test/SecretScanner.test.ts`, change line 11:

```ts
import { SecretScanner, DEFAULT_CONFIG, ScannerConfig } from '../SecretScanner';
```

That path is still correct after the move (test file is in `src/test/`, scanner is in `src/`), so **no change needed**. Just verify.

### Step 5: Update the extension's imports to point at the package

The extension currently imports from `./SecretScanner`. Change it to use a relative path into the new location. The cleanest way without setting up npm workspaces today is a TypeScript path alias.

**Edit root `tsconfig.json`** to add path mapping and include the new package:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "out",
    "lib": ["ES2022"],
    "sourceMap": true,
    "strict": true,
    "rootDir": ".",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@quell/scanner": ["packages/scanner/src/index.ts"]
    }
  },
  "include": ["src/**/*.ts", "packages/scanner/src/**/*.ts"],
  "exclude": [
    "node_modules",
    ".vscode-test",
    "src/test/**",
    "packages/scanner/src/test/**",
    "playground/**",
    "packages/scanner/dist/**",
    "packages/scanner/dist-test/**"
  ]
}
```

Note the `rootDir` change from `"src"` to `"."` to accommodate the multiple source roots, and the addition of the packages subtree to `include`.

**Edit root `tsconfig.test.json`** similarly:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "outDir": "out",
    "lib": ["ES2022"],
    "sourceMap": true,
    "strict": true,
    "rootDir": ".",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "@quell/scanner": ["packages/scanner/src/index.ts"]
    }
  },
  "include": [
    "packages/scanner/src/SecretScanner.ts",
    "packages/scanner/src/test/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### Step 6: Update the extension's source imports

Change these four lines across three files:

**`src/extension.ts` line 3**:

Before:
```ts
import { SecretScanner, ScannerConfig, DEFAULT_CONFIG } from './SecretScanner';
```

After:
```ts
import { SecretScanner, ScannerConfig, DEFAULT_CONFIG } from '@quell/scanner';
```

**`src/DiagnosticProvider.ts` line 2**:

Before:
```ts
import { SecretScanner, ScannerConfig, DEFAULT_CONFIG } from './SecretScanner';
```

After:
```ts
import { SecretScanner, ScannerConfig, DEFAULT_CONFIG } from '@quell/scanner';
```

**`src/SidebarProvider.ts` line 2**:

Before:
```ts
import { SecretScanner } from './SecretScanner';
```

After:
```ts
import { SecretScanner } from '@quell/scanner';
```

### Step 7: Fix the root test script

The output path changes because tests are now compiled from `packages/scanner/src/test/` into `out/packages/scanner/src/test/` when run from root. Update root `package.json`'s `test` script:

Before:
```json
"test": "tsc -p ./tsconfig.test.json && node out/test/SecretScanner.test.js"
```

After:
```json
"test": "tsc -p ./tsconfig.test.json && node out/packages/scanner/src/test/SecretScanner.test.js"
```

### Step 8: Install a runtime path-resolver OR switch to a relative import

The `paths` config in tsconfig only works at compile time. At runtime, Node needs to resolve `@quell/scanner` too. Two options:

**Option A (lightweight, chosen)**: Use a relative import instead of the `@quell/scanner` alias. Revert the imports in step 6 to use `'../packages/scanner/src/index'` instead. This keeps everything working without any runtime resolver. The `@quell/scanner` name will become real once the package is actually published and consumed via `npm install`.

Go with **Option A**. Update the three extension import lines to:

**`src/extension.ts`**:
```ts
import { SecretScanner, ScannerConfig, DEFAULT_CONFIG } from '../packages/scanner/src';
```

**`src/DiagnosticProvider.ts`**:
```ts
import { SecretScanner, ScannerConfig, DEFAULT_CONFIG } from '../packages/scanner/src';
```

**`src/SidebarProvider.ts`**:
```ts
import { SecretScanner } from '../packages/scanner/src';
```

And **remove the `paths` block and `baseUrl`** from both root tsconfigs - they're not needed with relative imports.

### Step 9: Verify the build

```bash
npm run compile
```

Must succeed with no errors.

```bash
npm test
```

Must report 58/58 passing. If the path in the test script is wrong, adjust it: find the compiled `.js` output by running `find out -name "SecretScanner.test.js"` and point the test script at whatever path that produces.

### Step 10: Sanity-check the package stands alone

```bash
cd packages/scanner
npm install
npm run build
ls dist/
```

Should produce `dist/SecretScanner.js`, `dist/SecretScanner.d.ts`, `dist/index.js`, `dist/index.d.ts`. Then:

```bash
npm test
```

Should also pass 58/58 from inside the package. This proves the package works in isolation, which is the whole point of the extraction.

`cd ..` back to the root when done.

### Step 11: Add a note to CLAUDE.md

Update the `## Architecture` section in root `CLAUDE.md` to note the split:

Add a new subsection near the top of `## Architecture`:

```markdown
### Package layout

The repository contains two logical packages:

| Location | Role |
|----------|------|
| `packages/scanner/` | `@quell/scanner` - the standalone, VSCode-free secret-detection engine. Publishable to npm as a separate artefact. |
| `src/` | The VSCode extension itself. Consumes `@quell/scanner` via a relative import today; will switch to the published npm name when it ships. |

All other subsystems (`SidebarProvider`, `DiagnosticProvider`, etc.) remain in `src/` because they are VSCode-specific.
```

Also update the `| File | Role |` table to remove the `SecretScanner.ts` row, since that file no longer lives in `src/`.

### Step 12: Verify, commit, push

1. `npm run compile` clean
2. `npm test` from root - 58/58
3. `cd packages/scanner && npm test && cd ..` - 58/58 from inside the package
4. `git status` and `git diff --stat` to review

Commit message:

```
Extract SecretScanner into packages/scanner (package-in-waiting)

The scanner was already decoupled from VSCode. Moving it into its own
package subdirectory sets it up for eventual publication as @quell/scanner
on npm, which unlocks the CLI, GitHub Action, and standalone surfaces
without another refactor.

- Move src/SecretScanner.ts -> packages/scanner/src/SecretScanner.ts
- Move src/test/SecretScanner.test.ts -> packages/scanner/src/test/
- Add packages/scanner/{package.json,tsconfig.json,tsconfig.test.json,
  README.md,LICENSE,src/index.ts}
- Update extension imports to use relative path into the new package
- Update root tsconfig includes and test-output path
- Note the split in CLAUDE.md

The extension builds and behaves identically. 58/58 tests pass from
both the root (existing pipeline) and from inside the scanner package
(proves standalone operation). The package is NOT yet published.
```

Push to `origin main`. Report commit SHA and `git log -1 --stat`.

## Safety nets

- If any step fails, STOP and report what you see. Do not "fix forward" blindly - moves and tsconfig changes can cascade in confusing ways.
- If `git mv` fails because of case-insensitivity issues, use `git mv --force` or do the move in two steps (to a temp name, then to the final).
- If the package-internal `npm install` complains about the missing lockfile, that's fine - no deps to install anyway. Skip and move on.
