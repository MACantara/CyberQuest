import { BaseTutorial } from '../base-tutorial.js';

export class FileManagerTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '#file-toolbar',
                title: 'File Manager Toolbar',
                content: 'This is the file manager toolbar with navigation buttons and address bar. It helps you navigate through different directories.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#address-bar',
                title: 'Address Bar',
                content: 'The address bar shows your current location in the file system. You\'re currently in /home/trainee directory.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#documents-folder',
                title: 'Safe Folders',
                content: 'Standard folders like Documents and Downloads are generally safe. These contain your regular files and downloaded content.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#suspicious-file',
                title: '⚠️ Suspicious File Alert',
                content: 'WARNING! This file has been flagged as suspicious. Notice the red border and pulsing effect - never open files that look suspicious!',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#readme-file',
                title: 'Safe Files',
                content: 'Files like readme.txt are typically safe documentation files. Always be cautious with executable files (.exe, .bat, .scr) from unknown sources.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#file-grid',
                title: 'File Security Complete',
                content: 'You\'ve learned to identify suspicious files! Always check file sources, avoid suspicious executables, and trust your instincts when something looks wrong.',
                action: 'highlight',
                position: 'left',
                final: true
            }
        ];
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        
        // Wait for file manager to be fully loaded
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
        }, 1000);
    }

    // Override base class methods
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

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_filemanager_tutorial_completed', 'true');
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_filemanager_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_filemanager_tutorial_completed');
    }
}