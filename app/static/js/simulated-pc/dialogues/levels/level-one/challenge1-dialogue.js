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
        // Just mark the challenge as started - navigation is handled elsewhere
        localStorage.setItem('cyberquest_challenge1_started', 'true');
    }

    getFinalButtonText() {
        return 'Begin Investigation';
    }

    static shouldAutoStart() {
        const challenge1Started = localStorage.getItem('cyberquest_challenge1_started');
        const tutorialCompleted = localStorage.getItem('cyberquest_tutorial_completed');
        return tutorialCompleted && !challenge1Started;
    }
}
