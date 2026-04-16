# @quell/scanner

Offline secret-detection engine. The core scanner behind the [Quell VSCode extension](https://marketplace.visualstudio.com/items?itemName=Sonofg0tham.quell).

- 75+ regex patterns covering AWS, Google, Azure, OpenAI, Anthropic, Stripe, GitHub, Slack, databases, private keys, and more
- Shannon entropy fallback for high-randomness tokens that don't match a named pattern
- Zero runtime dependencies
- Works in Node 18+. No VSCode or browser APIs

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

Currently versioned as 0.1.0 and not yet published to npm. Distributed as source alongside the Quell VSCode extension. Standalone npm publish is planned.

## License

MIT
