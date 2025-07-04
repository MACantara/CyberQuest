import { BaseDialogue } from '../../base-dialogue.js';

export class Level8OperationBlackoutDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to Level 8: Operation Blackout. In this level, you'll defend critical infrastructure from a coordinated DDoS attack."
            },
            {
                text: "As an incident responder, you'll need to quickly identify the attack vectors and implement mitigation strategies to keep essential services online."
            },
            {
                text: "You'll be monitoring network traffic, configuring firewalls, and working with your team to contain the attack while maintaining business continuity."
            },
            {
                text: "Time is critical - prioritize your actions to protect the most vulnerable systems and maintain communication with stakeholders."
            },
            {
                text: "Successfully completing this level will earn you 400 XP in the Incident Response category. Are you ready to respond?"
            }
        ];
    }

    onComplete() {
        localStorage.setItem('cyberquest_level_8_started', 'true');
        
        // Open the Network Monitor application for DDoS defense
        if (window.applicationLauncher) {
            setTimeout(async () => {
                await window.applicationLauncher.launchForLevel(8, 'wireshark', 'Network Monitor');
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    static shouldAutoStart(levelId) {
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem(`cyberquest_level_${levelId}_started`);
        return currentLevel === '8' && !levelStarted;
    }

    static markLevelStarted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_started`, 'true');
    }

    static isCompleted() {
        return localStorage.getItem('cyberquest_level_8_completed') === 'true';
    }
}
