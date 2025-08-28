/**
 * Level 1: The Misinformation Maze
 * Configuration and setup for the misinformation detection scenario
 */

export const Level1Config = {
    id: 1,
    name: "The Misinformation Maze",
    description: "Navigate through fake news and stop misinformation from influencing an election",
    
    // Level-specific applications
    requiredApps: [
        'browser-app'
    ],
    
    // Tutorial requirements
    tutorials: [
        'initial-tutorial',
        'browser-tutorial'
    ],
    
    // Dialogue files
    dialogues: [
        'level1-misinformation-maze'
    ],
    
    // Level objectives
    objectives: [
        'Identify fake news articles',
        'Verify information sources',
        'Report misinformation',
        'Protect election integrity'
    ],
    
    // Scoring criteria
    scoring: {
        maxScore: 1000,
        penalties: {
            incorrectIdentification: -50,
            missedMisinformation: -100
        },
        bonuses: {
            speedBonus: 200,
            accuracyBonus: 300
        }
    }
};
