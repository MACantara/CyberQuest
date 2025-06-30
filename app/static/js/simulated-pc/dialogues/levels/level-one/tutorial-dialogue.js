import { BaseDialogue } from '../../../base-dialogue.js';

export class TutorialDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to your first lesson in media literacy! I'm your instructor, and I'll guide you through the fundamentals of identifying misinformation."
            },
            {
                text: "In today's digital world, false information spreads faster than ever. As a cybersecurity analyst, you need to develop critical thinking skills to separate fact from fiction."
            },
            {
                text: "You'll learn to verify sources, cross-reference information, analyze language for emotional manipulation, and use specialized tools to investigate suspicious content."
            },
            {
                text: "This tutorial will teach you the four key pillars: Source Verification, Cross-Referencing, Emotional Language Detection, and Image Verification."
            },
            {
                text: "Remember: Always question what you see online, verify before you share, and use multiple sources to confirm information. Let's begin your training!"
            }
        ];
    }

    async onComplete() {
        // Navigate to tutorial page
        if (this.desktop?.windowManager) {
            try {
                const browserApp = this.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    browserApp.navigation.navigateToUrl('https://cyberquest.academy/level/1/tutorial');
                }
            } catch (error) {
                console.error('Failed to navigate to tutorial:', error);
            }
        }
    }

    getFinalButtonText() {
        return 'Start Tutorial';
    }

    static shouldAutoStart() {
        const tutorialStarted = localStorage.getItem('cyberquest_tutorial_started');
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        return currentLevel === '1' && !tutorialStarted;
    }

    static markStarted() {
        localStorage.setItem('cyberquest_tutorial_started', 'true');
    }
}
