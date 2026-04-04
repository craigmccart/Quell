## 2024-05-24 - Parallelize I/O-bound tasks in workspace scans
**Learning:** Sequential `for` loops reading files block the event loop and increase latency for workspace scanning tasks. Since file reading and secret scanning don't depend on sequential execution order, they can be processed concurrently.
**Action:** Parallelize I/O-bound tasks in workspace scans (like file reading and secret scanning) using `Promise.all` with `.map()` instead of sequential `for` loops to significantly reduce execution time.

## 2025-01-20 - Prevent Repeated Configuration-Derived RegExp Compilation
**Learning:** In hot paths (like `SecretScanner.redact` called repeatedly during workspace scans), recreating new `RegExp` objects on every call from dynamic user configuration adds immense overhead. `String.prototype.match()` can handle globally cached RegExp instances if we decouple state appropriately.
**Action:** Use a `WeakMap` to cache compiled `RegExp` arrays mapped by the configuration array object reference (e.g., `ScannerConfig.customPatterns`), invalidating the cache seamlessly when VS Code rebuilds the config object.

## 2025-01-20 - Replace O(N) linear lookups with O(1) reverse Maps in string manipulation hot paths
**Learning:** Checking for already-processed strings by iterating over an active list is incredibly slow when processing large files with many occurrences.
**Action:** Maintain a reverse-lookup `Map` alongside standard collection lists when replacing large strings locally.

## 2025-01-20 - Avoid redundant array allocations from duplicate String.split()
**Learning:** In critical string manipulation paths, calling `str.split(delimiter)` multiple times on the same string (e.g., to count occurrences and then perform a global string replacement via `.join()`) creates duplicated intermediate arrays and causes completely unnecessary allocations and GC overhead.
**Action:** Always cache the initial `String.split()` result into a local variable (`const parts = str.split(delimiter);`) and use that reference for `.length` assertions and `.join()` replacements.
