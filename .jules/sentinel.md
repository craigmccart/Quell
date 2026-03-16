## 2025-02-14 - Fix Base64 False Negative
**Vulnerability:** A regex meant to skip camelCase/PascalCase identifiers (`/^[a-zA-Z_$][a-zA-Z0-9_$]*$/`) was too forgiving and allowed digits, causing it to skip high-entropy base64-like tokens that didn't contain any other special characters.
**Learning:** Pure-alpha identifiers must be strictly checked using `/^[a-zA-Z]+$/` to ensure digits aren't accidentally matched in high-entropy checks. Otherwise, base64 strings might pass off as camelCase words.
**Prevention:** Thoroughly ensure that exception patterns do not overlap with legitimate high-entropy formats, particularly with respect to mixed alphanumeric content.
