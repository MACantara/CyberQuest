import { BaseDialogue } from '../../base-dialogue.js';

export class Challenge1Dialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Excellent! Now for your first real challenge."
            },
            {
                text: "You'll analyze multiple news articles using our Interactive Analysis system to identify misinformation and credible sources."
            },
            {
                text: "Each article contains different elements that you can label as 'fake' or 'real' by clicking on them."
            },
            {
                text: "Look for titles, author names, content sections, and other parts that can be classified based on credibility indicators."
            },
            {
                text: "Watch for red flags like sensational headlines, questionable sources, and missing author credentials."
            },
            {
                text: "Pay attention to emotional manipulation, biased language, and factual accuracy."
            },
            {
                text: "The Interactive Analysis panel on the right will guide you through the process."
            },
            {
                text: "It shows your progress and provides feedback as you work. Each article is powered by AI-analyzed training data."
            },
            {
                text: "Remember: Click elements once to mark as 'fake/suspicious', twice to mark as 'real/legitimate'."
            },
            {
                text: "Click three times to remove the label if you change your mind."
            },
            {
                text: "Take your time to analyze each article thoroughly before submitting."
            },
            {
                text: "After labeling elements in each article, submit your analysis to get detailed feedback."
            },
            {
                text: "You'll see results and learn from any mistakes before moving to the next article."
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
