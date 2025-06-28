import { BaseDialogue } from '../../base-dialogue.js';

export class Level1MisinformationMazeDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to Level 1: The Misinformation Maze. In this level, you'll be working to debunk fake news and stop misinformation from influencing an election."
            },
            {
                text: "As a cybersecurity analyst, you'll need to develop sharp critical thinking skills to identify misleading information and verify sources accurately."
            },
            {
                text: "You'll be presented with various news articles and social media posts. Your task is to determine which ones are legitimate and which are spreading misinformation."
            },
            {
                text: "Remember to check sources, verify dates, and look for supporting evidence. Misinformation often relies on emotional appeals rather than facts."
            },
            {
                text: "Successfully completing this level will earn you 100 XP in the Information Literacy category. Are you ready to start?"
            }
        ];
    }

    onComplete() {
        // Store completion in localStorage
        localStorage.setItem('cyberquest_level_1_completed', 'true');
        
        // Start the level simulation
        if (this.desktop?.levelManager) {
            setTimeout(async () => {
                await this.desktop.levelManager.startLevel(1);
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    // Static methods
    static shouldAutoStart(levelId) {
        // Check if this is the current level and it hasn't been started yet
        const currentLevel = localStorage.getItem('cyberquest_current_level');
        const levelStarted = localStorage.getItem(`cyberquest_level_${levelId}_started`);
        return currentLevel === '1' && !levelStarted;
    }

    static markLevelStarted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_started`, 'true');
    }

    static markLevelCompleted(levelId) {
        localStorage.setItem(`cyberquest_level_${levelId}_completed`, 'true');
    }
}
