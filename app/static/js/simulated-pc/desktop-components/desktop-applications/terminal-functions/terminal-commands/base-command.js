export class BaseCommand {
    constructor(processor) {
        this.processor = processor;
        this.fileSystem = processor.fileSystem;
        this.terminalApp = processor.terminalApp;
    }

    execute(args) {
        throw new Error('Command must implement execute method');
    }

    addOutput(text, className = '') {
        this.processor.addOutput(text, className);
    }

    getCurrentDirectory() {
        return this.processor.currentDirectory;
    }

    setCurrentDirectory(path) {
        this.processor.currentDirectory = path;
    }

    getUsername() {
        return this.processor.username;
    }

    getHostname() {
        return this.processor.hostname;
    }
}
