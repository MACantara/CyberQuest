export class BootSequence {
    constructor(container) {
        this.container = container;
        this.bootLines = [
            { text: 'CyberQuest Security Training Environment v2.1.0', type: 'info', delay: 100 },
            { text: 'Copyright (c) 2025 CyberQuest Training Systems', type: 'info', delay: 200 },
            { text: '', type: 'info', delay: 50 },
            { text: 'Initializing secure training environment...', type: 'info', delay: 300 },
            { text: 'Loading kernel modules...', type: 'info', delay: 400 },
            { text: '[  OK  ] Started Network Manager', type: 'success', delay: 200 },
            { text: '[  OK  ] Started Security Monitor Service', type: 'success', delay: 150 },
            { text: '[  OK  ] Started Firewall Protection', type: 'success', delay: 100 },
            { text: '[  OK  ] Started Intrusion Detection System', type: 'success', delay: 120 },
            { text: '[ WARN ] Unknown device detected on network', type: 'warning', delay: 200 },
            { text: '[  OK  ] Security scan completed', type: 'success', delay: 150 },
            { text: '', type: 'info', delay: 100 },
            { text: 'Starting training simulation...', type: 'info', delay: 300 },
            { text: 'Loading scenario data...', type: 'info', delay: 250 },
            { text: 'Preparing virtual environment...', type: 'info', delay: 200 },
            { text: '[  OK  ] Training environment ready', type: 'success', delay: 150 },
            { text: '', type: 'info', delay: 200 },
            { text: 'Welcome to the CyberQuest Training Lab', type: 'success', delay: 300 },
            { text: 'Type "help" for available commands', type: 'info', delay: 100 },
            { text: '', type: 'info', delay: 500 }
        ];
        this.currentLine = 0;
    }

    async start() {
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            this.typeNextLine(resolve);
        });
    }

    typeNextLine(onComplete) {
        if (this.currentLine >= this.bootLines.length) {
            // Add blinking cursor
            const cursor = document.createElement('span');
            cursor.className = 'boot-cursor';
            this.container.appendChild(cursor);
            
            setTimeout(() => {
                onComplete();
            }, 1000);
            return;
        }

        const line = this.bootLines[this.currentLine];
        const lineElement = document.createElement('div');
        lineElement.className = `boot-line ${line.type}`;
        lineElement.textContent = line.text;
        
        this.container.appendChild(lineElement);
        
        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;
        
        this.currentLine++;
        
        setTimeout(() => {
            this.typeNextLine(onComplete);
        }, line.delay);
    }
}
