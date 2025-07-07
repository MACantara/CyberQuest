export class BootSequence {
    constructor(container) {
        this.container = container;
        this.bootLines = [
            { text: 'CyberQuest Security Training Environment v2.1.0', type: 'info', delay: 100 },
            { text: 'Copyright (c) 2025 CyberQuest Training Systems', type: 'info', delay: 100 },
            { text: '', type: 'info', delay: 50 },
            { text: 'Initializing secure training environment', type: 'info', delay: 150, hasStatus: true, status: '[  OK  ]' },
            { text: 'Loading kernel modules and core services', type: 'info', delay: 200, hasStatus: true, status: '[  OK  ]' },
            { text: '', type: 'info', delay: 50 },
            { text: 'Starting security services', type: 'success', delay: 100, hasStatus: true, status: '[  OK  ]', bundle: 'security' },
            { text: 'Loading Network Manager', type: 'success', delay: 50, hasStatus: false, bundle: 'security' },
            { text: 'Loading Firewall Protection', type: 'success', delay: 50, hasStatus: false, bundle: 'security' },
            { text: 'Loading Intrusion Detection System', type: 'success', delay: 50, hasStatus: false, bundle: 'security' },
            { text: 'Loading Security Monitor Service', type: 'success', delay: 50, hasStatus: false, bundle: 'security' },
            { text: 'Scanning for network devices', type: 'warning', delay: 150, hasStatus: true, status: '[ WARN ]' },
            { text: 'Running security scan', type: 'success', delay: 100, hasStatus: true, status: '[  OK  ]' },
            { text: '', type: 'info', delay: 50 },
            { text: 'Preparing training environment', type: 'info', delay: 100, hasStatus: true, status: '[  OK  ]', bundle: 'training' },
            { text: 'Loading scenario data', type: 'info', delay: 50, hasStatus: false, bundle: 'training' },
            { text: 'Preparing virtual environment', type: 'info', delay: 50, hasStatus: false, bundle: 'training' },
            { text: 'Finalizing training setup', type: 'success', delay: 100, hasStatus: false, bundle: 'training' },
            { text: '', type: 'info', delay: 100 },
            { text: 'Welcome to the CyberQuest Training Lab', type: 'success', delay: 150 },
            { text: 'Type "help" for available commands', type: 'info', delay: 100 },
            { text: '', type: 'info', delay: 200 }
        ];
        this.currentLine = 0;
        this.audioEnabled = false;
        this.autoStartAudio = this.checkAutoStartAudio();
        this.setupContainer();
        this.setupAudio();
    }

    checkAutoStartAudio() {
        // Check if coming from level detail page
        const referrer = document.referrer;
        const urlParams = new URLSearchParams(window.location.search);
        
        return referrer.includes('/levels/') || 
               urlParams.get('autostart') === 'true' ||
               sessionStorage.getItem('cyberquest_auto_audio') === 'true';
    }

    setupContainer() {
        // Set up container with Tailwind classes
        this.container.className = 'fixed inset-0 bg-black text-green-400 font-mono text-sm leading-relaxed p-10 overflow-y-auto flex flex-col justify-start items-start';
    }

    setupAudio() {
        try {
            this.textSoundEffect = new Audio('../../../static/audio/Text_Sound_Effect.mp3');
            this.textSoundEffect.volume = 0.2; // Reduced volume since it will play more frequently
            this.textSoundEffect.preload = 'auto';
        } catch (error) {
            console.warn('Could not load text sound effect:', error);
            this.textSoundEffect = null;
        }
    }

    displayNextLine(onComplete) {
        if (this.currentLine >= this.bootLines.length) {
            // Add blinking cursor
            const cursor = document.createElement('span');
            cursor.className = 'inline-block w-2 h-3.5 bg-green-400 boot-cursor';
            this.container.appendChild(cursor);
            
            setTimeout(() => {
                onComplete();
            }, 500);
            return;
        }

        const line = this.bootLines[this.currentLine];
        const lineElement = document.createElement('div');
        
        // Apply Tailwind classes based on line type
        let typeClasses = '';
        switch(line.type) {
            case 'success':
                typeClasses = 'text-green-400';
                break;
            case 'warning':
                typeClasses = 'text-yellow-400';
                break;
            case 'error':
                typeClasses = 'text-red-400';
                break;
            default:
                typeClasses = 'text-green-400';
        }
        
        lineElement.className = `boot-line mb-0.5 whitespace-pre-wrap ${typeClasses}`;
        
        this.container.appendChild(lineElement);
        
        // Display the line instantly
        if (line.text.trim() !== '') {
            if (line.hasStatus) {
                // For lines with status, show text, brief loading, then status
                lineElement.textContent = line.text;
                this.playTextSound();
                
                this.showQuickStatus(lineElement, line, () => {
                    this.currentLine++;
                    setTimeout(() => {
                        this.displayNextLine(onComplete);
                    }, line.delay);
                });
            } else {
                // For bundled items, display instantly
                lineElement.textContent = line.text;
                this.playTextSound();
                
                this.currentLine++;
                setTimeout(() => {
                    this.displayNextLine(onComplete);
                }, line.delay);
            }
        } else {
            // For empty lines, just move to next immediately
            this.currentLine++;
            setTimeout(() => {
                this.displayNextLine(onComplete);
            }, line.delay);
        }
    }

    showQuickStatus(element, line, onComplete) {
        // Add quick loading dots
        const dotsElement = document.createElement('span');
        dotsElement.className = 'loading-dots ml-2 text-green-400';
        element.appendChild(dotsElement);
        
        // Show dots briefly
        let dotCount = 0;
        const maxDots = 3;
        const dotInterval = 80; // Very fast dots
        
        const addDot = () => {
            if (dotCount < maxDots) {
                dotsElement.textContent += '.';
                dotCount++;
                setTimeout(addDot, dotInterval);
            } else {
                // Replace dots with status after brief delay
                setTimeout(() => {
                    dotsElement.remove();
                    
                    // Add status with appropriate color
                    const statusElement = document.createElement('span');
                    statusElement.className = 'ml-4 font-bold';
                    
                    if (line.status === '[ WARN ]') {
                        statusElement.className += ' text-yellow-400';
                    } else {
                        statusElement.className += ' text-green-400';
                    }
                    
                    statusElement.textContent = line.status;
                    element.appendChild(statusElement);
                    
                    onComplete();
                }, 100);
            }
        };
        
        setTimeout(addDot, 50);
    }

    async start() {
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            
            if (this.autoStartAudio) {
                // Auto-enable audio and start immediately
                this.enableAudioAndStart(() => {
                    this.displayNextLine(resolve);
                });
            } else {
                // Show audio prompt
                this.showAudioPrompt(() => {
                    this.displayNextLine(resolve);
                });
            }
        });
    }

    async enableAudioAndStart(onStart) {
        if (this.textSoundEffect) {
            try {
                // Try to enable audio
                await this.textSoundEffect.play();
                this.textSoundEffect.pause();
                this.textSoundEffect.currentTime = 0;
                this.audioEnabled = true;
            } catch (error) {
                console.warn('Auto audio not available, will try user interaction:', error);
                this.audioEnabled = false;
            }
        }
        
        // Clear any session storage flag
        sessionStorage.removeItem('cyberquest_auto_audio');
        
        onStart();
    }

    showAudioPrompt(onStart) {
        const promptElement = document.createElement('div');
        promptElement.className = 'text-center p-8';
        promptElement.innerHTML = `
            <div class="text-green-400 mb-4">
                <i class="text-4xl mb-4 block">🔊</i>
                <h2 class="text-xl mb-2">CyberQuest Training Environment</h2>
                <p class="text-sm text-gray-400 mb-6">Click to enable audio and start boot sequence</p>
                <button id="start-boot" class="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer">
                    Start Boot Sequence
                </button>
                <p class="text-xs text-gray-500 mt-4">Audio enhances the training experience but is optional</p>
            </div>
        `;
        
        this.container.appendChild(promptElement);
        
        const startButton = promptElement.querySelector('#start-boot');
        startButton.addEventListener('click', async () => {
            // Try to enable audio with user interaction
            if (this.textSoundEffect) {
                try {
                    await this.textSoundEffect.play();
                    this.textSoundEffect.pause();
                    this.textSoundEffect.currentTime = 0;
                    this.audioEnabled = true;
                } catch (error) {
                    console.warn('Audio not available:', error);
                    this.audioEnabled = false;
                }
            }
            
            // Clear prompt and start boot sequence
            this.container.innerHTML = '';
            onStart();
        });
    }

    playTextSound() {
        if (this.textSoundEffect && this.audioEnabled) {
            try {
                // Clone and play the audio to allow overlapping sounds
                const audioClone = this.textSoundEffect.cloneNode();
                audioClone.volume = 0.1; // Reduced volume since it plays for each line
                audioClone.play().catch(error => {
                    // Silently fail if audio can't play
                    console.debug('Audio play failed (expected in some browsers):', error);
                });
            } catch (error) {
                console.debug('Error playing text sound:', error);
            }
        }
    }
}