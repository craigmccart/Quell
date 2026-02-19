import * as vscode from 'vscode';

export class SecretScanner {
    private static readonly PATTERNS = [
        { name: 'AWS Access Key', regex: /(AKIA|ASIA)[0-9A-Z]{16}/ },
        { name: 'Google API Key', regex: /AIza[0-9A-Za-z\-_]{35}/ },
        { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/ },
        { name: 'Bearer Token', regex: /Bearer\s+[a-zA-Z0-9\-\._]{20,}/ }
    ];

    public static redact(text: string): { redactedText: string, secrets: Map<string, string> } {
        let redactedText = text;
        const secrets = new Map<string, string>();
        let secretCounter = 1;

        // 1. Regex Scan & Replace
        for (const pattern of this.PATTERNS) {
            // Global regex match to find all instances
            const globalRegex = new RegExp(pattern.regex, 'g');
            let match;
            while ((match = globalRegex.exec(text)) !== null) {
                const secretValue = match[0];
                // Check if we already have a placeholder for this exact secret to reuse calls
                let placeholder = `{{SECRET_${secretCounter}}}`;

                // Avoid replacing substrings of already replaced secrets by handling order or uniqueness if needed.
                // For simplicity in this iteration, we replace exact string matches. 
                // A more robust parser would track indices, but replaceAll works for non-overlapping secrets.

                if (!secrets.has(placeholder)) { // logic could be improved to dedupe values, but unique IDs are safer
                    secrets.set(placeholder, secretValue);
                    redactedText = redactedText.replace(secretValue, placeholder);
                    secretCounter++;
                }
            }
        }

        // 2. Entropy Scan (Simplified for non-overlapping)
        const words = redactedText.split(/\s+/);
        for (const word of words) {
            // Don't scan things that are already placeholders
            if (word.startsWith('{{SECRET_') && word.endsWith('}}')) continue;

            if (word.length > 20 && this.calculateEntropy(word) > 4.5) {
                const placeholder = `{{SECRET_${secretCounter}}}`;
                secrets.set(placeholder, word);
                redactedText = redactedText.replace(word, placeholder);
                secretCounter++;
            }
        }

        return { redactedText, secrets };
    }

    private static calculateEntropy(str: string): number {
        const len = str.length;
        const frequencies: { [key: string]: number } = {};

        for (const char of str) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }

        let entropy = 0;
        for (const char in frequencies) {
            const p = frequencies[char] / len;
            entropy -= p * Math.log2(p);
        }

        return entropy;
    }
}
