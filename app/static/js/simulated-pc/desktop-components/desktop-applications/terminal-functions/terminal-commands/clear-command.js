import { BaseCommand } from './base-command.js';

export class ClearCommand extends BaseCommand {
    execute(args) {
        this.terminalApp.clearOutput();
    }
}
