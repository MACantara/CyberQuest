import { BaseCommand } from './base-command.js';

export class DateCommand extends BaseCommand {
    execute(args) {
        const now = new Date();
        this.addOutput(now.toString());
    }
}
