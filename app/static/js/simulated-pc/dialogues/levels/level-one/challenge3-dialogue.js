import { BaseDialogue } from '../../base-dialogue.js';

export class Challenge3Dialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Excellent progress! Now we're moving into image verification - one of the most important skills in modern misinformation detection."
            },
            {
                text: "Images can be manipulated, taken out of context, or completely fabricated. You'll encounter a viral image claiming to show recent police brutality at a protest."
            },
            {
                text: "You'll use professional verification tools: reverse image search to find the original source, metadata analysis to check when and where it was taken, and weather/location verification."
            },
            {
                text: "This is exactly how professional fact-checkers and journalists work. These tools can reveal if an image is being misused to push false narratives."
            },
            {
                text: "Remember: Just because an image looks real doesn't mean it's being used in the correct context. Always verify before believing or sharing!"
            }
        ];
    }

    async onComplete() {
        // Navigate to challenge 3
        if (this.desktop?.windowManager) {
            try {
                const browserApp = this.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    browserApp.navigation.navigateToUrl('https://cyberquest.academy/level/1/challenge3');
                }
                localStorage.setItem('cyberquest_challenge3_started', 'true');
            } catch (error) {
                console.error('Failed to navigate to challenge 3:', error);
            }
        }
    }

    getFinalButtonText() {
        return 'Verify Image';
    }

    static shouldAutoStart() {
        const challenge3Started = localStorage.getItem('cyberquest_challenge3_started');
        const challenge2Completed = localStorage.getItem('cyberquest_challenge2_completed');
        return challenge2Completed && !challenge3Started;
    }
}
