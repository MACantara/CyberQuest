import { BaseTutorial } from '../base-tutorial.js';
import { SkipTutorialModal } from '../desktop-components/skip-tutorial-modal.js';

export class TerminalTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.skipTutorialModal = null;
        this.steps = [
            {
                target: '#terminal-container',
                title: 'Command Line Terminal',
                content: 'Welcome to the terminal! This is a powerful command-line interface where you can execute system commands and perform advanced security operations.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#whoami-command',
                title: 'User Identity Command',
                content: 'The "whoami" command shows your current user identity. This is useful for verifying who you are logged in as during security investigations.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#whoami-result',
                title: 'Current User',
                content: 'You are currently logged in as "trainee" - a limited-privilege user account designed for safe cybersecurity training.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#ls-command',
                title: 'File Listing Command',
                content: 'The "ls -la" command lists all files and directories with detailed permissions. The "-la" flags show hidden files and detailed information.',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#documents-dir',
                title: 'Normal Directory',
                content: 'This shows a normal directory with standard permissions (drwxr-xr-x). The "d" indicates it\'s a directory, followed by read/write/execute permissions.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#suspicious-file-entry',
                title: '⚠️ Suspicious File Found',
                content: 'ALERT! This file appears suspicious - notice the red highlighting and unusual file size (1337 bytes). Always investigate unexpected files!',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#command-input',
                title: 'Command Input',
                content: 'Type commands here to interact with the system. Try commands like "cat suspicious_file.txt" to examine suspicious files safely.',
                action: 'pulse',
                position: 'top'
            },
            {
                target: '#terminal-output',
                title: 'Terminal Security Complete',
                content: 'You\'ve learned terminal basics! Use commands like ls, cat, grep, and ps to investigate security incidents and monitor system activity.',
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
        
        // Wait for terminal to be fully loaded
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
        }, 1000);
    }

    // Override base class methods
    getSkipTutorialHandler() {
        return 'window.terminalTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.terminalTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.terminalTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.terminalTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_terminal_tutorial_completed', 'true');
    }

    async showSkipModal() {
        if (!this.skipTutorialModal) {
            this.skipTutorialModal = new SkipTutorialModal(document.body);
        }
        
        const shouldSkip = await this.skipTutorialModal.show();
        if (shouldSkip) {
            this.complete();
        }
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_terminal_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_terminal_tutorial_completed');
    }
}