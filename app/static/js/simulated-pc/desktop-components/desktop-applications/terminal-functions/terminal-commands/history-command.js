import { BaseCommand } from './base-command.js';

export class HistoryCommand extends BaseCommand {
    execute(args) {
        const commands = this.processor.history.getHistory();
        commands.forEach((cmd, index) => {
            this.addOutput(`${(index + 1).toString().padStart(4)} ${cmd}`);
        });
    }
}
