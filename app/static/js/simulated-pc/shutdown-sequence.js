export class ShutdownSequence {
    constructor(container) {
        this.container = container;
        this.shutdownLines = [
            { text: 'Initiating system shutdown...', type: 'info', delay: 200 },
            { text: 'Saving training progress...', type: 'info', delay: 400 },
            { text: '[  OK  ] Training data saved successfully', type: 'success', delay: 300 },
            { text: 'Stopping simulation services...', type: 'info', delay: 350 },
            { text: '[  OK  ] Stopped Network Monitor', type: 'success', delay: 200 },
            { text: '[  OK  ] Stopped Security Tools', type: 'success', delay: 150 },
            { text: '[  OK  ] Stopped Terminal Session', type: 'success', delay: 180 },
            { text: '[  OK  ] Stopped File Manager', type: 'success', delay: 160 },
            { text: '[  OK  ] Stopped Email Client', type: 'success', delay: 140 },
            { text: '[  OK  ] Stopped Web Browser', type: 'success', delay: 170 },
            { text: 'Closing active connections...', type: 'info', delay: 300 },
            { text: '[  OK  ] All connections closed', type: 'success', delay: 250 },
            { text: 'Cleaning up temporary files...', type: 'info', delay: 400 },
            { text: '[  OK  ] Cleanup completed', type: 'success', delay: 200 },
            { text: 'Securing training environment...', type: 'info', delay: 350 },
            { text: '[  OK  ] Environment secured', type: 'success', delay: 300 },
            { text: '', type: 'info', delay: 200 },
            { text: 'Thank you for using CyberQuest Training Lab', type: 'success', delay: 400 },
            { text: 'Your progress has been saved', type: 'info', delay: 250 },
            { text: 'Redirecting to main portal...', type: 'info', delay: 500 },
            { text: '', type: 'info', delay: 300 }
        ];
        this.currentLine = 0;
        this.setupContainer();
    }

    setupContainer() {
        // Set up container similar to boot sequence but with shutdown styling
        this.container.className = 'fixed inset-0 bg-black text-cyan-400 font-mono text-sm leading-relaxed p-10 overflow-y-auto flex flex-col justify-start items-start';
    }

    async start() {
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            this.typeNextLine(resolve);
        });
    }

    typeNextLine(onComplete) {
        if (this.currentLine >= this.shutdownLines.length) {
            // Add final shutdown message
            const finalMessage = document.createElement('div');
            finalMessage.className = 'text-center w-full mt-8 opacity-0 animate-fade-in';
            finalMessage.innerHTML = `
                <div class="text-2xl text-cyan-400 mb-4">🛡️</div>
                <div class="text-lg text-cyan-300 mb-2">System Shutdown Complete</div>
                <div class="text-sm text-gray-400">Returning to CyberQuest Portal</div>
            `;
            this.container.appendChild(finalMessage);
            
            // Trigger fade-in
            setTimeout(() => {
                finalMessage.classList.remove('opacity-0');
            }, 100);
            
            setTimeout(() => {
                onComplete();
            }, 2000);
            return;
        }

        const line = this.shutdownLines[this.currentLine];
        const lineElement = document.createElement('div');
        
        // Apply Tailwind classes based on line type
        let typeClasses = '';
        switch(line.type) {
            case 'success':
                typeClasses = 'text-cyan-400';
                break;
            case 'warning':
                typeClasses = 'text-yellow-400';
                break;
            case 'error':
                typeClasses = 'text-red-400';
                break;
            default:
                typeClasses = 'text-cyan-400';
        }
        
        lineElement.className = `shutdown-line opacity-0 mb-0.5 whitespace-pre-wrap ${typeClasses} transition-opacity duration-200`;
        lineElement.textContent = line.text;
        
        this.container.appendChild(lineElement);
        
        // Trigger animation
        setTimeout(() => {
            lineElement.classList.remove('opacity-0');
        }, 10);
        
        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;
        
        this.currentLine++;
        
        setTimeout(() => {
            this.typeNextLine(onComplete);
        }, line.delay);
    }

    // Static method to create and run shutdown sequence
    static async runShutdown(container) {
        const shutdown = new ShutdownSequence(container);
        await shutdown.start();
    }
}
