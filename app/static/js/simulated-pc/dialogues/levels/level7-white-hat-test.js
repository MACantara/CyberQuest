import { BaseDialogue } from '../../base-dialogue.js';

export class Level7WhiteHatTestDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to Level 7: The White Hat Test. In this level, you'll practice ethical hacking and responsible vulnerability disclosure."
            },
            {
                text: "As an ethical hacker, you'll need to think like an attacker to find and document security vulnerabilities before they can be exploited maliciously."
            },
            {
                text: "You'll be using penetration testing tools and methodologies to identify weaknesses in systems and applications, then reporting your findings responsibly."
            },
            {
                text: "Remember to follow ethical guidelines and only test systems you have explicit permission to assess. Document everything thoroughly."
            },
            {
                text: "Successfully completing this level will earn you 350 XP in the Ethical Hacking category. Ready to test your skills?"
            }
        ];
    }

    onComplete() {
        localStorage.setItem('cyberquest_level_7_completed', 'true');
        
        if (this.desktop?.levelManager) {
            setTimeout(async () => {
                await this.desktop.levelManager.startLevel(7);
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    static shouldAutoStart(levelId) {
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem(`cyberquest_level_${levelId}_started`);
        return currentLevel === '7' && !levelStarted;
    }

    static markLevelStarted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_started`, 'true');
    }

    static isCompleted() {
        return localStorage.getItem('cyberquest_level_7_completed') === 'true';
    }
}
