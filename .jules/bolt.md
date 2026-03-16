## 2024-05-24 - [Regex Word Boundary Optimization]
**Learning:** `SecretScanner` has many regex patterns scanning entire files repeatedly. Some patterns starting with alphanumeric characters without word boundaries (like `Terraform Cloud Token` and `Mailchimp API Key`) can trigger catastrophic backtracking and perform 4x slower per MB.
**Action:** Always check if word boundaries `\b` can be safely added to the beginning or end of regex patterns that match alphanumeric prefixes/suffixes to prevent excessive backtracking.

## 2024-05-24 - [Pre-compiling Global Regexes]
**Learning:** Calling `new RegExp(pattern, 'g')` in a tight loop inside `SecretScanner.redact` is highly inefficient and creates millions of object allocations per MB. The `String.prototype.match()` method properly ignores `lastIndex` on global regex instances and automatically resets it internally.
**Action:** Pre-compile `RegExp` objects with the `'g'` flag outside of loops into static arrays/objects and reuse them when using `String.prototype.match()`.

## 2024-05-24 - [Int32Array for Character Frequencies]
**Learning:** Calculating Shannon entropy on thousands of strings using an ES6 `Map` or JS Object (`{}`) for character frequencies is slow due to object property allocation overhead.
**Action:** For ASCII strings, iterating over `.charCodeAt(i)` and incrementing values in a fixed-size `new Int32Array(256)` is significantly faster (~40%). Maintain a fallback logic for non-ASCII strings just in case.
