export class DialogueIntegration {
    constructor(desktop) {
        this.desktop = desktop;
        this.dialogueManager = desktop.dialogueManager;
        this.levelDialogues = new Map();
        this.initializeLevelDialogues();
    }

    // Initialize level dialogues
    initializeLevelDialogues() {
        // Level 1: The Misinformation Maze
        this.levelDialogues.set(1, {
            name: 'level1-misinformation-maze',
            className: 'Level1MisinformationMazeDialogue',
            displayName: 'The Misinformation Maze',
            category: 'Information Literacy',
            xp: 100,
            estimatedTime: '15 minutes',
            description: 'Debunk fake news and stop misinformation from influencing an election.'
        });

        // Level 2: Shadow in the Inbox
        this.levelDialogues.set(2, {
            name: 'level2-shadow-inbox',
            className: 'Level2ShadowInboxDialogue',
            displayName: 'Shadow in the Inbox',
            category: 'Email Security',
            xp: 150,
            estimatedTime: '20 minutes',
            description: 'Spot phishing attempts and practice safe email protocols.'
        });
    }

    // Initialize dialogue flow on desktop startup
    async initializeDialogueFlow() {
        console.log('[DialogueIntegration] initializeDialogueFlow called');
        
        // Check for welcome dialogue first
        const shouldStartWelcome = await this.dialogueManager.shouldAutoStartWelcome();
        console.log('[DialogueIntegration] shouldAutoStartWelcome:', shouldStartWelcome);
        
        if (shouldStartWelcome) {
            console.log('[DialogueIntegration] Starting welcome dialogue');
            await this.dialogueManager.startWelcomeDialogue();
            return;
        }

        // Check for level dialogues from backend
        console.log('[DialogueIntegration] Desktop level:', this.desktop.level);
        if (this.desktop.level) {
            const levelNum = typeof this.desktop.level === 'object' ? this.desktop.level.id : this.desktop.level;
            console.log('[DialogueIntegration] Looking for level dialogue:', levelNum);
            
            if (this.levelDialogues.has(levelNum)) {
                console.log('[DialogueIntegration] Found level dialogue, starting...');
                await this.startLevelDialogue(levelNum);
            } else {
                console.warn('[DialogueIntegration] No dialogue found for level:', levelNum);
            }
        } else {
            console.log('[DialogueIntegration] No level specified on desktop');
        }
    }

    // Start a specific level's dialogue
    async startLevelDialogue(levelNumber) {
        const level = this.levelDialogues.get(levelNumber);
        if (!level) return;

        // Mark level as started
        localStorage.setItem(`cyberquest_level_${levelNumber}_started`, 'true');
        
        // Start the dialogue
        await this.dialogueManager.startDialogueByName(level.name, 'instructor');
    }

    // Get level information by number
    getLevelInfo(levelNumber) {
        return this.levelDialogues.get(levelNumber) || null;
    }

    // Get all level information
    getAllLevels() {
        return Array.from(this.levelDialogues.entries())
            .map(([number, data]) => ({
                number,
                ...data
            }));
    }

    // Trigger welcome dialogue
    async triggerWelcomeBack() {
        await this.dialogueManager.startDialogueByName('welcome', 'agent');
    }

    // Reset dialogue completion flags in localStorage
    restartDialogues() {
        // Clear welcome dialogue flag
        localStorage.removeItem('cyberquest_welcome_dialogue_completed');
        
        // Clear all level-related flags
        for (const levelNum of this.levelDialogues.keys()) {
            localStorage.removeItem(`cyberquest_level_${levelNum}_started`);
            localStorage.removeItem(`cyberquest_level_${levelNum}_completed`);
        }
        
        return 'Dialogues have been reset. Refresh the page to see the welcome dialogue again.';
    }
}