import { BaseCommand } from './base-command.js';

export class CdCommand extends BaseCommand {
    execute(args) {
        if (args.length === 0) {
            this.setCurrentDirectory('/home/trainee');
            return;
        }

        const target = args[0];
        const newPath = this.fileSystem.resolvePath(this.getCurrentDirectory(), target);
        
        if (this.fileSystem.directoryExists(newPath)) {
            this.setCurrentDirectory(newPath);
        } else {
            this.addOutput(`bash: cd: ${target}: No such file or directory`, 'error');
        }
    }
}
