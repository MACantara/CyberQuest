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
            { name: 'welcome', class: 'WelcomeDialogue', title: 'Welcome Message', defaultCharacter: 'agent' },
            { name: 'mission-briefing', class: 'MissionBriefingDialogue', title: 'Mission Briefing', defaultCharacter: 'commander' },
            { name: 'tutorial-intro', class: 'TutorialIntroDialogue', title: 'Tutorial Introduction', defaultCharacter: 'instructor' }
        ];
    }

    // Utility method to start any dialogue by name
    async startDialogueByName(dialogueName, character = null) {
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