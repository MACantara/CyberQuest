import { BaseDialogue } from '../../base-dialogue.js';

export class Challenge1Dialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Excellent! Now for your first real challenge. You've discovered a viral news story about a senator's email hack that's spreading rapidly across social media."
            },
            {
                text: "This is a perfect example of how misinformation can influence public opinion, especially during election periods. Your job is to determine if this story is legitimate or fabricated."
            },
            {
                text: "Pay close attention to the website design, the language used, and most importantly - check if other credible news sources are reporting the same story."
            },
            {
                text: "Use the verification tools you learned about in the tutorial. Look for red flags like emotional language, missing author information, and suspicious website details."
            },
            {
                text: "Remember: Real news stories are typically reported by multiple credible sources. If only one questionable website is covering a major story, that's a huge red flag!"
            }
        ];
    }

    async onComplete() {
        // Navigate to challenge 1
        if (this.desktop?.windowManager) {
            try {
                const browserApp = this.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    browserApp.navigation.navigateToUrl('https://daily-politico-news.com/breaking-news');
                }
                localStorage.setItem('cyberquest_challenge1_started', 'true');
            } catch (error) {
                console.error('Failed to navigate to challenge 1:', error);
            }
        }
    }

    getFinalButtonText() {
        return 'Investigate Story';
    }

    static shouldAutoStart() {
        const challenge1Started = localStorage.getItem('cyberquest_challenge1_started');
        const tutorialCompleted = localStorage.getItem('cyberquest_tutorial_completed');
        return tutorialCompleted && !challenge1Started;
    }
}
