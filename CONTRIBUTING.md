# Contributing to Quell

Thanks for looking! Quell is an open-source VSCode extension that keeps secrets out of AI chats. This doc covers how to get set up, the kinds of contributions that help most, and the house rules.

## TL;DR

- The scanner lives in `packages/scanner/` and is the part most contributions will touch.
- New regex patterns need a matching test. No test, no merge.
- Run `npm run compile` and `npm test` from the repo root. Both should stay green.
- All test fixtures must use officially-published fake credentials (e.g. `AKIAIOSFODNN7EXAMPLE`). No real keys, ever.

## Getting set up

```bash
git clone https://github.com/sonofg0tham/Quell.git
cd Quell
npm install
npm run compile
npm test
```

Press `F5` in VSCode to launch an Extension Host debug session, which opens a fresh VSCode window with your local build loaded.

The standalone scanner package can be built and tested in isolation if you are only changing detection logic:

```bash
cd packages/scanner
npx tsc -p ./
npx tsc -p ./tsconfig.test.json
node dist-test/test/SecretScanner.test.js
```

## The kinds of contributions that help

There are a few lanes where contributions move the needle most.

**New secret patterns.** If Quell misses a provider you use (Cloudflare, Vercel, Linear, Datadog, etc.), add the pattern to `packages/scanner/src/SecretScanner.ts` and a matching test in `packages/scanner/src/test/SecretScanner.test.ts`. Keep the regex anchored tightly enough that it does not catch unrelated strings. If you are not sure, open an issue first with an example string and we will work the pattern out together.

**False-positive fixes.** If Quell is flagging something it should not, open an issue with the exact string, the pattern that matched (check the Quell output channel), and what you expected to happen. A test case that locks the fix in is gold.

**Documentation.** Screenshots, walkthrough improvements, README edits, and small clarity wins all land easily.

**UX and dashboard tweaks.** The sidebar dashboard lives in `src/SidebarProvider.ts` as inline HTML/CSS/JS. No bundler, nothing fancy. Keep it accessible and VSCode-theme-aware.

## How PRs work here

If you have never opened a pull request before, the short version is:

1. Fork the repo on GitHub.
2. Clone your fork, create a branch (`git checkout -b fix/pattern-cloudflare`).
3. Make your changes, commit with a clear message.
4. Push the branch to your fork (`git push -u origin fix/pattern-cloudflare`).
5. Open a pull request from your fork back to `sonofg0tham/Quell:main`. GitHub walks you through this.
6. CI runs (compile, tests, CodeQL). Fix anything red.
7. A maintainer reviews, may ask for changes, and eventually merges.

Small PRs get reviewed quickly. Giant PRs that touch many unrelated things get bounced back for splitting. If you are unsure whether the scope is right, open an issue first to sanity-check.

## House rules

- **Tests are non-negotiable for scanner changes.** `packages/scanner/src/test/SecretScanner.test.ts` uses Node's built-in `assert` library, no test framework. See the existing helpers `assertSecretDetected` and `assertNoSecrets` for the pattern to follow.
- **No real secrets in fixtures.** Every test value must be a known-public fake. If a provider does not publish one, synthesise something that clearly is not real and comment it.
- **Zero runtime dependencies.** The extension ships with no production npm dependencies. If you need a third-party library to solve a problem, open an issue first, we will likely find another way.
- **Keep the free tier generous.** The whole current feature set is MIT-licensed and stays free. Paid surfaces (if they exist by the time you read this) sit on top, they do not replace free features.
- **Security fixes get priority.** If you find something that leaks secrets, crashes the extension, or exfiltrates data, see `SECURITY.md` (if it exists) or email directly before filing a public issue.

## Code style

- TypeScript strict mode, matches the existing tsconfig.
- No emojis in code or commit messages (they render oddly in some terminals).
- Prefer clear names over clever ones.
- Commit messages: imperative mood (`Add Cloudflare token pattern`, not `Added` or `Adds`).

## Where to ask questions

- **Issues** for bugs and feature requests.
- **Discussions** (if enabled on the repo) for broader questions.
- Patterns you are not sure about: open an issue, paste an example string, and we will figure out the regex together.

Thanks again for contributing. Every pattern added and every false positive removed makes Quell more useful to the next person pasting something they should not into Claude or Copilot.
