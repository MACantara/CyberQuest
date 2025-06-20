export class ShutdownModal {
    constructor(container) {
        this.container = container;
        this.modal = null;
        this.isVisible = false;
    }

    show() {
        return new Promise((resolve) => {
            if (this.isVisible) return;

            this.createModal();
            this.bindEvents(resolve);
            this.animateIn();
            this.isVisible = true;
        });
    }

    createModal() {
        // Create backdrop
        this.modal = document.createElement('div');
        this.modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300';
        
        // Create modal content
        this.modal.innerHTML = `
            <div class="bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-w-md w-full mx-4 transform scale-90 transition-transform duration-300" id="modal-content">
                <div class="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
                    <div class="flex items-center space-x-3">
                        <i class="bi bi-power text-red-400 text-xl"></i>
                        <h3 class="text-lg font-semibold text-white">Shutdown Simulation</h3>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex items-start space-x-4 mb-6">
                        <div class="bg-yellow-900 bg-opacity-50 p-3 rounded-full">
                            <i class="bi bi-exclamation-triangle text-yellow-400 text-2xl"></i>
                        </div>
                        <div>
                            <p class="text-gray-300 mb-2">
                                Are you sure you want to exit the simulation?
                            </p>
                            <p class="text-gray-400 text-sm">
                                Your progress will be saved and you'll be returned to the main portal.
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3 justify-end">
                        <button 
                            id="cancel-shutdown" 
                            class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded border border-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            <i class="bi bi-x-circle mr-1"></i> Cancel
                        </button>
                        <button 
                            id="confirm-shutdown" 
                            class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded border border-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            <i class="bi bi-power mr-1"></i> Shutdown
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(this.modal);
    }

    bindEvents(resolve) {
        const cancelBtn = this.modal.querySelector('#cancel-shutdown');
        const confirmBtn = this.modal.querySelector('#confirm-shutdown');
        
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
        
        // Focus on confirm button for accessibility
        setTimeout(() => {
            confirmBtn.focus();
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
