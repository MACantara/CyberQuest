import { BaseCommand } from './base-command.js';

export class PwdCommand extends BaseCommand {
    execute(args) {
        this.addOutput(this.getCurrentDirectory());
    }
}
