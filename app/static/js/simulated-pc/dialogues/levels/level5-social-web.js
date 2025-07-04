import { BaseDialogue } from '../base-dialogue.js';

export class Level5SocialWebDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to Level 5: The Social Web. In this level, you'll navigate ethical social media behavior and protect your digital footprint."
            },
            {
                text: "As a digital citizen, you'll need to understand the implications of your online presence and how to protect your privacy across different platforms."
            },
            {
                text: "You'll be configuring privacy settings, identifying social engineering attempts, and learning how to manage your digital identity effectively."
            },
            {
                text: "Pay attention to the information you share online and how it can be used by others, both positively and negatively."
            },
            {
                text: "Successfully completing this level will earn you 180 XP in the Privacy Protection category. Ready to begin?"
            }
        ];
    }

    onComplete() {
        localStorage.setItem('cyberquest_level_5_started', 'true');
        
        // Open the Browser application for social media security
        if (window.applicationLauncher) {
            setTimeout(async () => {
                await window.applicationLauncher.launchForLevel(5, 'browser', 'Web Browser');
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    static shouldAutoStart(levelId) {
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem(`cyberquest_level_${levelId}_started`);
        return currentLevel === '5' && !levelStarted;
    }

    static markLevelStarted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_started`, 'true');
    }

    static isCompleted() {
        return localStorage.getItem('cyberquest_level_5_completed') === 'true';
    }
}
