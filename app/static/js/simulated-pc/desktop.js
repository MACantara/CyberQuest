import { Taskbar } from './desktop-components/taskbar.js';
import { DesktopIcons } from './desktop-components/desktop-icons.js';
import { ControlPanel } from './desktop-components/control-panel.js';
import { WindowManager } from './desktop-components/window-manager.js';
import { TutorialManager } from './tutorial-manager.js';

export class Desktop {
    constructor(container) {
        this.container = container;
        this.tutorial = null;
        this.initializeDesktop();
    }

    async initializeDesktop() {
        // Create main desktop container with initial opacity 0 for fade-in effect
        this.desktopElement = document.createElement('div');
        this.desktopElement.className = 'relative w-full h-full bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 opacity-0 transition-opacity duration-1000 ease-in-out';
        this.desktopElement.style.backgroundImage = 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 255, 0, 0.05) 0%, transparent 50%)';
        
        this.container.appendChild(this.desktopElement);

        // Initialize components - pass desktop instance to control panel
        this.taskbar = new Taskbar(this.desktopElement, null);
        this.windowManager = new WindowManager(this.desktopElement, this.taskbar);
        this.taskbar.windowManager = this.windowManager;
        
        this.desktopIcons = new DesktopIcons(this.desktopElement, this.windowManager);
        this.controlPanel = new ControlPanel(this.desktopElement, this.windowManager, this);

        // Trigger fade-in effect after all components are loaded
        setTimeout(() => {
            this.desktopElement.classList.remove('opacity-0');
            this.desktopElement.classList.add('opacity-100');
        }, 100);

        // Initialize tutorial after all components are loaded
        this.tutorial = new TutorialManager(this);
        window.tutorial = this.tutorial; // Make globally accessible
        
        // Make tutorial restart function globally accessible
        window.restartTutorial = async () => {
            if (this.tutorial) {
                await this.tutorial.restartInitialTutorial();
            }
        };

        // Auto-start tutorial for new users
        setTimeout(async () => {
            const shouldStart = await this.tutorial.shouldAutoStartInitial();
            if (shouldStart) {
                await this.tutorial.startInitialTutorial();
            }
        }, 2000); // Wait 2 seconds after desktop loads
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
