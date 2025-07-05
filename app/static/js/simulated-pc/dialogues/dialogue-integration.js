export class DialogueIntegration {
    constructor(desktop) {
        this.desktop = desktop;
        this.dialogueManager = desktop.dialogueManager;
        this.levelDialogues = new Map();
        this.initializeLevelDialogues();
    }

    // Helper method to add a level dialogue
    addLevelDialogue(levelNum, name, displayName, category, xp, estimatedTime, description) {
        const className = `Level${levelNum}${name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('').replace(/[^a-zA-Z0-9]/g, '')}Dialogue`;
        
        this.levelDialogues.set(levelNum, {
            name: `level${levelNum}-${name}`,
            className,
            displayName,
            category,
            xp,
            estimatedTime,
            description
        });
    }

    // Initialize level dialogues
    initializeLevelDialogues() {
        // Level 1: The Misinformation Maze
        this.addLevelDialogue(
            1,
            'misinformation-maze',
            'The Misinformation Maze',
            'Information Literacy',
            100,
            '15 minutes',
            'Debunk fake news and stop misinformation from influencing an election.'
        );

        // Level 2: Shadow in the Inbox
        this.addLevelDialogue(
            2,
            'shadow-inbox',
            'Shadow in the Inbox',
            'Email Security',
            150,
            '20 minutes',
            'Spot phishing attempts and practice safe email protocols.'
        );

        // Level 3: Malware Mayhem
        this.addLevelDialogue(
            3,
            'malware-mayhem',
            'Malware Mayhem',
            'Threat Detection',
            200,
            '25 minutes',
            'Isolate infections and perform digital cleanup during a gaming tournament.'
        );

        // Level 4: The White Hat Test
        this.addLevelDialogue(
            4,
            'white-hat-test',
            'The White Hat Test',
            'Ethical Hacking',
            350,
            '30 minutes',
            'Practice ethical hacking and responsible vulnerability disclosure.'
        );

        // Level 5: The Hunt for The Null
        this.addLevelDialogue(
            5,
            'hunt-for-the-null',
            'The Hunt for The Null',
            'Digital Forensics',
            500,
            '40 minutes',
            'Final mission: Use advanced digital forensics to expose The Null\'s identity.'
        );
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