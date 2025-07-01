import { BaseDialogue } from './base-dialogue.js';

export class DialogueManager {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentDialogue = null;
        this.initializeCSS();
    }    
    
    initializeCSS() {
        // Add minimal dialogue CSS styles
        const dialogueStyles = document.createElement('style');
        dialogueStyles.textContent = `
            @keyframes dialogue-appear {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            .dialogue-appear {
                animation: dialogue-appear 0.3s ease-out;
            }
            
            @keyframes dialogue-typing {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            .dialogue-typing {
                display: inline-block;
                animation: dialogue-typing 1.5s infinite;
            }
        `;
        document.head.appendChild(dialogueStyles);
    }

    // Generic dialogue starter
    async startDialogue(dialogueName, dialogueClass, character) {
        if (this.currentDialogue) {
            this.currentDialogue.cleanup();
        }
        
        // Dynamic import to avoid circular dependency
        const module = await import(`./dialogues/${dialogueName}-dialogue.js`);
        const DialogueClass = module[dialogueClass];
        
        this.currentDialogue = new DialogueClass(this.desktop, character);
        window.currentDialogue = this.currentDialogue; // For global access
        this.currentDialogue.start();
    }

    // Generic auto-start checker
    async shouldAutoStart(dialogueName, dialogueClass) {
        const module = await import(`./dialogues/${dialogueName}-dialogue.js`);
        const DialogueClass = module[dialogueClass];
        return DialogueClass.shouldAutoStart();
    }

    // Generic dialogue restarter
    async restartDialogue(dialogueName, dialogueClass, character, startMethodName) {
        const module = await import(`./dialogues/${dialogueName}-dialogue.js`);
        const DialogueClass = module[dialogueClass];
        DialogueClass.restart();
        await this[startMethodName](character);
    }

    // Individual dialogue methods using the generic functions
    async startWelcomeDialogue(character = 'agent') {
        return this.startDialogue('welcome', 'WelcomeDialogue', character);
    }

    async shouldAutoStartWelcome() {
        return this.shouldAutoStart('welcome', 'WelcomeDialogue');
    }

    async restartWelcomeDialogue(character = 'agent') {
        return this.restartDialogue('welcome', 'WelcomeDialogue', character, 'startWelcomeDialogue');
    }

    async startMissionBriefingDialogue(character = 'commander') {
        return this.startDialogue('mission-briefing', 'MissionBriefingDialogue', character);
    }

    async shouldAutoStartMissionBriefing() {
        return this.shouldAutoStart('mission-briefing', 'MissionBriefingDialogue');
    }

    async restartMissionBriefingDialogue(character = 'commander') {
        return this.restartDialogue('mission-briefing', 'MissionBriefingDialogue', character, 'startMissionBriefingDialogue');
    }

    async startTutorialIntroDialogue(character = 'instructor') {
        return this.startDialogue('tutorial-intro', 'TutorialIntroDialogue', character);
    }

    async shouldAutoStartTutorialIntro() {
        return this.shouldAutoStart('tutorial-intro', 'TutorialIntroDialogue');
    }

    async restartTutorialIntroDialogue(character = 'instructor') {
        return this.restartDialogue('tutorial-intro', 'TutorialIntroDialogue', character, 'startTutorialIntroDialogue');
    }

    // Utility method to get all available dialogues
    getDialogueList() {
        return [
            { name: 'welcome', class: 'WelcomeDialogue', title: 'Welcome Message', defaultCharacter: 'agent' }
            // Removed other dialogue types as they were deleted
        ];
    }

    // Utility method to start any dialogue by name
    async startDialogueByName(dialogueName, character = null) {
        // Check if this is a level dialogue
        if (dialogueName.startsWith('level')) {
            return this.startLevelDialogue(dialogueName, character);
        }

        // Handle regular dialogues
        const dialogueInfo = this.getDialogueList().find(d => d.name === dialogueName);
        if (!dialogueInfo) {
            throw new Error(`Dialogue '${dialogueName}' not found`);
        }

        const methodName = `start${dialogueName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('')}Dialogue`;
        
        if (typeof this[methodName] === 'function') {
            return await this[methodName](character || dialogueInfo.defaultCharacter);
        } else {
            throw new Error(`Method '${methodName}' not found`);
        }
    }

    // Start a level dialogue by name
    async startLevelDialogue(levelDialogueName, character = 'instructor') {
        console.log(`[DialogueManager] Starting level dialogue: ${levelDialogueName}`);
        try {
            // First try the direct relative path from dialogue-manager location
            let module;
            try {
                module = await import(`./dialogues/levels/${levelDialogueName}.js`);
            } catch (relativeError) {
                console.log(`[DialogueManager] Relative import failed, trying absolute path...`);
                // Try absolute path as fallback
                const absolutePath = `/static/js/simulated-pc/dialogues/levels/${levelDialogueName}.js`;
                module = await import(absolutePath);
            }
            
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
            
            // If it's a missing file error, provide helpful guidance
            if (error.message.includes('Failed to fetch')) {
                console.error(`[DialogueManager] File not found: ${levelDialogueName}.js`);
                console.error(`[DialogueManager] Expected location: /static/js/simulated-pc/dialogues/levels/${levelDialogueName}.js`);
                
                // Try to provide alternative suggestions
                const suggestions = this.getSuggestedDialogues(levelDialogueName);
                if (suggestions.length > 0) {
                    console.error(`[DialogueManager] Did you mean: ${suggestions.join(', ')}?`);
                }
            }
            
            throw new Error(`Failed to load dialogue '${levelDialogueName}': ${error.message}`);
        }
    }

    // Helper method to suggest alternative dialogue names
    getSuggestedDialogues(missingDialogue) {
        const commonDialogues = [
            'level1-misinformation-maze',
            'welcome',
            'mission-briefing',
            'tutorial-intro'
        ];
        
        // Simple fuzzy matching
        return commonDialogues.filter(dialogue => 
            dialogue.includes(missingDialogue.toLowerCase()) || 
            missingDialogue.toLowerCase().includes(dialogue)
        );
    }

    // Character avatar management
    getCharacterAvatar(character) {
        const avatars = {
            'agent': '/static/images/avatars/agent.png',
            'commander': '/static/images/avatars/commander.png',
            'instructor': '/static/images/avatars/instructor.png',
            'analyst': '/static/images/avatars/analyst.png',
            'hacker': '/static/images/avatars/hacker.png',
            'default': '/static/images/avatars/default.png'
        };
        
        return avatars[character] || avatars['default'];
    }

    getCharacterName(character) {
        const names = {
            'agent': 'Agent Phoenix',
            'commander': 'Commander Steel',
            'instructor': 'Dr. Cipher',
            'analyst': 'Analyst Nova',
            'hacker': 'Shadow',
            'default': 'System'
        };
        
        return names[character] || names['default'];
    }
}

// Export DialogueManager as default
export default DialogueManager;