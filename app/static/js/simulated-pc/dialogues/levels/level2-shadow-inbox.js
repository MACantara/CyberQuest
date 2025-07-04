import { BaseDialogue } from '../../base-dialogue.js';

export class Level2ShadowInboxDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to Level 2: Shadow in the Inbox. In this level, you'll be learning how to spot phishing attempts and practice safe email protocols."
            },
            {
                text: "Phishing is one of the most common cyber threats today. Attackers try to trick you into revealing sensitive information through seemingly legitimate emails."
            },
            {
                text: "You'll be presented with a series of emails. Some are legitimate, while others are phishing attempts. Your job is to identify which is which."
            },
            {
                text: "Look for telltale signs like suspicious sender addresses, urgent language, unexpected attachments, and requests for sensitive information."
            },
            {
                text: "Successfully completing this level will earn you 150 XP in the Email Security category. Ready to test your phishing detection skills?"
            }
        ];
    }

    onComplete() {
        // Store completion in localStorage
        localStorage.setItem('cyberquest_level_2_started', 'true');
        
        // Open the email application using application launcher
        if (window.applicationLauncher) {
            setTimeout(async () => {
                await window.applicationLauncher.launchForLevel(2, 'email', 'Email Client');
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    // Static methods
    static shouldAutoStart(levelId) {
        // Check if this is the current level and it hasn't been started yet
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem(`cyberquest_level_${levelId}_started`);
        return currentLevel === '2' && !levelStarted;
    }

    static markLevelStarted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_started`, 'true');
    }

    static markLevelCompleted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_completed`, 'true');
    }
}
