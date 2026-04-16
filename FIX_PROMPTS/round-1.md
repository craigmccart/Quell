# Round 1 Fixes - Correctness & Hygiene

Copy and paste this entire document into Claude Code (in the Quell repo root) as a single prompt. Claude Code will work through each fix, then commit and push at the end.

---

You are working in the Quell VSCode extension repository. Before making any changes, run `git status` to confirm a clean working tree, and `git branch` to confirm you're on the main branch. If not clean, stop and tell me.

Apply the following fixes in order. After all fixes are applied, run `npm run compile` and `npm test` to confirm nothing is broken, then create a single commit containing all the changes and push to `origin`.

## Fix 1: Remove the broken Segment Write Key pattern

**File**: `src/SecretScanner.ts`, line 149.

The pattern `{ name: 'Segment Write Key', regex: /sk_[a-zA-Z0-9]{32}/ }` is wrong. Segment write keys are not `sk_`-prefixed. This pattern currently matches Stripe keys and other `sk_`-prefixed tokens, tagging them with the wrong type name.

**Action**: Delete that entire line.

## Fix 2: Remove the redundant Google Gemini pattern

**File**: `src/SecretScanner.ts`, line 58.

The pattern `{ name: 'Google Gemini API Key', regex: /AIzaSy[0-9A-Za-z\-_]{33}/ }` is a strict subset of the `Google API Key` pattern on line 43 (`/AIza[0-9A-Za-z\-_]{35}/`). Every Gemini key is already caught by the Google API Key pattern, so this line just causes double-tagging in `detectedTypes`.

**Action**: Delete line 58.

## Fix 3: Remove dead code in entropy scan

**File**: `src/SecretScanner.ts`, around line 287.

The check `if (/^[a-zA-Z]+$/.test(token) && /[a-z]/.test(token) && /[A-Z]/.test(token)) { continue; }` is unreachable. An earlier check on line 255 (`if (/^[a-z]+$/i.test(token)) { continue; }`) already skips any token that is entirely letters, so this branch can never fire.

**Action**: Delete line 287 and its comment on line 285-286 ("Skip camelCase / PascalCase identifiers...").

## Fix 4: Fix the confirmBeforeRedact default inconsistency

**File**: `src/extension.ts`, around line 302, and `package.json` around line 269.

`package.json` declares `quell.confirmBeforeRedact` with `"default": false`, but `extension.ts` reads it with `.get<boolean>('confirmBeforeRedact', true)` - so users who never touch the setting get different behaviour depending on whether the extension has ever written to their settings file.

**Action**: In `src/extension.ts`, change the fallback from `true` to `false` so it matches the schema. Confirm the `package.json` description text still makes sense.

## Fix 5: Skip large files in the save watcher

**File**: `src/extension.ts`, around line 502 (`onWillSaveTextDocument`).

Currently the full regex+entropy scan runs synchronously on every save, which can block the save for large files.

**Action**: At the top of the `onWillSaveTextDocument` handler, add an early return if `event.document.getText().length > 1_000_000` (1 MB). Log a debug message via `Logger.info` saying the file was skipped due to size.

## Fix 6: Exclude obvious placeholder passwords from the Password in Assignment pattern

**File**: `src/SecretScanner.ts`, around line 160.

The `Password in Assignment` regex currently matches any 8-64 char quoted string after `password=`, which produces false positives on documentation and examples like `password="changeme"` or `password="your_password_here"`.

**Action**: After regex matching in the main redact loop (around line 225), before calling `replaceSecret`, add a filter that skips matches whose captured value is one of the following case-insensitive placeholder strings: `changeme`, `password`, `your_password`, `your_password_here`, `xxx`, `xxxxxx`, `example`, `placeholder`, `123456`, `hunter2`, `test`, `secret`. Keep the filter scoped to the Password in Assignment and Token in Assignment patterns only, not the whole loop.

Implementation hint: extract the value from inside the quotes with a small helper, then compare against the skip list.

## Fix 7: Drop old .vsix files from the repo

**File**: repo root.

`quell-2.1.0.vsix`, `quell-2.2.0.vsix`, `quell-2.3.0.vsix` are committed to the repo. They shouldn't be.

**Action**: Delete those three files with `git rm`, and add `*.vsix` to `.gitignore` (create the file or append to it).

## Fix 8: Pick one lockfile

**File**: repo root.

Both `package-lock.json` and `pnpm-lock.yaml` exist. Pick one.

**Action**: The project uses npm scripts (`npm run compile`, `npm test`), so keep `package-lock.json` and `git rm pnpm-lock.yaml`.

## Fix 9: Add a note about the Ctrl+Shift+V conflict

**File**: `README.md`, in the Features section under "Sanitized Paste".

`Ctrl+Shift+V` conflicts with VSCode's built-in "Paste without formatting" in some contexts. Users may be surprised.

**Action**: Add a short note under the Sanitized Paste feature: "Note: Quell rebinds Ctrl+Shift+V in the editor. If you prefer the default VSCode binding, remap Quell's sanitised paste in File > Preferences > Keyboard Shortcuts."

## Verification

After applying all fixes:

1. Run `npm run compile` - it must succeed with no TypeScript errors.
2. Run `npm test` - all tests must pass.
3. Run `git status` and `git diff --stat` to confirm the changes look right.

## Commit and push

Create a single commit with this message:

```
Round 1 fixes: correctness, hygiene, false-positive reduction

- Remove broken Segment Write Key pattern (was catching Stripe keys)
- Remove redundant Google Gemini pattern (subset of Google API Key)
- Remove dead code in entropy scan (unreachable branch)
- Fix confirmBeforeRedact default inconsistency between schema and code
- Skip files >1MB in onWillSaveTextDocument to avoid blocking saves
- Filter obvious placeholder passwords (changeme, hunter2, etc.) from
  Password/Token in Assignment matches
- Remove committed .vsix build artefacts, add *.vsix to .gitignore
- Remove pnpm-lock.yaml (project uses npm)
- Document Ctrl+Shift+V rebinding in README
```

Then push with `git push origin main` (or whatever the default branch is - check with `git branch --show-current` first).

Report back with: the commit SHA, the output of `git log -1 --stat`, and confirmation that `npm test` passed.
