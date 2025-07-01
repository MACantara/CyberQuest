import { BaseDialogue } from '../../../base-dialogue.js';

export class LevelCompletionDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Congratulations! You've successfully completed Level 1: The Misinformation Maze. You've demonstrated excellent skills in identifying and combating false information."
            },
            {
                text: "You've mastered the fundamentals: source verification, cross-referencing, image verification, and social media investigation. These skills are essential in today's information landscape."
            },
            {
                text: "You've earned 100 XP in Information Literacy and unlocked the 'Fact-Checker' badge. Your training has prepared you to help protect others from misinformation."
            },
            {
                text: "Remember: misinformation spreads fast, but the truth spreads faster when people like you know how to verify and share accurate information."
            },
            {
                text: "You're now ready for more advanced challenges. Keep practicing these skills in real life - verify before you share, question suspicious content, and help others learn these critical skills!"
            }
        ];
    }

    async onComplete() {
        // Mark level as completed and update progress
        localStorage.setItem('cyberquest_level_1_completed', 'true');
        localStorage.setItem('cyberquest_current_level', '2');
        
        // Award XP and badges
        const currentXP = parseInt(localStorage.getItem('cyberquest_xp_info_literacy') || '0');
        localStorage.setItem('cyberquest_xp_info_literacy', (currentXP + 100).toString());
        
        const badges = JSON.parse(localStorage.getItem('cyberquest_badges') || '[]');
        if (!badges.includes('fact-checker')) {
            badges.push('fact-checker');
            localStorage.setItem('cyberquest_badges', JSON.stringify(badges));
        }
        
        // Navigate back to main dashboard or level selection
        if (this.desktop?.windowManager) {
            try {
                const browserApp = this.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    browserApp.navigation.navigateToUrl('https://cyberquest.com');
                }
            } catch (error) {
                console.error('Failed to navigate to dashboard:', error);
            }
        }
    }

    getFinalButtonText() {
        return 'Continue Training';
    }

    static shouldAutoStart() {
        const levelCompleted = localStorage.getItem('cyberquest_level_1_completed');
        const challenge4Completed = localStorage.getItem('cyberquest_challenge4_completed');
        return challenge4Completed && !levelCompleted;
    }
}
