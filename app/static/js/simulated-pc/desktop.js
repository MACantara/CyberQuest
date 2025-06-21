import { Taskbar } from './desktop-components/taskbar.js';
import { DesktopIcons } from './desktop-components/desktop-icons.js';
import { ControlPanel } from './desktop-components/control-panel.js';
import { WindowManager } from './desktop-components/window-manager.js';
import { TutorialManager } from './tutorial-manager.js';
import DialogueManager from './dialogue-manager.js';
import { DialogueIntegration } from './dialogues/dialogue-integration.js';

export class Desktop {
    constructor(container) {
        this.container = container;
        this.tutorial = null;
        this.dialogueManager = null;
        this.dialogueIntegration = null;
        this.initializeDesktop();
    }

    async initializeDesktop() {
        // Create main desktop container with initial opacity 0 for fade-in effect
        this.desktopElement = document.createElement('div');
        this.desktopElement.className = 'relative w-full h-full bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 opacity-0 transition-opacity duration-1000 ease-in-out';
        this.desktopElement.style.backgroundImage = 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 255, 0, 0.05) 0%, transparent 50%)';
        
        this.container.appendChild(this.desktopElement);        // Initialize components - pass desktop instance to control panel
        this.taskbar = new Taskbar(this.desktopElement, null);
        
        // Initialize dialogue and tutorial systems before window manager
        this.dialogueManager = new DialogueManager(this);
        this.tutorial = new TutorialManager(this);
        this.dialogueIntegration = new DialogueIntegration(this);
        
        this.windowManager = new WindowManager(this.desktopElement, this.taskbar, this.tutorial);
        this.taskbar.windowManager = this.windowManager;
        
        this.desktopIcons = new DesktopIcons(this.desktopElement, this.windowManager);
        this.controlPanel = new ControlPanel(this.desktopElement, this.windowManager, this);

        // Trigger fade-in effect after all components are loaded
        setTimeout(() => {
            this.desktopElement.classList.remove('opacity-0');
            this.desktopElement.classList.add('opacity-100');
        }, 100);

        // Initialize global accessibility
        window.tutorial = this.tutorial;
        window.dialogueManager = this.dialogueManager;
        window.dialogueIntegration = this.dialogueIntegration;
        
        // Make tutorial restart function globally accessible
        window.restartTutorial = async () => {
            if (this.tutorial) {
                await this.tutorial.restartInitialTutorial();
            }
        };

        // Make dialogue restart functions globally accessible
        window.restartDialogues = () => {
            localStorage.removeItem('cyberquest_welcome_dialogue_completed');
            localStorage.removeItem('cyberquest_tutorial_intro_completed');
            localStorage.removeItem('cyberquest_mission_briefing_completed');
        };

        // Initialize dialogue flow first, then tutorials
        setTimeout(async () => {
            await this.initializeUserFlow();
        }, 2000); // Wait 2 seconds after desktop loads
    }

    async initializeUserFlow() {
        // Start with dialogue flow - this handles the narrative introduction
        await this.dialogueIntegration.initializeDialogueFlow();
        
        // Note: Dialogues will automatically trigger tutorials as needed
        // The flow is: Welcome → Tutorial Intro → Initial Tutorial → App Tutorials → Mission Briefing
    }

    // Method to trigger mission briefing when all tutorials are complete
    async onTutorialCompleted(tutorialName) {
        if (this.dialogueIntegration) {
            await this.dialogueIntegration.onTutorialCompleted(tutorialName);
        }
    }

    // Method to trigger dialogues when applications are opened
    async onApplicationOpened(appName) {
        if (this.dialogueIntegration) {
            await this.dialogueIntegration.onApplicationOpened(appName);
        }
    }

    // Legacy methods for backward compatibility
    exitSimulation() {
        this.controlPanel.exitSimulation();
    }

    showHelp() {
        this.controlPanel.showHelp();
    }

    showHint() {
        this.controlPanel.showHint();
    }

    showProgress() {
        this.controlPanel.showProgress();
    }
}
