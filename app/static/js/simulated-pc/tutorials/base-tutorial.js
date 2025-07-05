import { SkipTutorialModal } from '../desktop-components/skip-tutorial-modal.js';
import { TutorialStepManager } from './tutorial-step-manager.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

export class BaseTutorial {
    constructor(desktop) {
        this.desktop = desktop;
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
        this.steps = [];
        this.skipTutorialModal = null;
        
        // Initialize step manager
        this.stepManager = new TutorialStepManager(this);
    }

    // Delegate step management to step manager
    get currentStep() {
        return this.stepManager.getCurrentStepIndex();
    }

    set currentStep(value) {
        this.stepManager.goToStep(value);
    }

    get stepCompleted() {
        return this.stepManager.stepCompleted;
    }

    set stepCompleted(value) {
        this.stepManager.stepCompleted = value;
    }

    get interactionListeners() {
        return this.stepManager.interactionListeners;
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
        this.tooltip.style.zIndex = '9999'; // Ensure tooltip is always on top
        this.tooltip.style.display = 'none';           // <--- hide initially
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.tooltip);
        
        // Bring tutorial-relevant windows to front
        this.bringTargetWindowsToFront();
    }

    bringTargetWindowsToFront() {
        // Find windows that are targets of tutorial steps
        const targetWindows = new Set();
        
        this.steps.forEach(step => {
            const target = document.querySelector(step.target);
            if (target) {
                const window = target.closest('.window');
                if (window) {
                    targetWindows.add(window);
                }
            }
        });
        
        // Set z-index for target windows to appear above overlay but below tooltip
        targetWindows.forEach(window => {
            window.style.zIndex = '51';
        });
    }

    highlightElement(element, action = 'highlight') {
        // Ensure overlay exists before trying to use it
        if (!this.overlay) {
            console.warn('Overlay not created yet, cannot highlight element');
            return;
        }

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
        
        // Add interactive highlighting for interactive steps
        const currentStep = this.steps[this.stepManager.getCurrentStepIndex()];
        if (currentStep?.interactive) {
            element.classList.add('tutorial-interactive');
            // Allow interactions on this element
            tutorialInteractionManager.allowInteractionFor(element);
        } else {
            element.classList.add('tutorial-highlight');
        }
        
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
        // make tooltip visible now that content is ready
        this.tooltip.style.display = 'block';          // <--- show on demand
        this.tooltip.innerHTML = this.createTooltipContent(step);
        
        // Ensure tooltip is always interactive
        this.tooltip.style.pointerEvents = 'auto';
        this.tooltip.style.zIndex = '9999';
        
        // Allow interactions with all tooltip elements
        tutorialInteractionManager.allowInteractionFor(this.tooltip);
        this.tooltip.querySelectorAll('*').forEach(element => {
            tutorialInteractionManager.allowInteractionFor(element);
        });
        
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
        const skipHandler = this.getSkipTutorialHandler().replace('()', '');
        return `
            <div class="tutorial-content">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-bold text-white mb-2">${step.title}</h3>
                        <div class="text-xs text-gray-400 mb-2">${this.stepManager.getStepProgressText()}</div>
                    </div>
                    <button class="tutorial-close text-gray-400 hover:text-white transition-colors duration-200 ml-4 text-xs cursor-pointer" onclick="${skipHandler}()">
                        Skip tutorial
                    </button>
                </div>
                
                <p class="text-gray-300 text-sm leading-relaxed mb-6">${step.content}</p>
                
                <div class="flex items-center justify-between">
                    <div class="flex space-x-1">
                        ${this.stepManager.createStepProgress()}
                    </div>
                    
                    <div class="flex space-x-2">
                        ${this.stepManager.isFirstStep() ? '' : `
                            <button class="tutorial-btn-secondary px-3 py-1 text-xs border border-gray-500 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200 cursor-pointer" onclick="${this.getPreviousStepHandler()}">
                                <i class="bi bi-arrow-left mr-1"></i>Back
                            </button>
                        `}
                        
                        ${this.createStepButton(step)}
                    </div>
                </div>
            </div>
        `;
    }

    createStepButton(step) {
        return this.stepManager.createStepButton(step);
    }

    setupStepInteraction(step, target) {
        if (step.interactive) {
            // Allow interactions for this specific element and its children
            tutorialInteractionManager.allowInteractionFor(target);
            
            // For process table interactions, also allow interactions on table rows
            if (step.target.includes('process-table') || step.target.includes('.process-row')) {
                const processTable = document.querySelector('#process-table-body');
                if (processTable) {
                    tutorialInteractionManager.allowInteractionFor(processTable);
                    // Allow interactions on all process rows
                    processTable.querySelectorAll('.process-row').forEach(row => {
                        tutorialInteractionManager.allowInteractionFor(row);
                    });
                }
            }
            
            // For column header interactions
            if (step.target.includes('sort-') || step.target.includes('-header')) {
                const headers = document.querySelectorAll('#process-table-header th');
                headers.forEach(header => {
                    tutorialInteractionManager.allowInteractionFor(header);
                });
            }
        }
        
        return this.stepManager.setupStepInteraction(step, target);
    }

    completeStepInteraction(step, interaction) {
        return this.stepManager.completeStepInteraction(step, interaction);
    }

    showInteractionSuccess(step, interaction) {
        return this.stepManager.showInteractionSuccess(step, interaction);
    }

    clearStepInteractions() {
        // Clear allowed interactions
        tutorialInteractionManager.clearAllowedInteractions();
        return this.stepManager.clearStepInteractions();
    }

    nextStep() {
        // Clear current step interactions before moving to next
        this.clearStepInteractions();
        this.stepManager.nextStep();
    }

    previousStep() {
        // Clear current step interactions before moving to previous
        this.clearStepInteractions();
        this.stepManager.previousStep();
    }

    showStep() {
        if (this.stepManager.getCurrentStepIndex() >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.stepManager.getCurrentStepIndex()];
        let target = document.querySelector(step.target);
        
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Clear previous highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Setup interactions for this step
        this.setupStepInteraction(step, target);
        
        // Position and show tooltip
        this.showTooltip(target, step);
    }

    cleanup() {
        this.isActive = false;
        
        // Disable tutorial mode
        tutorialInteractionManager.disableTutorialMode();
        
        // Reset window z-indexes
        this.resetWindowZIndexes();
        
        // Clear step manager
        this.stepManager.cleanup();
        
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
        
        // Clear highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
    }

    resetWindowZIndexes() {
        // Reset z-index for all windows that were modified during tutorial
        document.querySelectorAll('.window').forEach(window => {
            if (window.style.zIndex === '51') {
                window.style.zIndex = '';
            }
        });
    }

    clearHighlights() {
        // Remove all tutorial highlights including interactive ones
        document.querySelectorAll('.tutorial-highlight, .tutorial-pulse, .tutorial-interactive, .tutorial-success').forEach(el => {
            el.classList.remove('tutorial-highlight', 'tutorial-pulse', 'tutorial-interactive', 'tutorial-success');
            // Only reset position if we changed it (not if it was originally absolute)
            if (el.style.position === 'relative') {
                el.style.position = '';
            }
            el.style.zIndex = '';
            el.style.pointerEvents = '';
            el.style.cursor = '';
        });
    }

    // Enhanced CSS for interactive steps
    initializeCSS() {
        if (document.getElementById('tutorial-interaction-styles')) return;

        const tutorialStyles = document.createElement('style');
        tutorialStyles.id = 'tutorial-interaction-styles';
        tutorialStyles.textContent = `
            .tutorial-success {
                animation: tutorial-success-pulse 0.6s ease-in-out;
                border-color: #10b981 !important;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.8) !important;
            }
            
            @keyframes tutorial-success-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .tutorial-interactive {
                animation: tutorial-interactive-glow 2s ease-in-out infinite alternate;
                border: 3px solid #3b82f6 !important;
                border-radius: 8px !important;
                box-shadow: 0 0 25px rgba(59, 130, 246, 0.7) !important;
            }
            
            @keyframes tutorial-interactive-glow {
                from {
                    box-shadow: 0 0 25px rgba(59, 130, 246, 0.7);
                }
                to {
                    box-shadow: 0 0 35px rgba(59, 130, 246, 1), 0 0 45px rgba(59, 130, 246, 0.7);
                }
            }
            
            .tutorial-success-message {
                animation: tutorial-success-fade-in 0.3s ease-in-out;
            }
            
            @keyframes tutorial-success-fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(tutorialStyles);
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

    complete() {
        this.clearHighlights();
        this.cleanup();
    }

    // Initialize CSS when tutorial starts
    start() {
        this.initializeCSS();
        
        // Enable tutorial mode
        tutorialInteractionManager.enableTutorialMode();
        
        // Default implementation - child classes should override
        this.isActive = true;
        this.stepManager.reset();
        this.createOverlay();
        this.showStep();
    }
}