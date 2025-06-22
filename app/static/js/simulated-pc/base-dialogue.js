export class BaseDialogue {
    constructor(desktop, character = 'default') {
        this.desktop = desktop;
        this.character = character;
        this.isActive = false;
        this.currentMessageIndex = 0;
        this.overlay = null;
        this.dialogueContainer = null;
        this.messages = []; // To be defined by child classes
        this.typingSpeed = 12.5; // Default typing speed in milliseconds per character (Lower is faster)
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentMessageIndex = 0;
        this.createDialogueOverlay();
        this.showMessage();
    }
    
    createDialogueOverlay() {
        // Remove any existing overlay
        this.cleanup();
        
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'fixed inset-0 bg-black/20 flex justify-center items-start pt-[3vh] z-[10000]';
        
        // Create dialogue container
        this.dialogueContainer = document.createElement('div');
        this.dialogueContainer.className = 'bg-gray-800 border-2 border-green-500 rounded p-4 max-w-2xl w-[90%] min-h-[200px] shadow-2xl flex flex-row items-start gap-8 dialogue-appear';
        
        this.overlay.appendChild(this.dialogueContainer);
        document.body.appendChild(this.overlay);
        
        // Prevent clicking outside to close (force user interaction)
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    showMessage() {
        if (this.currentMessageIndex >= this.messages.length) {
            this.complete();
            return;
        }

        const message = this.messages[this.currentMessageIndex];
        this.renderMessage(message);
    }

    renderMessage(message) {
        const avatarUrl = this.getCharacterAvatar();
        const characterName = this.getCharacterName();
        const isLastMessage = this.currentMessageIndex >= this.messages.length - 1;

        this.dialogueContainer.innerHTML = `
            <img src="${avatarUrl}" alt="${characterName}" 
                 class="w-30 h-30 rounded border-3 border-green-500 object-cover shadow-lg shadow-green-500/30 flex-shrink-0" 
                 onerror="this.src='/static/images/avatars/default.png'" width="120" height="120">
            
            <div class="flex-1 flex flex-col min-h-[200px] relative">
                <div class="text-green-500 text-xl font-bold mb-4 text-left">${characterName}</div>
                
                <div class="text-green-400 text-lg leading-relaxed mb-8 flex-grow text-left" id="dialogue-text-content">
                    ${this.shouldTypeMessage(message) ? '' : message.text}
                </div>
                
                <div class="flex justify-between items-center mt-auto">
                    <div class="text-green-400 text-sm">
                        ${this.currentMessageIndex + 1} / ${this.messages.length}
                    </div>
                    
                    <div class="flex gap-6">
                        ${this.currentMessageIndex > 0 ? 
                            `<button class="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer text-md" onclick="${this.getPreviousHandler()}">
                                ← Previous
                            </button>` : ''
                        }
                        <button class="text-green-400 hover:text-green-300 transition-colors duration-200 cursor-pointer text-md" onclick="${this.getNextHandler()}">
                            ${isLastMessage ? this.getFinalButtonText() : 'Next →'}
                        </button>
                        <button class="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer text-md" onclick="${this.getSkipHandler()}">
                            Skip
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Type message if needed
        if (this.shouldTypeMessage(message)) {
            this.typeMessage(message.text);
        }
    }

    shouldTypeMessage(message) {
        // Default to typing unless explicitly disabled
        return message.typing !== false && message.type !== 'instant';
    }

    async typeMessage(text, speed = this.typingSpeed) {
        const container = document.getElementById('dialogue-text-content');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            container.innerHTML += text[i];
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    nextMessage() {
        if (this.currentMessageIndex < this.messages.length - 1) {
            this.currentMessageIndex++;
            this.showMessage();
        } else {
            this.complete();
        }
    }

    previousMessage() {
        if (this.currentMessageIndex > 0) {
            this.currentMessageIndex--;
            this.showMessage();
        }
    }

    complete() {
        this.cleanup();
        this.onComplete();
    }

    cleanup() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.dialogueContainer = null;
        this.isActive = false;
    }

    // Methods to be overridden by child classes
    onComplete() {
        // Override in child classes
        console.log('Dialogue completed');
    }

    getSkipButton() {
        return `<button class="dialogue-btn dialogue-btn-secondary" onclick="${this.getSkipHandler()}">
            Skip
        </button>`;
    }

    getFinalButtonText() {
        return 'Continue';
    }

    // Handler methods - to be overridden by child classes
    getNextHandler() {
        return 'window.currentDialogue.nextMessage()';
    }

    getPreviousHandler() {
        return 'window.currentDialogue.previousMessage()';
    }

    getSkipHandler() {
        return 'window.currentDialogue.showSkipModal()';
    }

    showSkipModal() {
        if (confirm('Are you sure you want to skip this dialogue?')) {
            this.complete();
        }
    }

    // Character management
    getCharacterAvatar() {
        if (this.desktop?.dialogueManager) {
            return this.desktop.dialogueManager.getCharacterAvatar(this.character);
        }
        return '/static/images/avatars/default.png';
    }

    getCharacterName() {
        if (this.desktop?.dialogueManager) {
            return this.desktop.dialogueManager.getCharacterName(this.character);
        }
        return 'System';
    }

    // Static methods - to be overridden by child classes
    static shouldAutoStart() {
        return false;
    }

    static restart() {
        // Override in child classes
    }
}