## 2024-05-24 - Parallelize I/O-bound tasks in workspace scans
**Learning:** Sequential `for` loops reading files block the event loop and increase latency for workspace scanning tasks. Since file reading and secret scanning don't depend on sequential execution order, they can be processed concurrently.
**Action:** Parallelize I/O-bound tasks in workspace scans (like file reading and secret scanning) using `Promise.all` with `.map()` instead of sequential `for` loops to significantly reduce execution time.

## 2026-04-03 - Cache split results in restore
**Learning:** Repeatedly calling `.split(delimiter)` on the same string in a hot path creates redundant intermediate arrays.
**Action:** Cache the result of `.split()` in a local variable if it needs to be reused for both counting and replacing via `.join()`.
