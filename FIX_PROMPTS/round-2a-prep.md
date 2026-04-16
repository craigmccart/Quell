# Round 2a - Prep commit

Small tidy-up before the big scanner-extraction work. Safe, fast, no behavioural changes.

Copy this whole file into Claude Code (running in the Quell repo root) as a single prompt.

---

You are working in the Quell VSCode extension repository. Before making any changes, run `git status` to confirm the working tree state, and `git branch --show-current` to confirm you're on `main`.

Expected untracked files:
- `.claude/settings.json`
- `.gitattributes`
- `FIX_PROMPTS/round-1.md` (and `round-2a-prep.md` - this file)
- `POSITIONING.md`
- `PROJECT_STATUS.md`

Expected tracked changes: the `.gitignore` update that already happened in the sandbox (adding `.claude/settings.local.json` and `.claude/settings.json` to the ignore list).

## Tasks

1. **Verify `.gitignore`** has been updated to include `.claude/settings.local.json` and `.claude/settings.json`. If not, add them under a section titled "Editor/IDE local settings (per-user, not shared)".

2. **Verify `.claude/settings.json` is no longer tracked.** Run `git ls-files .claude/` - if `settings.json` shows up, remove it from tracking (it'll still exist on disk) with `git rm --cached .claude/settings.json`.

3. **Stage the prep files:**
   - `.gitattributes` (already sitting untracked - line-ending rules for future normalisation)
   - `.gitignore` (modified)
   - `POSITIONING.md` (new planning doc)
   - `PROJECT_STATUS.md` (live working tracker)
   - `FIX_PROMPTS/round-1.md`, `FIX_PROMPTS/round-2a-prep.md` (and any other FIX_PROMPTS files that exist)

   Do NOT stage:
   - `.claude/settings.json` (now ignored)
   - `.Jules/bolt.md` (pre-existing casing issue, separate problem)

4. **Run compile + test** as a safety check: `npm run compile && npm test`. Both must pass (expect 58/58 tests).

5. **Commit** with this message:

```
Add planning docs, gitattributes, and ignore Claude Code local settings

- Add POSITIONING.md: pitch, free-vs-paid split, 12-week GTM plan
- Add PROJECT_STATUS.md: live working tracker for session-to-session state
- Add FIX_PROMPTS/ directory for incremental refactor prompts
- Add .gitattributes: sets LF line endings repo-wide (enforcement
  deferred to a dedicated renormalise commit later)
- Update .gitignore to exclude .claude/settings.json and
  .claude/settings.local.json (per-user Claude Code state)
```

6. **Push** to `origin main`. Report the commit SHA and `git log -1 --stat`.

## If anything looks off

If `git status` shows files I didn't expect (line-ending noise on previously-committed files, for example), STOP and tell me what you see rather than committing. We can triage before proceeding.
