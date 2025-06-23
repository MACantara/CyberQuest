import { BaseCommand } from './base-command.js';

export class HelpCommand extends BaseCommand {
    execute(args) {
        const commands = [
            'Available commands:',
            '  ls [-la]     - List directory contents',
            '  pwd          - Print working directory',
            '  cd [dir]     - Change directory',
            '  cat <file>   - Display file contents',
            '  whoami       - Display current user',
            '  clear        - Clear terminal screen',
            '  history      - Show command history',
            '  echo <text>  - Display text',
            '  date         - Show current date and time',
            '  uname [-a]   - Show system information',
            '  help         - Show this help message'
        ];
        
        commands.forEach(cmd => this.addOutput(cmd));
    }
}
