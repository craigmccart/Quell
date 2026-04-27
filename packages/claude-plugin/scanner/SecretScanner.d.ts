export interface ScannerConfig {
    enableEntropy: boolean;
    entropyThreshold: number;
    minimumTokenLength: number;
    customPatterns: Array<{
        name: string;
        regex: string;
    }>;
    whitelistPatterns: string[];
    /** When true, officially-published test/demo credentials (e.g. AKIAIOSFODNN7EXAMPLE) are redacted like any other secret. When false (default), they are treated as safe example values and left in place. */
    redactTestKeys: boolean;
}
export declare const DEFAULT_CONFIG: ScannerConfig;
export interface RedactResult {
    redactedText: string;
    secrets: Map<string, string>;
    detectedTypes: Set<string>;
}
export declare class SecretScanner {
    private static readonly PATTERNS;
    private static readonly GLOBAL_PATTERNS;
    /**
     * Scans text for secrets using regex patterns + Shannon entropy.
     * Returns redacted text with placeholders, a secret map, and detected types.
     *
     * @param text   - Raw input to scan (prompt, file content, etc.)
     * @param config - Optional scanner config (defaults to DEFAULT_CONFIG)
     */
    static redact(text: string, config?: ScannerConfig): RedactResult;
    /**
     * Returns the total number of built-in regex patterns.
     * Useful for diagnostics / UI display.
     */
    static get patternCount(): number;
    private static readonly ENTROPY_FREQUENCIES;
    /**
     * Calculates Shannon entropy of a string.
     * Higher entropy → more random → more likely to be a secret.
     * Typical prose: 2-3 bits. API keys: 4.5-6 bits.
     */
    static calculateEntropy(str: string): number;
    private static _calculateEntropyFallback;
}
//# sourceMappingURL=SecretScanner.d.ts.map