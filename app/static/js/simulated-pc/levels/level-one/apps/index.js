/**
 * Level 1 Custom Applications
 * Misinformation detection specific apps and utilities
 */

// Import any custom applications specific to Level 1
// Example: news verification tools, source checkers, etc.

export const Level1Apps = {
    // Custom app configurations for misinformation detection
    newsVerifier: {
        enabled: true,
        sources: [
            'factcheck.org',
            'snopes.com',
            'politifact.com'
        ]
    },
    
    sourceChecker: {
        enabled: true,
        trustedDomains: [
            'reuters.com',
            'ap.org',
            'bbc.com'
        ]
    }
};

export default Level1Apps;
