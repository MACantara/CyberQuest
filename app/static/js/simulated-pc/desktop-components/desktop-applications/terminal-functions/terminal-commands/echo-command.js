import { BaseCommand } from './base-command.js';

export class EchoCommand extends BaseCommand {
    execute(args) {
        this.addOutput(args.join(' '));
    }
}
