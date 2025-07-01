import { BaseDialogue } from '../../../base-dialogue.js';

export class Challenge4Dialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Outstanding work! For your final challenge, you'll investigate a social media post spreading medical misinformation - one of the most dangerous types of false information."
            },
            {
                text: "You'll encounter a post claiming that vaccines cause severe side effects in 87% of recipients. This type of misinformation can literally cost lives if people believe it."
            },
            {
                text: "You'll use advanced investigation techniques: profile analysis to check if the account is suspicious, engagement analysis to detect bot activity, and language analysis to identify manipulation techniques."
            },
            {
                text: "This challenge combines everything you've learned: source verification, fact-checking with medical authorities, and understanding how misinformation spreads on social platforms."
            },
            {
                text: "Your professional assessment will help you understand how to respond to dangerous misinformation while educating others about the importance of scientific accuracy."
            }
        ];
    }

    async onComplete() {
        // Navigate to challenge 4
        if (this.desktop?.windowManager) {
            try {
                const browserApp = this.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    browserApp.navigation.navigateToUrl('https://social.cyberquest.academy/posts/controversial-claim');
                }
                localStorage.setItem('cyberquest_challenge4_started', 'true');
            } catch (error) {
                console.error('Failed to navigate to challenge 4:', error);
            }
        }
    }

    getFinalButtonText() {
        return 'Investigate Post';
    }

    static shouldAutoStart() {
        const challenge4Started = localStorage.getItem('cyberquest_challenge4_started');
        const challenge3Completed = localStorage.getItem('cyberquest_challenge3_completed');
        return challenge3Completed && !challenge4Started;
    }
}
