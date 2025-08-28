/**
 * Level 4: The White Hat Test
 * Configuration and setup for the ethical hacking scenario
 */

export const Level4Config = {
    id: 4,
    name: "The White Hat Test",
    description: "Practice ethical hacking and responsible vulnerability disclosure",
    
    // Level-specific applications
    requiredApps: [
        'vulnerability-scanner-app',
        'terminal-app'
    ],
    
    // Tutorial requirements
    tutorials: [
        'vulnerability-scanner-tutorial',
        'terminal-tutorial'
    ],
    
    // Dialogue files
    dialogues: [
        'level4-white-hat-test'
    ],
    
    // Level objectives
    objectives: [
        'Scan targets for vulnerabilities',
        'Use nmap for network reconnaissance',
        'Analyze vulnerability scan results',
        'Generate professional security reports',
        'Practice responsible disclosure'
    ],
    
    // Scoring criteria
    scoring: {
        maxScore: 1000,
        penalties: {
            unauthorizedAccess: -300,
            missedVulnerability: -100
        },
        bonuses: {
            ethicalConduct: 400,
            documentationBonus: 200
        }
    }
};
