import { BaseDialogue } from '../base-dialogue.js';
import { 
    Challenge1Dialogue, 
    LevelCompletionDialogue 
} from './level-one/index.js';

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

    async onComplete() {
        // Store completion in localStorage
        localStorage.setItem('cyberquest_level_1_started', 'true');
        
        // Start the level simulation by opening the browser using application launcher
        if (window.applicationLauncher) {
            try {
                await window.applicationLauncher.launchForLevel(1, 'browser', 'Web Browser');
                
                // Get the browser instance from the applications map
                const browserApp = this.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    // Wait a moment for the browser to initialize
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Navigate directly to the challenge1 page
                    browserApp.navigation.navigateToUrl('https://daily-politico-news.com/breaking-news');
                    
                    // Wait for page to load, then trigger challenge1 dialogue
                    setTimeout(() => {
                        this.triggerChallenge1Dialogue();
                    }, 1000);
                }
                
                // Mark the challenge as started
                localStorage.setItem('cyberquest_challenge1_started', 'true');
            } catch (error) {
                console.error('Failed to open browser:', error);
            }
        }
    }

    triggerChallenge1Dialogue() {
        // Ensure no other dialogue is active
        if (window.currentDialogue) {
            window.currentDialogue.cleanup();
        }
        
        // Start the challenge1 dialogue
        const challenge1Dialogue = new Challenge1Dialogue(this.desktop);
        window.currentDialogue = challenge1Dialogue;
        challenge1Dialogue.start();
    }

    getFinalButtonText() {
        return 'Start Simulation';
    }

    // Static methods for tutorial management
    static shouldAutoStart(levelId) {
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

    // Methods to trigger specific dialogues
    static async startTutorialDialogue(desktop) {
        if (TutorialDialogue.shouldAutoStart()) {
            // Ensure no other dialogue is active
            if (window.currentDialogue) {
                window.currentDialogue.cleanup();
            }
            
            const dialogue = new TutorialDialogue(desktop);
            window.currentDialogue = dialogue;
            dialogue.start();
            TutorialDialogue.markStarted();
        }
    }

    static async startChallenge1Dialogue(desktop) {
        if (Challenge1Dialogue.shouldAutoStart()) {
            // Ensure no other dialogue is active
            if (window.currentDialogue) {
                window.currentDialogue.cleanup();
            }
            
            const dialogue = new Challenge1Dialogue(desktop);
            window.currentDialogue = dialogue;
            dialogue.start();
        }
    }

    static async startLevelCompletionDialogue(desktop) {
        if (LevelCompletionDialogue.shouldAutoStart()) {
            // Ensure no other dialogue is active
            if (window.currentDialogue) {
                window.currentDialogue.cleanup();
            }
            
            const dialogue = new LevelCompletionDialogue(desktop);
            window.currentDialogue = dialogue;
            dialogue.start();
        }
    }

    // Start a level dialogue by name
    async startLevelDialogue(levelDialogueName, character = 'instructor') {
        console.log(`[DialogueManager] Starting level dialogue: ${levelDialogueName}`);
        try {
            // Use proper import path - remove the leading slash and use relative path
            const modulePath = `./levels/${levelDialogueName}.js`;
            console.log(`[DialogueManager] Importing module from: ${modulePath}`);
            const module = await import(modulePath);
            
            // Generate the class name by capitalizing each word and appending 'Dialogue'
            const className = levelDialogueName.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join('') + 'Dialogue';
            console.log(`[DialogueManager] Looking for class: ${className}`);
            
            console.log(`Looking for dialogue class: ${className} in module:`, module);
            const dialogueClass = module[className];
            if (!dialogueClass) {
                const availableExports = Object.keys(module).join(', ');
                throw new Error(`Dialogue class '${className}' not found in module. Available exports: ${availableExports}`);
            }
            
            // Create and start the dialogue
            const dialogue = new dialogueClass(this.desktop, character);
            if (typeof dialogue.start === 'function') {
                // Store reference for event handlers
                window.currentDialogue = dialogue;
                // Store reference in manager for cleanup
                this.currentDialogue = dialogue;
                
                // Ensure cleanup on completion
                const originalComplete = dialogue.complete.bind(dialogue);
                dialogue.complete = () => {
                    if (window.currentDialogue === dialogue) {
                        window.currentDialogue = null;
                    }
                    return originalComplete();
                };
                
                // Start the dialogue
                dialogue.start();
                return dialogue;
            } else {
                throw new Error('Dialogue class must implement start() method');
            }
        } catch (error) {
            console.error(`Error loading level dialogue '${levelDialogueName}':`, error);
            throw new Error(`Failed to load dialogue '${levelDialogueName}': ${error.message}`);
        }
    }
}
