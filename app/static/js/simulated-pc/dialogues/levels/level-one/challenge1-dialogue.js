import { BaseDialogue } from '../../base-dialogue.js';

export class Challenge1Dialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Excellent! Now for your first real challenge. You'll analyze multiple news articles using our Interactive Analysis system to identify misinformation and credible sources."
            },
            {
                text: "You'll work through several articles where different elements can be labeled as 'fake' or 'real'. Click on titles, author names, content sections, and other parts to classify them based on credibility indicators."
            },
            {
                text: "Look for red flags like sensational headlines, questionable sources, missing author credentials, emotional manipulation, and biased language. Pay attention to factual accuracy and source verification."
            },
            {
                text: "The Interactive Analysis panel on the right will guide you through the process. It shows your progress and provides feedback as you work. Each article is powered by AI-analyzed training data."
            },
            {
                text: "Remember: Click elements once to mark as 'fake/suspicious', twice to mark as 'real/legitimate', and three times to remove the label. Take your time to analyze each article thoroughly."
            },
            {
                text: "After labeling elements in each article, submit your analysis to get feedback. You'll see detailed results and learn from any mistakes before moving to the next article."
            }
        ];
    }

    async onComplete() {
        // Just mark the challenge as started - navigation is handled elsewhere
        localStorage.setItem('cyberquest_challenge1_started', 'true');
    }

    getFinalButtonText() {
        return 'Begin Interactive Analysis';
    }

    static shouldAutoStart() {
        const challenge1Started = localStorage.getItem('cyberquest_challenge1_started');
        return !challenge1Started;
    }
}
