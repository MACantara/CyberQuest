import { WindowBase } from '../window-base.js';
import { CommandProcessor } from './terminal-functions/command-processor.js';

export class TerminalApp extends WindowBase {
    constructor() {
        super('terminal', 'Terminal', {
            width: '70%',
            height: '60%'
        });
        
        this.commandProcessor = null;
    }

    createContent() {
        return `
            <div class="h-full bg-black text-green-400 font-mono text-sm p-3 flex flex-col" id="terminal-container">
                <div class="flex-1 overflow-y-auto mb-3 space-y-1" id="terminal-output">
                    <div class="text-green-400">Welcome to CyberQuest Training Terminal</div>
                    <div class="text-gray-400">Type 'help' for available commands</div>
                    <div></div>
                </div>
                <div class="flex items-center" id="terminal-input-area">
                    <span class="text-green-400 mr-2" id="input-prompt">trainee@cyberquest:~$ </span>
                    <input type="text" 
                           class="flex-1 bg-transparent border-none text-green-400 outline-none font-mono text-sm" 
                           placeholder="Type your command..." 
                           id="command-input"
                           autocomplete="off"
                           spellcheck="false">
                </div>
            </div>
        `;
    }

    initialize() {
        super.initialize();
        
        this.commandProcessor = new CommandProcessor(this);
        this.bindEvents();
        this.focusInput();
        
        // Show initial prompt
        this.updatePrompt();
    }

    bindEvents() {
        const input = this.windowElement?.querySelector('#command-input');
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    this.executeCommand(input.value);
                    input.value = '';
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    const prevCommand = this.commandProcessor.history.getPrevious();
                    if (prevCommand !== null) {
                        input.value = prevCommand;
                    }
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    const nextCommand = this.commandProcessor.history.getNext();
                    if (nextCommand !== null) {
                        input.value = nextCommand;
                    }
                    break;
                    
                case 'Tab':
                    e.preventDefault();
                    // TODO: Implement tab completion
                    break;
            }
        });

        // Keep focus on input when clicking in terminal
        this.windowElement?.addEventListener('click', () => {
            this.focusInput();
        });
    }

    executeCommand(command) {
        if (!command.trim()) {
            this.addPromptLine();
            return;
        }

        this.commandProcessor.executeCommand(command);
        this.commandProcessor.history.reset();
        this.addPromptLine();
        this.scrollToBottom();
    }

    addOutput(text, className = '') {
        const output = this.windowElement?.querySelector('#terminal-output');
        if (!output) return;

        const line = document.createElement('div');
        line.textContent = text;
        
        if (className) {
            switch (className) {
                case 'error':
                    line.className = 'text-red-400';
                    break;
                case 'command':
                    line.className = 'text-white';
                    break;
                case 'directory':
                    line.className = 'text-blue-400';
                    break;
                case 'suspicious-file':
                    line.className = 'text-red-400';
                    break;
                case 'file':
                    line.className = 'text-green-400';
                    break;
                default:
                    line.className = className;
            }
        }
        
        output.appendChild(line);
    }

    addPromptLine() {
        this.addOutput(''); // Empty line for spacing
        this.updatePrompt();
    }

    updatePrompt() {
        const promptElement = this.windowElement?.querySelector('#input-prompt');
        if (promptElement && this.commandProcessor) {
            promptElement.textContent = this.commandProcessor.getPrompt();
        }
    }

    clearOutput() {
        const output = this.windowElement?.querySelector('#terminal-output');
        if (output) {
            output.innerHTML = '';
            this.addOutput('Terminal cleared', 'text-gray-400');
        }
    }

    focusInput() {
        const input = this.windowElement?.querySelector('#command-input');
        if (input) {
            input.focus();
        }
    }

    scrollToBottom() {
        const output = this.windowElement?.querySelector('#terminal-output');
        if (output) {
            output.scrollTop = output.scrollHeight;
        }
    }
}
