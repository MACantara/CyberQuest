/**
 * Level 5 Custom Applications
 * Digital forensics specific apps and utilities
 */

export const Level5Apps = {
    // Forensic image analyzer
    forensicImageAnalyzer: {
        enabled: true,
        supportedFormats: ['raw', 'e01', 'dd']
    },
    
    // Timeline analyzer
    timelineAnalyzer: {
        enabled: true,
        features: [
            'file_timeline',
            'network_timeline',
            'user_activity'
        ]
    },
    
    // Evidence chain tracker
    evidenceChainTracker: {
        enabled: true,
        hashAlgorithms: ['md5', 'sha1', 'sha256']
    }
};

export default Level5Apps;
