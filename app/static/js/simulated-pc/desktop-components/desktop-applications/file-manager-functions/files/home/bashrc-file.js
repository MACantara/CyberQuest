import { BaseFile } from '../base-file.js';

export class BashrcFile extends BaseFile {
    constructor() {
        super({
            name: '.bashrc',
            directoryPath: '/home/trainee',
            size: '128 B',
            modified: '2024-12-19 14:22',
            suspicious: false,
            hidden: true
        });
    }

    getContent() {
        return '# ~/.bashrc: executed by bash(1) for non-login shells.\nexport PATH=/usr/local/bin:/usr/bin:/bin\nPS1="\\u@\\h:\\w\\$ "\n\n# Training environment settings\nexport TRAINING_MODE=1\n\n# CyberQuest simulation aliases\nalias ls="ls --color=auto"\nalias ll="ls -la"\nalias grep="grep --color=auto"';
    }
}
