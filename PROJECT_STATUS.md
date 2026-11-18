# Quell - Project Status

Where Quell stands today and what could come next. Quell is now a finished
portfolio project: it works, it is published, and it is maintained for
dependency and security updates. There is no active feature work.

For the full history of changes, see [CHANGELOG.md](CHANGELOG.md). For product
positioning and commercial ideas, see [POSITIONING.md](POSITIONING.md).

*Last updated: 2026-11-18*

## Snapshot

- **Repo**: [craigmccart/Quell](https://github.com/craigmccart/Quell)
- **Publisher**: `Sonofg0tham`
- **Licence**: MIT
- **VS Code extension**: v2.9.2 (released 2026-09-15), live on the
  [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Sonofg0tham.quell)
  and [Open VSX](https://open-vsx.org/extension/Sonofg0tham/quell)
- **Scanner package**: [`@sonofg0tham/quell-scanner@0.3.0`](https://www.npmjs.com/package/@sonofg0tham/quell-scanner)
  on npm. Engines: `SecretScanner`, `PromptGuard`, `McpGuard`, plus `EnvRedactor`
- **Claude Code plugin**: v0.2.0, in the repo at
  [`packages/claude-plugin/`](packages/claude-plugin). Not published to npm or a
  plugin marketplace. Install it locally with
  `claude --plugin-dir ./packages/claude-plugin`

## What's in the box

Quell guards both directions between a developer and their AI tools:

- **Outbound**: stops secrets reaching a model. Regex plus Shannon entropy
  detection, redaction to `{{SECRET_…}}` placeholders, real values kept in the
  OS keychain.
- **Inbound**: flags prompt injection hidden in files the model will read.
  Unicode Tags-block smuggling (decoded back to readable text), zero-width
  characters, bidi overrides, homoglyphs and model-directed instructions.
- **MCP configs**: `McpGuard` flags hardcoded credentials, poisoned tool
  descriptions and plain-HTTP transport in MCP server configs.

The same engines run in three places: the VS Code extension, the npm scanner
package and the Claude Code plugin (`UserPromptSubmit`, `PreToolUse` and
`PostToolUse` hooks). See [README.md](README.md) and [USAGE.md](USAGE.md) for
details.

## Latest release: v2.9.2

A metadata-only release. It updated repository, documentation and
publisher-profile links after the GitHub account was renamed from
`Sonofg0tham` to `craigmccart`, so both marketplace listings show the current
links. The `Sonofg0tham` publisher ID and Open VSX namespace were kept, so the
extension identity and update path are unchanged. No runtime behaviour changed.

## Tests

Measured on 2026-11-18 on `main`:

| Suite | Passing |
|---|---|
| SecretScanner | 143 |
| PromptGuard | 79 |
| EnvRedactor | 25 |
| McpGuard | 30 |
| **Scanner total** (`npm test`) | **277** |
| Plugin `UserPromptSubmit` hook | 6 |
| Plugin `PreToolUse` hook | 40 |
| Plugin `PostToolUse` hook | 17 |
| **Plugin total** (`npm test` in `packages/claude-plugin`) | **63** |
| **Overall** | **340** |

## CI and security tooling

- **CI** (`ci.yml`): runs the scanner tests and the plugin hook tests on every
  push and pull request to `main`. It also fails if the plugin's bundled copy
  of the scanner is out of date.
- **CodeQL** (`codeql.yml`): runs on pushes and pull requests to `main` and
  weekly, with the `security-extended` and `security-and-quality` query packs.
  A version mismatch between the CodeQL `init`, `autobuild` and `analyze`
  actions broke the scheduled scan in November 2026. That was fixed in #137
  and scans are passing again.
- **Dependabot**: weekly updates for npm and GitHub Actions. The CodeQL actions
  are grouped so they always move together, which prevents the mismatch above
  from recurring. Major npm bumps and `@types/vscode` are left for manual
  review.
- All third-party actions are pinned to commit SHAs.

## Release process

Releases are driven by tags:

1. Bump the version in `package.json` and update `CHANGELOG.md`.
2. Commit and push to `main`.
3. Push a tag, for example `git tag v2.9.3; git push origin v2.9.3`.
4. The release workflow runs the test suite, builds the VSIX, creates the
   GitHub Release and attaches the VSIX.
5. If the `MARKETPLACE_READY` repo variable is `true`, it then publishes to
   Open VSX and the VS Code Marketplace using the `OVSX_PAT` and `VSCE_PAT`
   secrets.

A tag push therefore publishes publicly with no further confirmation. Setting
`MARKETPLACE_READY` to anything other than `true` disarms the publish step but
still produces a GitHub Release.

If a marketplace publish fails after the GitHub Release exists, the
`Publish existing release` workflow (manual trigger) downloads the VSIX from
that release and publishes it again. Open VSX runs first so a VS Code
Marketplace failure cannot block it.

Note for any future release: the automated VS Code Marketplace publish for
v2.9.2 failed (a gallery timeout, then an expired `VSCE_PAT`). Open VSX
published through the workflow, and the Marketplace listing shows v2.9.2. The
`VSCE_PAT` secret will need renewing before the next automated release.

## Possible future work

None of this is scheduled. These are open items that would be worth doing if
the project picks up again.

- **Plugin vault and `/quell-restore`.** The plugin blocks a prompt containing
  a secret and offers a redacted version, but it does not keep the original
  values. A vault keyed by placeholder plus a restore command would make the
  block-and-resubmit flow usable day to day.
- **Plugin distribution.** Publish the plugin through a Claude Code plugin
  marketplace so it can be installed without a repo checkout.
- **MCP tool-definition pinning.** `McpGuard` catches a malicious tool
  description that is present today. Pinning would hash each server's tool
  descriptions on approval and warn when they change, which catches the
  rug-pull case (CVE-2025-54136).
- **Placeholders are bearer references.** Anyone who sees a `{{SECRET_…}}`
  placeholder in a shared transcript knows a vault key, and restoring into an
  attacker-supplied file would write real values into it. This needs a design
  decision, probably recording each placeholder's origin document and warning
  on cross-file restore, rather than a quick patch.
- **Intercepting other extensions' prompts.** It is unverified whether a VS Code
  extension can intercept prompts sent by another extension. The Chat
  Participant and Language Model APIs let you contribute, not intercept. This
  needs a spike before any Cursor or Windsurf interception is claimed.

Feature requests are welcome as issues. If an idea is already listed above, a
comment on why it matters to you is still useful.
