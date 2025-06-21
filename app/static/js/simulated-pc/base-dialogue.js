export class BaseDialogue {
    constructor(desktop, character = 'default') {
        this.desktop = desktop;
        this.character = character;
        this.isActive = false;
        this.currentMessageIndex = 0;
        this.overlay = null;
        this.dialogueContainer = null;
        this.messages = []; // To be defined by child classes
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
        this.overlay.className = 'dialogue-overlay';
        
        // Create dialogue container
        this.dialogueContainer = document.createElement('div');
        this.dialogueContainer.className = 'dialogue-container';
        
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
            <img src="${avatarUrl}" alt="${characterName}" class="dialogue-avatar" 
                 onerror="this.src='/static/images/avatars/default.png'">
            
            <div class="dialogue-speaker">${characterName}</div>
            
            <div class="dialogue-text" id="dialogue-text-content">
                ${this.shouldTypeMessage(message) ? '' : message.text}
            </div>
            
            <div class="dialogue-controls">
                ${this.currentMessageIndex > 0 ? 
                    `<button class="dialogue-btn dialogue-btn-secondary" onclick="${this.getPreviousHandler()}">
                        ← Previous
                    </button>` : ''
                }
                <button class="dialogue-btn dialogue-btn-primary" onclick="${this.getNextHandler()}">
                    ${isLastMessage ? this.getFinalButtonText() : 'Next →'}
                </button>
                ${this.getSkipButton()}
            </div>
            
            <div class="dialogue-progress">
                ${this.currentMessageIndex + 1} / ${this.messages.length}
            </div>
        `;

        // Type message if needed
        if (this.shouldTypeMessage(message)) {
            this.typeMessage(message.text);
        }
    }

    shouldTypeMessage(message) {
        return message.type === 'typing' || message.typing === true;
    }

    async typeMessage(text, speed = 50) {
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