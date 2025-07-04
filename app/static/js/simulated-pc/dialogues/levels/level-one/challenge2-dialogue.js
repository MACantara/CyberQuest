import { BaseDialogue } from '../../base-dialogue.js';

export class Challenge2Dialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Great work on the first challenge! Now let's tackle something more complex - comparing multiple sources reporting on the same event."
            },
            {
                text: "In this challenge, you'll see three different news articles about a protest. Each source tells the story differently, and your job is to identify bias and inconsistencies."
            },
            {
                text: "This is crucial in real-world scenarios. Even legitimate news sources can have bias, and comparing multiple perspectives helps you understand the complete picture."
            },
            {
                text: "Look for differences in language tone, what facts are emphasized or omitted, and how quotes are used. Pay attention to the sources each article cites."
            },
            {
                text: "Your goal is to create an objective analysis by identifying what all sources agree on versus where they differ, and determine which sources are most credible."
            }
        ];
    }

    async onComplete() {
        // Navigate to challenge 2
        if (this.desktop?.windowManager) {
            try {
                const browserApp = this.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    browserApp.navigation.navigateToUrl('https://cyberquest.academy/level/1/challenge2');
                }
                localStorage.setItem('cyberquest_challenge2_started', 'true');
            } catch (error) {
                console.error('Failed to navigate to challenge 2:', error);
            }
        }
    }

    getFinalButtonText() {
        return 'Compare Sources';
    }

    static shouldAutoStart() {
        const challenge2Started = localStorage.getItem('cyberquest_challenge2_started');
        const challenge1Completed = localStorage.getItem('cyberquest_challenge1_completed');
        return challenge1Completed && !challenge2Started;
    }
}
