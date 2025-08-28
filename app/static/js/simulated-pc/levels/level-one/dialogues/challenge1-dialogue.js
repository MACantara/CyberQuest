import { BaseDialogue } from '../../base-dialogue.js';

export class Challenge1Dialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to your first cybersecurity challenge! You'll be analyzing real news articles to develop critical thinking skills for identifying misinformation."
            },
            {
                text: "You'll analyze multiple news articles using our Interactive Analysis system to identify misinformation and credible sources."
            },
            {
                text: "Each article contains different elements that you can label by clicking on them to open a dropdown menu."
            },
            {
                text: "When you click an element, a menu will appear with three options: 'Fake News', 'Real News', or 'No Label'."
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
                text: "The Interactive Analysis panel on the right will guide you through the process and show the color-coded legend."
            },
            {
                text: "It shows your progress and provides feedback as you work. Each article is powered by AI-analyzed training data."
            },
            {
                text: "Remember: Click any article element to open the labeling dropdown menu."
            },
            {
                text: "Select 'Fake News' (red) for suspicious content, 'Real News' (green) for credible content, or 'No Label' (gray) if uncertain."
            },
            {
                text: "You can always click on a labeled element again to change your selection using the dropdown menu."
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
