import { BaseDialogue } from './base-dialogue.js';

export class DialogueManager {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentDialogue = null;
        this.initializeCSS();
    }

    initializeCSS() {
        // Add dialogue CSS styles to the page
        const dialogueStyles = document.createElement('style');
        dialogueStyles.textContent = `
            .dialogue-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding-top: 3vh;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
                
            .dialogue-container {
                background: rgb(55, 65, 81); /* bg-gray-700 */
                border: 2px solid #10b981;
                border-radius: 12px;
                padding: 2rem;
                max-width: 700px;
                width: 90%;
                min-height: 300px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                gap: 2rem;
                animation: dialogue-appear 0.3s ease-out;
            }
            
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
            
            .dialogue-avatar {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                border: 3px solid #10b981;
                object-fit: cover;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
                flex-shrink: 0;
            }
            
            .dialogue-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 200px;
            }
            
            .dialogue-speaker {
                color: #10b981;
                font-size: 1.25rem;
                font-weight: bold;
                margin-bottom: 1rem;
                text-align: left;
            }
            
            .dialogue-text {
                color: rgb(74, 222, 128); /* text-green-400 */
                font-size: 1.1rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                flex-grow: 1;
                text-align: left;
            }
            
            .dialogue-controls {
                display: flex;
                gap: 1rem;
                margin-top: auto;
            }
            
            .dialogue-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 0.9rem;
            }
            
            .dialogue-btn-primary {
                background: #10b981;
                color: white;
            }
            
            .dialogue-btn-primary:hover {
                background: #059669;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
            }
            
            .dialogue-btn-secondary {
                background: rgb(75, 85, 99); /* bg-gray-600 */
                color: white;
            }
            
            .dialogue-btn-secondary:hover {
                background: rgb(55, 65, 81); /* bg-gray-700 */
                transform: translateY(-1px);
            }
            
            .dialogue-typing {
                display: inline-block;
                animation: dialogue-typing 1.5s infinite;
            }
            
            @keyframes dialogue-typing {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            .dialogue-progress {
                position: absolute;
                bottom: 1rem;
                left: 50%;
                transform: translateX(-50%);
                color: rgba(74, 222, 128, 0.6);
                font-size: 0.8rem;
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