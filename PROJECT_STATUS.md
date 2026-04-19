# Quell - Working Status

Living tracker of where Quell is, what's landed, and what's next. Update after every session that changes state. Sits alongside `POSITIONING.md` (strategy) and `FIX_PROMPTS/` (concrete next actions).

*Last updated: 2026-04-17 (round 4 complete — 10 commits landed, pushed to main)*

## Snapshot

- **Repo**: `C:\\Users\\craig\\Github Repos\\Quell`, single checkout on `main`
- **Publisher**: `Sonofg0tham`
- **Version on Marketplace**: v2.4.0 (v2.5.0 built and ready — awaiting .vsix publish in round 5)
- **Licence**: MIT (stays MIT for the free tier)
- **Adoption (as of 2026-04-09)**: OpenVSX 484 downloads / 7 installs, VSCode Marketplace 65 acquisitions in last 30 days
- **Strategic direction**: keep generous free tier, extract `SecretScanner.ts` into `@quell/scanner` package to unlock CLI, GitHub Action, and monetisation surfaces

## Workflow rules for this project

- Craig is a vibe coder. Sandbox session (Cowork) does the code edits directly; Claude Code on Craig's machine handles git plumbing (add/commit/push)
- No more prompt docs by default. Sandbox makes the recommendations, applies the edits, hands a short git plan back to Claude Code
- Sandbox cannot push (security feature, consent-gated). Sandbox also cannot delete files on the mounted Windows filesystem, so file moves need `git rm` on the old copies via Claude Code
- Work from the single `main` checkout. The `claude/peaceful-dirac` worktree has been pruned
- Known sandbox gotcha: the Write tool doesn't truncate files on the mount - when overwriting a smaller-content file, null bytes get appended. Fix with a bash `python3` rewrite when it happens

## What's landed

### Commit `1afe650` - Supabase test cases
Added missing test cases for Supabase publishable and secret key patterns.

### Commit `a655d49` - Round 1 fixes
Correctness, hygiene, false-positive reduction:
- Removed broken Segment Write Key pattern (was catching Stripe keys)
- Removed redundant Google Gemini pattern (subset of Google API Key)
- Removed dead code in entropy scan (unreachable camelCase/PascalCase branch)
- Fixed `confirmBeforeRedact` default inconsistency between schema and code
- Skip files >1MB in `onWillSaveTextDocument` to avoid blocking saves
- Filter obvious placeholder passwords (changeme, hunter2, etc.) from `Password`/`Token in Assignment` matches
- Removed committed `.vsix` build artefacts and `pnpm-lock.yaml`
- Documented `Ctrl+Shift+V` rebinding in README

Compile clean, 58/58 tests passing.

### Round 2a - Planning doc / tidy commit
Committed `.gitattributes`, `POSITIONING.md`, `PROJECT_STATUS.md`, the `FIX_PROMPTS/` directory, and the `.gitignore` update.

### Commit `3828ca6` - Round 2b: scanner extraction
Moved `SecretScanner.ts` and its tests into `packages/scanner/` as `@quell/scanner` v0.1.0 (not yet published to npm). History preserved, standalone build and root build both work. Compile clean, 58/58 tests passing.

### Round 3 - 4 commits landed (`f77977a`..`0f1fc26`)
- `f77977a` — CodeQL CI + contribution scaffolding
- `1b626e6` — UUID placeholder 12→16 hex chars
- `cd028a5` — quell.clearVault command
- `0f1fc26` — quell.redactTestKeys setting (60/60 tests)

### Round 4 - 6 commits landed (`a956e69`..`d3aa1e2`)
- `a956e69` — Fix demo: GitHub PAT + PostgreSQL URI + OpenAI key (fires at default settings, no push-protection false positives)
- `aa94bd2` — v2.5.0 bump, CHANGELOG entry, README UUID example updated to 16 chars
- `74d1427` — README: redactTestKeys row in config table, Clear Vault row in commands table
- `12021e3` — Extract getConfig() to configHelper.ts (no more config duplication)
- `5a3fcf3` — publishConfig added to @quell/scanner package.json (public npm scoped publish)
- `d3aa1e2` — .Jules/ renamed to .jules/ (case convention, R100 renames)

## What's next

### Round 5 - Screenshots, publish, marketplace

1. **Screenshots** (3 PNGs): sidebar dashboard, inline diagnostics, before/after redaction. Save as `assets/screenshot-sidebar.png`, `assets/screenshot-diagnostics.png`, `assets/screenshot-redaction.png`. Uncomment the three commented-out lines in README.
2. **Publish `@quell/scanner` to npm**: run `npm run build` inside `packages/scanner/`, then `npm publish` (account must have @quell scope, `publishConfig` is already set for public access).
3. **Build and publish `.vsix`**: `npx vsce package` in root, then `npx vsce publish` or upload via Marketplace UI. Bump marketplace version to v2.5.0.
4. Product Hunt / HN post.
