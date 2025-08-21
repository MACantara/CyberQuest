// TODO: Increase the z-index to 8000

import { tutorialInteractionManager } from '../tutorials/tutorial-interaction-manager.js';

export class SkipTutorialModal {
    constructor(container) {
        this.container = container;
        this.modal = null;
        this.isVisible = false;
    }

    show() {
        return new Promise((resolve) => {
            if (this.isVisible) return;

            this.createModal();
            this.registerModalInteractions();
            this.bindEvents(resolve);
            this.animateIn();
            this.isVisible = true;
        });
    }

    createModal() {
        // Create backdrop
        this.modal = document.createElement('div');
        this.modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-[8000] opacity-0 transition-opacity duration-300';
        
        // Create modal content
        this.modal.innerHTML = `
            <div class="bg-gray-800 border border-gray-600 shadow-2xl max-w-md w-full mx-4 transform scale-90 transition-transform duration-300 rounded" id="modal-content">
                <div class="bg-gray-700 px-6 py-4 border-b border-gray-600">
                    <div class="flex items-center space-x-3 rounded-t">
                        <i class="bi bi-question-circle text-green-400 text-xl"></i>
                        <h3 class="text-lg font-semibold text-white">Skip Tutorial</h3>
                    </div>
                </div>
                
                <div class="p-6 bg-gray-800 rounded-b">
                    <div class="flex items-center space-x-4 mb-6">
                        <div class="bg-gray-700 border border-gray-600 p-3 rounded">
                            <i class="bi bi-exclamation-triangle text-green-400 text-2xl"></i>
                        </div>
                        <div>
                            <p class="text-gray-300 mb-2 font-medium">
                                Are you sure you want to skip the tutorial?
                            </p>
                            <p class="text-gray-400 text-sm">
                                You can restart it later from the Help menu if needed.
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3 justify-end">
                        <button 
                            id="cancel-skip" 
                            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono text-sm cursor-pointer rounded"
                        >
                            <i class="bi bi-arrow-left mr-1"></i> Continue Tutorial
                        </button>
                        <button 
                            id="confirm-skip" 
                            class="px-4 py-2 bg-gray-700 hover:bg-green-400 hover:text-black text-white border border-gray-600 hover:border-green-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 font-mono text-sm hover:shadow-lg cursor-pointer rounded"
                        >
                            <i class="bi bi-skip-end mr-1"></i> Skip Tutorial
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(this.modal);
    }

    registerModalInteractions() {
        // Allow interactions with the entire modal and its contents
        if (this.modal) {
            tutorialInteractionManager.allowInteractionFor(this.modal);
            
            // Specifically allow the buttons and modal content
            const modalContent = this.modal.querySelector('#modal-content');
            const cancelBtn = this.modal.querySelector('#cancel-skip');
            const confirmBtn = this.modal.querySelector('#confirm-skip');
            
            if (modalContent) tutorialInteractionManager.allowInteractionFor(modalContent);
            if (cancelBtn) tutorialInteractionManager.allowInteractionFor(cancelBtn);
            if (confirmBtn) tutorialInteractionManager.allowInteractionFor(confirmBtn);
        }
    }

    bindEvents(resolve) {
        const cancelBtn = this.modal.querySelector('#cancel-skip');
        const confirmBtn = this.modal.querySelector('#confirm-skip');
        
        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.hide();
            resolve(false);
        });
        
        // Confirm button
        confirmBtn.addEventListener('click', () => {
            this.hide();
            resolve(true);
        });
        
        // Click outside to cancel
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
                resolve(false);
            }
        });
        
        // Escape key to cancel
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', handleKeyDown);
                this.hide();
                resolve(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        
        // Focus on cancel button by default for safety
        setTimeout(() => {
            cancelBtn.focus();
        }, 100);
    }

    animateIn() {
        setTimeout(() => {
            this.modal.classList.remove('opacity-0');
            const content = this.modal.querySelector('#modal-content');
            content.classList.remove('scale-90');
            content.classList.add('scale-100');
        }, 10);
    }

    hide() {
        if (!this.isVisible) return;
        
        // Remove interaction allowances before hiding
        if (this.modal) {
            tutorialInteractionManager.disallowInteractionFor(this.modal);
            const modalContent = this.modal.querySelector('#modal-content');
            const cancelBtn = this.modal.querySelector('#cancel-skip');
            const confirmBtn = this.modal.querySelector('#confirm-skip');
            
            if (modalContent) tutorialInteractionManager.disallowInteractionFor(modalContent);
            if (cancelBtn) tutorialInteractionManager.disallowInteractionFor(cancelBtn);
            if (confirmBtn) tutorialInteractionManager.disallowInteractionFor(confirmBtn);
        }
        
        this.modal.classList.add('opacity-0');
        const content = this.modal.querySelector('#modal-content');
        content.classList.remove('scale-100');
        content.classList.add('scale-90');
        
        setTimeout(() => {
            if (this.modal && this.modal.parentNode) {
                this.modal.parentNode.removeChild(this.modal);
            }
            this.modal = null;
            this.isVisible = false;
        }, 300);
    }
}
