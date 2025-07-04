import { BaseDialogue } from '../../base-dialogue.js';

export class Level4PasswordHeistDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to Level 4: The Password Heist. In this level, you'll defend against brute-force attacks and implement strong password practices."
            },
            {
                text: "As a security professional, you'll need to understand password security fundamentals and implement multi-factor authentication to protect sensitive accounts."
            },
            {
                text: "You'll be configuring password policies, setting up MFA, and responding to brute-force attack attempts in real-time."
            },
            {
                text: "Pay attention to password complexity requirements, account lockout policies, and monitoring for suspicious login attempts."
            },
            {
                text: "Successfully completing this level will earn you 175 XP in the Authentication category. Are you ready to start?"
            }
        ];
    }

    onComplete() {
        localStorage.setItem('cyberquest_level_4_started', 'true');
        
        // Open the Terminal application for password security testing
        if (window.applicationLauncher) {
            setTimeout(async () => {
                await window.applicationLauncher.launchForLevel(4, 'terminal', 'Terminal');
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    static shouldAutoStart(levelId) {
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem(`cyberquest_level_${levelId}_started`);
        return currentLevel === '4' && !levelStarted;
    }

    static markLevelStarted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_started`, 'true');
    }

    static isCompleted() {
        return localStorage.getItem('cyberquest_level_4_completed') === 'true';
    }
}
