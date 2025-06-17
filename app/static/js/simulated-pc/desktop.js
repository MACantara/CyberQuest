import { Taskbar } from './desktop-components/taskbar.js';
import { DesktopIcons } from './desktop-components/desktop-icons.js';
import { ControlPanel } from './desktop-components/control-panel.js';
import { WindowManager } from './desktop-components/window-manager.js';

export class Desktop {
    constructor(container) {
        this.container = container;
        this.initializeDesktop();
    }

    initializeDesktop() {
        // Create main desktop container
        this.desktopElement = document.createElement('div');
        this.desktopElement.className = 'relative w-full h-full bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900';
        this.desktopElement.style.backgroundImage = 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 255, 0, 0.05) 0%, transparent 50%)';
        
        this.container.appendChild(this.desktopElement);

        // Initialize components
        this.taskbar = new Taskbar(this.desktopElement, null); // Will be set after WindowManager
        this.windowManager = new WindowManager(this.desktopElement, this.taskbar);
        this.taskbar.windowManager = this.windowManager; // Set the reference
        
        this.desktopIcons = new DesktopIcons(this.desktopElement, this.windowManager);
        this.controlPanel = new ControlPanel(this.desktopElement, this.windowManager);
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
