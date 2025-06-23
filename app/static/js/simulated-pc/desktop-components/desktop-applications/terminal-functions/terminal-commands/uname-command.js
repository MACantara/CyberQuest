import { BaseCommand } from './base-command.js';

export class UnameCommand extends BaseCommand {
    execute(args) {
        if (args.includes('-a')) {
            this.addOutput('Linux cyberquest 5.4.0-training #1 SMP x86_64 GNU/Linux');
        } else {
            this.addOutput('Linux');
        }
    }
}
