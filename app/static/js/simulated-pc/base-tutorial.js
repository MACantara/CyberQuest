import { SkipTutorialModal } from './desktop-components/skip-tutorial-modal.js';

export class BaseTutorial {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
        this.steps = [];
        this.skipTutorialModal = null;
    }

    createOverlay() {
        // Create tutorial overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'fixed inset-0 bg-black/50 z-50 tutorial-overlay';
        this.overlay.style.pointerEvents = 'none';
        
        // Create tooltip container
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'fixed z-50 tutorial-tooltip bg-gray-800 border border-gray-600 rounded shadow-2xl p-6 max-w-sm transform transition-all duration-300';
        this.tooltip.style.pointerEvents = 'auto';
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.tooltip);
    }    
    
    highlightElement(element, action = 'highlight') {
        // Create highlight effect
        const rect = element.getBoundingClientRect();
        
        // Create spotlight effect by cutting out the overlay
        this.overlay.style.background = `
            radial-gradient(
                ellipse ${rect.width + 20}px ${rect.height + 20}px at ${rect.left + rect.width/2}px ${rect.top + rect.height/2}px,
                transparent 0%,
                transparent 40%,
                rgba(0, 0, 0, 0.7) 70%
            )
        `;

        // Add visual effects to the target
        element.classList.add('tutorial-highlight');
        
        if (action === 'pulse') {
            element.classList.add('tutorial-pulse');
        }
        
        // Make target clickable during tutorial - preserve existing position if absolute
        const currentPosition = window.getComputedStyle(element).position;
        if (currentPosition !== 'absolute') {
            element.style.position = 'relative';
        }
        element.style.zIndex = '51';
        element.style.pointerEvents = 'auto';
    }

    positionTooltip(target, position) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const margin = 20;
        
        let left, top;
        
        switch (position) {
            case 'right':
                left = rect.right + margin;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'left':
                left = rect.left - tooltipRect.width - margin;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'top':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.top - tooltipRect.height - margin;
                break;
            case 'bottom':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.bottom + margin;
                break;
            default:
                left = rect.right + margin;
                top = rect.top;
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(20, Math.min(left, window.innerWidth - tooltipRect.width - 20));
        top = Math.max(20, Math.min(top, window.innerHeight - tooltipRect.height - 20));
        
        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }

    showTooltip(target, step) {
        this.tooltip.innerHTML = this.createTooltipContent(step);
        this.positionTooltip(target, step.position);
        
        // Show tooltip with animation
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.tooltip.style.opacity = '1';
            this.tooltip.style.transform = 'scale(1)';
        }, 100);
    }

    createTooltipContent(step) {
        return `
            <div class="tutorial-content">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-white mb-2">${step.title}</h3>
                        <div class="text-xs text-gray-400 mb-2">Step ${this.currentStep + 1} of ${this.steps.length}</div>
                    </div>
                    <button class="tutorial-close text-gray-400 hover:text-white transition-colors duration-200 ml-4 text-xs cursor-pointer" onclick="${this.getSkipTutorialHandler()}">
                        Skip tutorial
                    </button>
                </div>
                
                <p class="text-gray-300 text-sm leading-relaxed mb-6">${step.content}</p>
                
                <div class="flex items-center justify-between">
                    <div class="flex space-x-1">
                        ${this.steps.map((_, index) => `
                            <div class="w-2 h-2 rounded-full ${index === this.currentStep ? 'bg-green-400' : 'bg-gray-600'}"></div>
                        `).join('')}
                    </div>
                    
                    <div class="flex space-x-2">
                        ${this.currentStep > 0 ? `
                            <button class="tutorial-btn-secondary px-3 py-1 text-xs border border-gray-500 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200 cursor-pointer" onclick="${this.getPreviousStepHandler()}">
                                <i class="bi bi-arrow-left mr-1"></i>Back
                            </button>
                        ` : ''}
                        
                        ${this.createStepButton(step)}
                    </div>
                </div>
            </div>
        `;
    }

    createStepButton(step) {
        if (step.final) {
            return `
                <button class="tutorial-btn-primary px-4 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" onclick="${this.getFinalStepHandler()}">
                    ${this.getFinalButtonText()}
                    <i class="bi bi-play ml-1"></i>
                </button>
            `;
        } else {
            return `
                <button class="tutorial-btn-primary px-4 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" onclick="${this.getNextStepHandler()}">
                    Next
                    <i class="bi bi-arrow-right ml-1"></i>
                </button>
            `;
        }
    }

    clearHighlights() {
        // Remove all tutorial highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight', 'tutorial-pulse');
            // Only reset position if we changed it (not if it was originally absolute)
            if (el.style.position === 'relative') {
                el.style.position = '';
            }
            el.style.zIndex = '';
            el.style.pointerEvents = '';
        });
    }

    cleanup() {
        this.isActive = false;
        
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
    }

    nextStep() {
        this.currentStep++;
        this.showStep();
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep();
        }
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        const target = document.querySelector(step.target);
        
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Clear previous highlights
        this.clearHighlights();
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    complete() {
        this.clearHighlights();
        this.cleanup();
    }

    // Override these methods in child classes
    getSkipTutorialHandler() {
        return 'window.currentTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.currentTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.currentTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.currentTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Complete';
    }

    async showSkipModal() {
        if (!this.skipTutorialModal) {
            this.skipTutorialModal = new SkipTutorialModal(document.body);
        }
        
        const shouldSkip = await this.skipTutorialModal.show();
        if (shouldSkip) {
            this.complete();
        }
    }
}