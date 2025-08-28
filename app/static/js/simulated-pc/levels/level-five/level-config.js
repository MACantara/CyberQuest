/**
 * Level 5: The Hunt for The Null
 * Configuration and setup for the digital forensics scenario
 */

export const Level5Config = {
    id: 5,
    name: "The Hunt for The Null",
    description: "Use advanced digital forensics to expose The Null's identity",
    
    // Level-specific applications
    requiredApps: [
        'file-manager-app',
        'terminal-app',
        'system-logs-app',
        'network-monitor-app',
        'browser-app'
    ],
    
    // Tutorial requirements
    tutorials: [
        'level5-forensics-tutorial',
        'file-manager-tutorial',
        'terminal-tutorial'
    ],
    
    // Dialogue files
    dialogues: [
        'level5-hunt-for-the-null'
    ],
    
    // Level objectives
    objectives: [
        'Analyze digital evidence',
        'Trace network communications',
        'Recover deleted files',
        'Identify The Null'
    ],
    
    // Scoring criteria
    scoring: {
        maxScore: 1500,
        penalties: {
            contaminatedEvidence: -250,
            missedClue: -100
        },
        bonuses: {
            forensicAccuracy: 500,
            timelineReconstruction: 300
        }
    },
    
    // Special forensics features
    forensics: {
        evidenceTracker: true,
        scoringSystem: true,
        timeline: true
    }
};
