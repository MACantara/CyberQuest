import { BaseDialogue } from '../base-dialogue.js';

export class Level6AdaptiveAdversaryDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to Level 6: The Adaptive Adversary. In this level, you'll confront AI-powered threats that learn and adapt to your behavior patterns."
            },
            {
                text: "As a cybersecurity expert, you'll need to understand how machine learning can be used both defensively and offensively in the cyber realm."
            },
            {
                text: "You'll be working with advanced threat detection systems and learning how to counter AI-powered attacks that evolve based on your defensive measures."
            },
            {
                text: "Pay close attention to anomaly detection and behavior analysis as you work to outsmart an AI that's learning from your every move."
            },
            {
                text: "Successfully completing this level will earn you 300 XP in the AI Security category. Are you ready for this challenge?"
            }
        ];
    }

    onComplete() {
        localStorage.setItem('cyberquest_level_6_started', 'true');
        
        // Open the Network Monitor application for AI threat detection
        if (window.applicationLauncher) {
            setTimeout(async () => {
                await window.applicationLauncher.launchForLevel(6, 'wireshark', 'Network Monitor');
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    static shouldAutoStart(levelId) {
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem(`cyberquest_level_${levelId}_started`);
        return currentLevel === '6' && !levelStarted;
    }

    static markLevelStarted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_started`, 'true');
    }

    static isCompleted() {
        return localStorage.getItem('cyberquest_level_6_completed') === 'true';
    }
}
