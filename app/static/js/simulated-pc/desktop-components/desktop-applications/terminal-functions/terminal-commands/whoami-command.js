import { BaseCommand } from './base-command.js';

export class WhoamiCommand extends BaseCommand {
    execute(args) {
        this.addOutput(this.getUsername());
    }
}
