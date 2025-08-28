/**
 * Level 2: Shadow in the Inbox
 * Configuration and setup for the phishing detection scenario
 */

export const Level2Config = {
    id: 2,
    name: "Shadow in the Inbox",
    description: "Spot phishing attempts and practice safe email protocols",
    
    // Level-specific applications - email only for focused experience
    requiredApps: [
        'email-app'
    ],
    
    // Tutorial requirements - email only
    tutorials: [
        'email-tutorial'
    ],
    
    // Dialogue files
    dialogues: [
        'level2-shadow-inbox'
    ],
    
    // Level objectives
    objectives: [
        'Identify phishing emails',
        'Analyze email headers',
        'Block malicious senders',
        'Report security incidents'
    ],
    
    // Scoring criteria
    scoring: {
        maxScore: 1000,
        penalties: {
            clickedPhishing: -200,
            missedThreat: -100
        },
        bonuses: {
            speedBonus: 150,
            accuracyBonus: 350
        }
    }
};
