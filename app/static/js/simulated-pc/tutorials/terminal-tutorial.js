import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

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
                title: 'Interactive: Type a Command',
                content: 'Type "help" in the command input field to see available commands. This will show you what security tools are available.',
                action: 'pulse',
                position: 'top',
                interactive: true,
                interaction: {
                    type: 'input',
                    expectedValue: 'help',
                    triggerOnEnter: true,
                    instructions: 'Type "help" and press Enter',
                    successMessage: 'Great! You executed the help command.',
                    autoAdvance: true,
                    advanceDelay: 2000
                }
            },
            {
                target: '#command-input',
                title: 'Interactive: List Files',
                content: 'Now try typing "ls" to list files and directories in the current location. This is essential for file system navigation.',
                action: 'pulse',
                position: 'top',
                interactive: true,
                interaction: {
                    type: 'input',
                    expectedValue: 'ls',
                    triggerOnEnter: true,
                    instructions: 'Type "ls" and press Enter',
                    successMessage: 'Excellent! You listed the directory contents.',
                    autoAdvance: true,
                    advanceDelay: 2000
                }
            },
            {
                target: '#command-input',
                title: 'Interactive: Check User Identity',
                content: 'Type "whoami" to check your current user identity. This is important for understanding your privileges and access level.',
                action: 'pulse',
                position: 'top',
                interactive: true,
                interaction: {
                    type: 'input',
                    expectedValue: 'whoami',
                    triggerOnEnter: true,
                    instructions: 'Type "whoami" and press Enter',
                    successMessage: 'Perfect! You checked your user identity.',
                    autoAdvance: true,
                    advanceDelay: 2000
                }
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
                content: 'Try security-related commands like "ps" to view running processes, or explore files with "cat filename" to read file contents.',
                action: 'highlight',
                position: 'left'
            },
            {
                target: '#terminal-container',
                title: 'Terminal Security Training Complete!',
                content: 'Excellent! You\'ve learned terminal basics and executed security commands: help for available tools, ls for file listing, whoami for user identity, and other essential commands. Use these skills to investigate security incidents and monitor system activity!',
                action: 'highlight',
                position: 'left',
                final: true
            }
        ];
    }

    async start() {
        // Ensure terminal is open
        if (!this.desktop.windowManager.windows.has('terminal')) {
            try {
                await this.desktop.windowManager.openTerminal();
                // Wait for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Terminal application not found:', error);
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
        
        // Ensure terminal window is in front
        this.ensureTerminalInFront();
        
        // Set global reference
        window.terminalTutorial = this;
        window.currentTutorial = this;
        
        // Wait for terminal to be fully loaded and then start showing steps
        setTimeout(() => {
            this.stepManager.showStep();
        }, 1000);
    }

    ensureTerminalInFront() {
        const terminalWindow = document.querySelector('.window[data-window-id="terminal"]') || 
                              document.querySelector('.window .terminal') ||
                              document.querySelector('[id*="terminal"]')?.closest('.window');
        
        if (terminalWindow) {
            terminalWindow.style.zIndex = '51';
            terminalWindow.style.position = 'relative';
        }
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        let target = document.querySelector(step.target);
        
        // Special handling for command input step - ensure input is focused
        if (step.target === '#command-input') {
            const input = document.querySelector('#command-input');
            if (input) {
                // Give the input focus after a brief delay
                setTimeout(() => {
                    input.focus();
                }, 300);
            }
            target = input;
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
            target = output;
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
        localStorage.setItem('cyberquest_terminal_tutorial_completed', 'true');
    }

    // Override base class methods for proper tutorial flow
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

    // Static methods for auto-start functionality
    static shouldAutoStart() {
        const tutorialCompleted = localStorage.getItem('cyberquest_terminal_tutorial_completed');
        const terminalOpened = localStorage.getItem('cyberquest_terminal_opened');
        
        return terminalOpened && !tutorialCompleted;
    }

    static startTutorial(desktop) {
        console.log('Starting Terminal tutorial...');
        const tutorial = new TerminalTutorial(desktop);
        window.terminalTutorial = tutorial;
        tutorial.start();
        return tutorial;
    }

    static restart() {
        localStorage.removeItem('cyberquest_terminal_tutorial_completed');
        localStorage.removeItem('cyberquest_terminal_opened');
    }
}