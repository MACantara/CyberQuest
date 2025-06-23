import { FileSystem } from './file-system.js';
import { CommandHistory } from './command-history.js';

// Import commands
import { LsCommand } from './terminal-commands/ls-command.js';
import { CdCommand } from './terminal-commands/cd-command.js';
import { CatCommand } from './terminal-commands/cat-command.js';
import { PwdCommand } from './terminal-commands/pwd-command.js';
import { WhoamiCommand } from './terminal-commands/whoami-command.js';
import { ClearCommand } from './terminal-commands/clear-command.js';
import { HelpCommand } from './terminal-commands/help-command.js';
import { HistoryCommand } from './terminal-commands/history-command.js';
import { EchoCommand } from './terminal-commands/echo-command.js';
import { DateCommand } from './terminal-commands/date-command.js';
import { UnameCommand } from './terminal-commands/uname-command.js';

export class CommandProcessor {
    constructor(terminalApp) {
        this.terminalApp = terminalApp;
        this.fileSystem = new FileSystem();
        this.history = new CommandHistory();
        this.currentDirectory = '/home/trainee';
        this.username = 'trainee';
        this.hostname = 'cyberquest';
        
        // Initialize commands
        this.commands = {
            'ls': new LsCommand(this),
            'cd': new CdCommand(this),
            'cat': new CatCommand(this),
            'pwd': new PwdCommand(this),
            'whoami': new WhoamiCommand(this),
            'clear': new ClearCommand(this),
            'help': new HelpCommand(this),
            'history': new HistoryCommand(this),
            'echo': new EchoCommand(this),
            'date': new DateCommand(this),
            'uname': new UnameCommand(this)
        };
    }

    executeCommand(commandLine) {
        if (!commandLine.trim()) return;

        this.history.addCommand(commandLine);
        const parts = commandLine.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Add command to output
        this.addOutput(`${this.getPrompt()}${commandLine}`, 'command');

        try {
            if (this.commands[command]) {
                this.commands[command].execute(args);
            } else {
                this.addOutput(`bash: ${command}: command not found`, 'error');
            }
        } catch (error) {
            this.addOutput(`Error: ${error.message}`, 'error');
        }
    }

    addOutput(text, className = '') {
        this.terminalApp.addOutput(text, className);
    }

    getPrompt() {
        const shortPath = this.currentDirectory.replace('/home/trainee', '~');
        return `${this.username}@${this.hostname}:${shortPath}$ `;
    }

    getCurrentDirectory() {
        return this.currentDirectory;
    }
}
