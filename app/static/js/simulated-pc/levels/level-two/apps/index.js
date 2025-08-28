/**
 * Level 2 Custom Applications
 * Phishing detection specific apps and utilities
 */

export const Level2Apps = {
    // Email security scanner
    emailSecurityScanner: {
        enabled: true,
        features: [
            'header_analysis',
            'link_verification',
            'attachment_scanning'
        ]
    },
    
    // Phishing simulator
    phishingSimulator: {
        enabled: true,
        categories: [
            'banking',
            'social_media',
            'corporate'
        ]
    }
};

export default Level2Apps;
