import { FileSystem } from './file-system.js';
import { CommandHistory } from './command-history.js';
import { CommandRegistry } from './command-registry.js';

export class CommandProcessor {
    constructor(terminalApp) {
        this.terminalApp = terminalApp;
        this.fileSystem = new FileSystem();
        this.history = new CommandHistory();
        this.currentDirectory = '/home/trainee';
        this.username = 'trainee';
        this.hostname = 'cyberquest';
        
        // Initialize command registry
        this.commandRegistry = new CommandRegistry(this);
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
            const commandInstance = this.commandRegistry.getCommand(command);
            if (commandInstance) {
                commandInstance.execute(args);
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

    getTabCompletion(inputText, cursorPosition) {
        const beforeCursor = inputText.substring(0, cursorPosition);
        const afterCursor = inputText.substring(cursorPosition);
        const parts = beforeCursor.split(/\s+/);
        const currentPart = parts[parts.length - 1] || '';
        
        // If we're completing the first word (command name)
        if (parts.length === 1 || (parts.length === 2 && beforeCursor.endsWith(' ') === false)) {
            return this.completeCommand(currentPart, beforeCursor, afterCursor);
        }
        
        // If we're completing arguments (file/directory names)
        const command = parts[0].toLowerCase();
        if (command === 'cd' || command === 'ls' || command === 'cat') {
            return this.completeFilePath(currentPart, beforeCursor, afterCursor);
        }
        
        return null;
    }

    completeCommand(partial, beforeCursor, afterCursor) {
        const commands = this.commandRegistry.getAllCommands();
        const matches = commands.filter(cmd => cmd.startsWith(partial.toLowerCase()));
        
        if (matches.length === 0) {
            return null;
        }
        
        if (matches.length === 1) {
            // Single match - complete it
            const completion = matches[0];
            const beforeCompletion = beforeCursor.substring(0, beforeCursor.length - partial.length);
            return {
                newText: beforeCompletion + completion + ' ' + afterCursor,
                newCursorPosition: beforeCompletion.length + completion.length + 1
            };
        }
        
        // Multiple matches - show them and complete common prefix
        const commonPrefix = this.findCommonPrefix(matches);
        if (commonPrefix.length > partial.length) {
            const beforeCompletion = beforeCursor.substring(0, beforeCursor.length - partial.length);
            return {
                newText: beforeCompletion + commonPrefix + afterCursor,
                newCursorPosition: beforeCompletion.length + commonPrefix.length,
                suggestions: matches
            };
        }
        
        return {
            newText: beforeCursor + afterCursor,
            newCursorPosition: beforeCursor.length,
            suggestions: matches
        };
    }

    completeFilePath(partial, beforeCursor, afterCursor) {
        try {
            // Handle different path formats
            let basePath = this.currentDirectory;
            let searchPattern = partial;
            
            if (partial.includes('/')) {
                const lastSlash = partial.lastIndexOf('/');
                const dirPart = partial.substring(0, lastSlash + 1);
                searchPattern = partial.substring(lastSlash + 1);
                
                if (partial.startsWith('/')) {
                    basePath = dirPart;
                } else if (partial.startsWith('~/')) {
                    basePath = '/home/trainee' + dirPart.substring(1);
                } else {
                    basePath = this.fileSystem.resolvePath(this.currentDirectory, dirPart);
                }
            }
            
            // Get directory contents
            const items = this.fileSystem.listDirectory(basePath, false);
            const matches = items
                .filter(item => item.name.startsWith(searchPattern))
                .map(item => {
                    const fullName = item.type === 'directory' ? item.name + '/' : item.name;
                    return {
                        name: fullName,
                        type: item.type
                    };
                });
            
            if (matches.length === 0) {
                return null;
            }
            
            if (matches.length === 1) {
                // Single match - complete it
                const match = matches[0];
                const beforeCompletion = beforeCursor.substring(0, beforeCursor.length - searchPattern.length);
                return {
                    newText: beforeCompletion + match.name + afterCursor,
                    newCursorPosition: beforeCompletion.length + match.name.length
                };
            }
            
            // Multiple matches
            const matchNames = matches.map(m => m.name);
            const commonPrefix = this.findCommonPrefix(matchNames);
            
            if (commonPrefix.length > searchPattern.length) {
                const beforeCompletion = beforeCursor.substring(0, beforeCursor.length - searchPattern.length);
                return {
                    newText: beforeCompletion + commonPrefix + afterCursor,
                    newCursorPosition: beforeCompletion.length + commonPrefix.length,
                    suggestions: matchNames
                };
            }
            
            return {
                newText: beforeCursor + afterCursor,
                newCursorPosition: beforeCursor.length,
                suggestions: matchNames
            };
            
        } catch (error) {
            return null;
        }
    }

    findCommonPrefix(strings) {
        if (strings.length === 0) return '';
        if (strings.length === 1) return strings[0];
        
        let prefix = '';
        for (let i = 0; i < strings[0].length; i++) {
            const char = strings[0][i];
            if (strings.every(str => str[i] === char)) {
                prefix += char;
            } else {
                break;
            }
        }
        return prefix;
    }
}