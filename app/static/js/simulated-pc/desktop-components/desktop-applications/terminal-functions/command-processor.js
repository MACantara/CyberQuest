import { FileSystem } from './file-system.js';
import { CommandHistory } from './command-history.js';

export class CommandProcessor {
    constructor(terminalApp) {
        this.terminalApp = terminalApp;
        this.fileSystem = new FileSystem();
        this.history = new CommandHistory();
        this.currentDirectory = '/home/trainee';
        this.username = 'trainee';
        this.hostname = 'cyberquest';
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
            switch (command) {
                case 'ls':
                    this.handleLs(args);
                    break;
                case 'pwd':
                    this.handlePwd();
                    break;
                case 'cd':
                    this.handleCd(args);
                    break;
                case 'cat':
                    this.handleCat(args);
                    break;
                case 'whoami':
                    this.handleWhoami();
                    break;
                case 'clear':
                    this.handleClear();
                    break;
                case 'help':
                    this.handleHelp();
                    break;
                case 'history':
                    this.handleHistory();
                    break;
                case 'echo':
                    this.handleEcho(args);
                    break;
                case 'date':
                    this.handleDate();
                    break;
                case 'uname':
                    this.handleUname(args);
                    break;
                default:
                    this.addOutput(`bash: ${command}: command not found`, 'error');
            }
        } catch (error) {
            this.addOutput(`Error: ${error.message}`, 'error');
        }
    }

    handleLs(args) {
        const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
        
        const items = this.fileSystem.listDirectory(this.currentDirectory, showAll);
        
        if (longFormat) {
            items.forEach(item => {
                const date = new Date().toISOString().split('T')[0].replace(/-/g, ' ');
                const time = new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
                const permissions = item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
                const size = item.size || 4096;
                const className = item.suspicious ? 'suspicious-file' : (item.type === 'directory' ? 'directory' : 'file');
                
                this.addOutput(`${permissions} 2 ${this.username} ${this.username} ${size.toString().padStart(8)} ${date} ${time} ${item.name}`, className);
            });
        } else {
            const names = items.map(item => item.name).join('  ');
            this.addOutput(names);
        }
    }

    handlePwd() {
        this.addOutput(this.currentDirectory);
    }

    handleCd(args) {
        if (args.length === 0) {
            this.currentDirectory = '/home/trainee';
            return;
        }

        const target = args[0];
        const newPath = this.fileSystem.resolvePath(this.currentDirectory, target);
        
        if (this.fileSystem.directoryExists(newPath)) {
            this.currentDirectory = newPath;
        } else {
            this.addOutput(`bash: cd: ${target}: No such file or directory`, 'error');
        }
    }

    handleCat(args) {
        if (args.length === 0) {
            this.addOutput('cat: missing file operand', 'error');
            return;
        }

        const filename = args[0];
        const content = this.fileSystem.readFile(this.currentDirectory, filename);
        
        if (content !== null) {
            this.addOutput(content);
        } else {
            this.addOutput(`cat: ${filename}: No such file or directory`, 'error');
        }
    }

    handleWhoami() {
        this.addOutput(this.username);
    }

    handleClear() {
        this.terminalApp.clearOutput();
    }

    handleHelp() {
        const commands = [
            'Available commands:',
            '  ls [-la]     - List directory contents',
            '  pwd          - Print working directory',
            '  cd [dir]     - Change directory',
            '  cat <file>   - Display file contents',
            '  whoami       - Display current user',
            '  clear        - Clear terminal screen',
            '  history      - Show command history',
            '  echo <text>  - Display text',
            '  date         - Show current date and time',
            '  uname [-a]   - Show system information',
            '  help         - Show this help message'
        ];
        
        commands.forEach(cmd => this.addOutput(cmd));
    }

    handleHistory() {
        const commands = this.history.getHistory();
        commands.forEach((cmd, index) => {
            this.addOutput(`${(index + 1).toString().padStart(4)} ${cmd}`);
        });
    }

    handleEcho(args) {
        this.addOutput(args.join(' '));
    }

    handleDate() {
        const now = new Date();
        this.addOutput(now.toString());
    }

    handleUname(args) {
        if (args.includes('-a')) {
            this.addOutput('Linux cyberquest 5.4.0-training #1 SMP x86_64 GNU/Linux');
        } else {
            this.addOutput('Linux');
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
