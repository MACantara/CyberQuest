import { BaseTutorial } from './base-tutorial.js';

export class TerminalTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '#terminal-container',
                title: 'Command Line Terminal',
                content: 'Welcome to the terminal! This is a powerful command-line interface where you can execute system commands and perform advanced security operations.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#terminal-output',
                title: 'Terminal Output Area',
                content: 'This area displays the results of your commands and system messages. Notice the welcome message and help instructions already shown.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#input-prompt',
                title: 'Command Prompt',
                content: 'The prompt shows your current user (trainee) and system (cyberquest). This indicates you\'re logged in as a limited-privilege training account.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#command-input',
                title: 'Command Input Field',
                content: 'Type commands here to interact with the system. Try typing "help" to see available commands, or "ls" to list files and directories.',
                action: 'pulse',
                position: 'top'
            },
            {
                target: '#terminal-input-area',
                title: 'Interactive Command Line',
                content: 'This is where you enter commands. Use arrow keys to navigate command history, Tab for auto-completion, and Enter to execute commands.',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '#terminal-output',
                title: 'Security Command Practice',
                content: 'Try security-related commands like "whoami" to check your identity, "ls -la" to see file permissions, or "ps" to view running processes.',
                action: 'highlight',
                position: 'left'
            },
            {
                target: '#terminal-container',
                title: 'Terminal Security Training Complete!',
                content: 'Excellent! You\'ve learned terminal basics. Use commands like ls, cat, grep, ps, and whoami to investigate security incidents and monitor system activity. The terminal is essential for cybersecurity work.',
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

    // Override to add terminal-specific tutorial behaviors
    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        
        // Special handling for command input step - ensure input is focused
        if (step.target === '#command-input') {
            const input = document.querySelector('#command-input');
            if (input) {
                // Give the input focus after a brief delay
                setTimeout(() => {
                    input.focus();
                }, 300);
            }
        }

        // Special handling for terminal output - ensure it has some content
        if (step.target === '#terminal-output') {
            const output = document.querySelector('#terminal-output');
            if (output && output.children.length < 3) {
                // If terminal output is empty, add some example content
                const terminalApp = window.currentSimulation?.desktop?.windowManager?.applications?.get('terminal');
                if (terminalApp) {
                    terminalApp.addOutput('Type "help" to see available commands', 'text-gray-400');
                    terminalApp.addOutput('Use "ls" to list files, "whoami" to check user identity', 'text-gray-400');
                }
            }
        }

        super.showStep();
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

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_terminal_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_terminal_tutorial_completed');
    }
}