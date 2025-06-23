import { BaseCommand } from './base-command.js';

export class LsCommand extends BaseCommand {
    execute(args) {
        const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
        
        const items = this.fileSystem.listDirectory(this.getCurrentDirectory(), showAll);
        
        if (longFormat) {
            items.forEach(item => {
                const date = new Date().toISOString().split('T')[0].replace(/-/g, ' ');
                const time = new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
                const permissions = item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
                const size = item.size || 4096;
                const className = item.suspicious ? 'suspicious-file' : (item.type === 'directory' ? 'directory' : 'file');
                
                this.addOutput(`${permissions} 2 ${this.getUsername()} ${this.getUsername()} ${size.toString().padStart(8)} ${date} ${time} ${item.name}`, className);
            });
        } else {
            const names = items.map(item => item.name).join('  ');
            this.addOutput(names);
        }
    }
}
