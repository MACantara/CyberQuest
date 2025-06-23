import { BaseCommand } from './base-command.js';

export class CatCommand extends BaseCommand {
    execute(args) {
        if (args.length === 0) {
            this.addOutput('cat: missing file operand', 'error');
            return;
        }

        const filename = args[0];
        const content = this.fileSystem.readFile(this.getCurrentDirectory(), filename);
        
        if (content !== null) {
            this.addOutput(content);
        } else {
            this.addOutput(`cat: ${filename}: No such file or directory`, 'error');
        }
    }
}
