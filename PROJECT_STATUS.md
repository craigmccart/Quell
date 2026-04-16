# Quell - Working Status

Living tracker of where Quell is, what's landed, and what's next. Update after every session that changes state. Sits alongside `POSITIONING.md` (strategy) and `FIX_PROMPTS/` (concrete next actions).

*Last updated: 2026-04-16*

## Snapshot

- **Repo**: `C:\Users\craig\Github Repos\Quell`, single checkout on `main`
- **Publisher**: `Sonofg0tham`
- **Version on Marketplace**: v2.4.0
- **Licence**: MIT (stays MIT for the free tier)
- **Adoption (as of 2026-04-09)**: OpenVSX 484 downloads / 7 installs, VSCode Marketplace 65 acquisitions in last 30 days
- **Strategic direction**: keep generous free tier, extract `SecretScanner.ts` into `@quell/scanner` package to unlock CLI, GitHub Action, and monetisation surfaces

## Workflow rules for this project

- Craig is a vibe coder. All fixes and refactors ship as copy-pasteable prompt docs in `FIX_PROMPTS/` for Claude Code to execute
- Each prompt doc is self-contained, references exact file paths, explains the why, and ends with explicit `git add`, `commit`, `push` instructions
- Group changes into rounds (round 1, round 2a, round 2b, ...) so they can be tackled incrementally
- Claude Code runs `git` commands. Sandbox sessions do file edits but cannot push (security feature, requires user consent anyway)
- Work from the single `main` checkout. The `claude/peaceful-dirac` worktree has been pruned

## What's landed

### Commit `1afe650` - Supabase test cases
Added missing test cases for Supabase publishable and secret key patterns. These were unlanded real tests for already-shipped patterns, committed on their own so they weren't buried in other work.

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

## What's next

### Round 2a - Prep commit (ready to paste)

File: `FIX_PROMPTS/round-2a-prep.md`

Small tidy-up: commits `.gitattributes`, `.gitignore` update, `POSITIONING.md`, and the `FIX_PROMPTS/` directory. Ignores `.claude/settings.json` (per-user Claude Code state). No behavioural changes.

### Round 2b - Scanner extraction (ready after 2a)

File: `FIX_PROMPTS/round-2b-scanner-extract.md`

The big structural bet. Moves `SecretScanner.ts` and its tests into `packages/scanner/` as a publishable-but-not-yet-published package. Uses relative imports from the extension so the build keeps working today. Publishing to npm becomes a one-command step later.

This is the single highest-leverage change because it unlocks:
- `@quell/scanner` as a standalone npm package
- Quell CLI (`npx @quell/scanner ./src`)
- GitHub Action (free for public repos, paid for private)
- "Security tool scans itself" CodeQL surface
- Clean AppSec portfolio piece for Craig's career pivot

### Round 3 - CI and launch prep (not yet drafted)

Planned but not written:
- Extract GitHub Action using published `@quell/scanner`
- Add CodeQL workflow to scan Quell itself
- Add `CONTRIBUTING.md` and issue templates
- Add 3 screenshots to README and marketplace listing
- Bump placeholder UUID from 12 to 16 hex chars (collision resistance)
- Add `quell.clearVault` command (unbounded keychain growth)
- Add `quell.redactTestKeys` setting (test keys are meant to be shareable)

## Loose ends

- **Line-ending renormalisation commit** still owed. Git warns CRLF -> LF on every touched file. Fix with a dedicated `git add --renormalize .` commit once structural work is settled. Low priority.
- **`.Jules/` vs `.jules/` casing duplicate**: Windows sees one folder, git sees two. Cosmetic, will bite on case-sensitive checkouts (Linux CI, macOS case-sensitive volumes). Worth one tiny commit to remove the duplicate when convenient.
- **`quell-2.4.0.vsix`** still committed. Deferred cleanup, remove in a future hygiene pass.
- **README screenshots**: the commented-out block at line 10 is the biggest quick-win for marketplace conversion. Add before any launch post.

## Key decisions made

- Keep free tier generous - the whole current feature set stays free. The free tier is the marketing.
- Pro tier sits on top: Pattern Packs, Policy Files, Audit Log Export, Custom Entropy Profiles. £3-5/mo or £30 one-off.
- Scanner extraction comes before any Pro work. Everything else is a UI around the scanner.
- Point-of-use positioning is the moat. Not competing with GitGuardian on scan quality, competing on "stops the leak before it happens".
- Portfolio value compounds with monetisation - shipping a standalone package, CLI, Action, and launch post is exactly what AppSec hiring managers want to see.

## Success metrics (12-week target from 2026-04-09)

- 2,000+ total installs across Marketplace + OpenVSX (from ~550)
- 100+ GitHub stars
- 50+ npm weekly downloads of `@quell/scanner`
- 5+ GitHub repos using the Action
- 1 paying Pro user (proof of concept, not revenue target)
- A launch post with 50+ upvotes somewhere
