import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

export class FileManagerTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '#file-toolbar',
                title: 'File Manager Toolbar',
                content: 'This is the file manager toolbar with navigation buttons and address bar. It helps you navigate through different directories and provides quick access to common actions.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#address-bar',
                title: 'Address Bar',
                content: 'The address bar shows your current location in the file system. You\'re currently in /home/trainee directory, which is the user\'s home folder.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#file-grid',
                title: 'File Grid Overview',
                content: 'This is the main file area where you can see all files and folders. Notice the different icons and colors that help identify file types and security status.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#documents-folder',
                title: 'Safe Folders',
                content: 'Standard folders like Documents and Downloads are generally safe. These contain your regular files and downloaded content. Blue folder icons indicate directories.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#downloads-folder',
                title: 'Downloads Folder',
                content: 'The Downloads folder contains files downloaded from the internet. Always be cautious with files in this folder as they may contain malware or suspicious content.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#suspicious-file-txt-file',
                title: '⚠️ Suspicious File Alert',
                content: 'WARNING! This file has been flagged as suspicious. Notice the red border, red text, and pulsing animation - these are clear indicators to never open suspicious files!',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#readme-txt-file',
                title: 'Safe System Files',
                content: 'Files like readme.txt are typically safe documentation files. Gray icons usually indicate text files. Always verify file sources and be cautious with executables (.exe, .bat, .scr).',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#file-grid',
                title: 'File Security Training Complete!',
                content: 'Excellent! You\'ve learned to identify file security indicators: folder types, suspicious file warnings, and safe documentation files. Always trust visual security cues and verify unknown files before opening.',
                action: 'highlight',
                position: 'left',
                final: true
            }
        ];
    }

    async start() {
        // Ensure file manager is open
        if (!this.desktop.windowManager.windows.has('file-manager')) {
            try {
                await this.desktop.windowManager.openFileManager();
                // Wait for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('File Manager application not found:', error);
                return;
            }
        }

        // Initialize CSS first
        this.initializeCSS();
        
        // Enable tutorial mode
        tutorialInteractionManager.enableTutorialMode();
        
        // Set tutorial state
        this.isActive = true;
        this.stepManager.reset();
        
        // Create overlay before showing any steps
        this.createOverlay();
        
        // Ensure file manager window is in front
        this.ensureFileManagerInFront();
        
        // Set global reference
        window.fileManagerTutorial = this;
        window.currentTutorial = this;
        
        // Wait for file manager to be fully loaded and then start showing steps
        setTimeout(() => {
            this.stepManager.showStep();
        }, 1000);
    }

    ensureFileManagerInFront() {
        const fileManagerWindow = document.querySelector('.window[data-window-id="file-manager"]') || 
                                 document.querySelector('.window .file-manager') ||
                                 document.querySelector('[id*="file-manager"]')?.closest('.window');
        
        if (fileManagerWindow) {
            fileManagerWindow.style.zIndex = '51';
            fileManagerWindow.style.position = 'relative';
        }
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        let target = document.querySelector(step.target);
        
        // Special handling for file grid step - ensure we're in the home directory
        if (step.target === '#file-grid') {
            // Make sure we're in the home directory view
            const addressBar = document.querySelector('#address-bar');
            if (addressBar && !addressBar.textContent.includes('/home/trainee')) {
                // Navigate back to home if needed
                const homeBtn = document.querySelector('#home-btn');
                if (homeBtn) {
                    homeBtn.click();
                    // Wait a moment for the view to update
                    setTimeout(() => {
                        this.showStep();
                    }, 300);
                    return;
                }
            }
            target = document.querySelector('#file-grid');
        }
        
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Clear previous highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Setup interactions for this step
        this.setupStepInteraction(step, target);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_filemanager_tutorial_completed', 'true');
    }

    // Override base class methods for proper tutorial flow
    getSkipTutorialHandler() {
        return 'window.fileManagerTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.fileManagerTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.fileManagerTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.fileManagerTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    // Static methods for auto-start functionality
    static shouldAutoStart() {
        const tutorialCompleted = localStorage.getItem('cyberquest_filemanager_tutorial_completed');
        const fileManagerOpened = localStorage.getItem('cyberquest_filemanager_opened');
        
        return fileManagerOpened && !tutorialCompleted;
    }

    static startTutorial(desktop) {
        console.log('Starting File Manager tutorial...');
        const tutorial = new FileManagerTutorial(desktop);
        window.fileManagerTutorial = tutorial;
        tutorial.start();
        return tutorial;
    }

    static restart() {
        localStorage.removeItem('cyberquest_filemanager_tutorial_completed');
        localStorage.removeItem('cyberquest_filemanager_opened');
    }
}