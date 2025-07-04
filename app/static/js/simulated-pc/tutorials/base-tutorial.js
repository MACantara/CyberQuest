import { SkipTutorialModal } from '../desktop-components/skip-tutorial-modal.js';

export class BaseTutorial {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.tooltip = null;
        this.steps = [];
        this.skipTutorialModal = null;
        this.interactionListeners = new Map(); // Store interaction event listeners
        this.stepCompleted = false; // Track if current step is completed
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
        
        // Add interactive highlighting for interactive steps
        const currentStep = this.steps[this.currentStep];
        if (currentStep?.interactive) {
            element.classList.add('tutorial-interactive');
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
        } else if (step.interactive && !this.stepCompleted) {
            return `
                <div class="flex items-center space-x-2">
                    <div class="text-yellow-400 text-xs">
                        <i class="bi bi-hand-index mr-1"></i>
                        ${step.interaction?.instructions || 'Complete the interaction to continue'}
                    </div>
                    <button class="tutorial-btn-secondary px-3 py-1 text-xs border border-gray-500 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200 cursor-pointer" onclick="${this.getNextStepHandler()}">
                        Skip <i class="bi bi-arrow-right ml-1"></i>
                    </button>
                </div>
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

    setupStepInteraction(step, target) {
        if (!step.interaction) return;

        const interaction = step.interaction;
        
        // Make the target element interactive during tutorial mode
        target.style.pointerEvents = 'auto';
        target.style.cursor = 'pointer';
        
        // Set up different types of interactions
        switch (interaction.type) {
            case 'click':
                this.setupClickInteraction(step, target, interaction);
                break;
            case 'input':
                this.setupInputInteraction(step, target, interaction);
                break;
            case 'dblclick':
                this.setupDoubleClickInteraction(step, target, interaction);
                break;
            case 'hover':
                this.setupHoverInteraction(step, target, interaction);
                break;
            case 'scroll':
                this.setupScrollInteraction(step, target, interaction);
                break;
            case 'select':
                this.setupSelectInteraction(step, target, interaction);
                break;
            default:
                console.warn(`Unknown interaction type: ${interaction.type}`);
        }
    }

    setupClickInteraction(step, target, interaction) {
        const clickHandler = (e) => {
            if (interaction.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            this.completeStepInteraction(step, interaction);
        };
        
        target.addEventListener('click', clickHandler);
        this.interactionListeners.set(target, { event: 'click', handler: clickHandler });
    }

    setupDoubleClickInteraction(step, target, interaction) {
        const dblClickHandler = (e) => {
            if (interaction.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            this.completeStepInteraction(step, interaction);
        };
        
        target.addEventListener('dblclick', dblClickHandler);
        this.interactionListeners.set(target, { event: 'dblclick', handler: dblClickHandler });
    }

    setupInputInteraction(step, target, interaction) {
        const inputHandler = (e) => {
            const value = e.target.value.toLowerCase();
            const expectedValue = interaction.expectedValue?.toLowerCase();
            
            if (expectedValue && value.includes(expectedValue)) {
                this.completeStepInteraction(step, interaction);
            } else if (!expectedValue && value.length > 0) {
                // If no specific value expected, any input completes the step
                this.completeStepInteraction(step, interaction);
            }
        };
        
        target.addEventListener('input', inputHandler);
        target.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && interaction.triggerOnEnter) {
                inputHandler(e);
            }
        });
        
        this.interactionListeners.set(target, { event: 'input', handler: inputHandler });
    }

    setupHoverInteraction(step, target, interaction) {
        const hoverHandler = () => {
            setTimeout(() => {
                this.completeStepInteraction(step, interaction);
            }, interaction.hoverDuration || 1000);
        };
        
        target.addEventListener('mouseenter', hoverHandler);
        this.interactionListeners.set(target, { event: 'mouseenter', handler: hoverHandler });
    }

    setupScrollInteraction(step, target, interaction) {
        const scrollHandler = () => {
            const scrollProgress = target.scrollTop / (target.scrollHeight - target.clientHeight);
            if (scrollProgress >= (interaction.scrollThreshold || 0.5)) {
                this.completeStepInteraction(step, interaction);
            }
        };
        
        target.addEventListener('scroll', scrollHandler);
        this.interactionListeners.set(target, { event: 'scroll', handler: scrollHandler });
    }

    setupSelectInteraction(step, target, interaction) {
        const selectHandler = (e) => {
            const selectedValue = e.target.value;
            if (interaction.expectedValue && selectedValue === interaction.expectedValue) {
                this.completeStepInteraction(step, interaction);
            } else if (!interaction.expectedValue) {
                this.completeStepInteraction(step, interaction);
            }
        };
        
        target.addEventListener('change', selectHandler);
        this.interactionListeners.set(target, { event: 'change', handler: selectHandler });
    }

    completeStepInteraction(step, interaction) {
        if (this.stepCompleted) return; // Prevent multiple completions
        
        this.stepCompleted = true;
        
        // Show success feedback
        this.showInteractionSuccess(step, interaction);
        
        // Auto-advance to next step if specified
        if (interaction.autoAdvance !== false) {
            setTimeout(() => {
                this.nextStep();
            }, interaction.advanceDelay || 1500);
        }
    }

    showInteractionSuccess(step, interaction) {
        const target = document.querySelector(step.target);
        if (!target) return;
        
        // Add success visual feedback
        target.classList.add('tutorial-success');
        
        // Update tooltip to show success message
        if (this.tooltip) {
            const successMessage = interaction.successMessage || 'Great! Step completed successfully.';
            const successElement = document.createElement('div');
            successElement.className = 'tutorial-success-message bg-green-600 text-white p-2 rounded mt-2 text-sm';
            successElement.innerHTML = `
                <i class="bi bi-check-circle mr-2"></i>
                ${successMessage}
            `;
            this.tooltip.appendChild(successElement);
        }
        
        // Remove success styling after a delay
        setTimeout(() => {
            target.classList.remove('tutorial-success');
        }, 2000);
    }

    clearStepInteractions() {
        // Remove all interaction event listeners
        this.interactionListeners.forEach((listener, target) => {
            target.removeEventListener(listener.event, listener.handler);
            // Reset interaction styling
            target.style.pointerEvents = '';
            target.style.cursor = '';
        });
        this.interactionListeners.clear();
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

    cleanup() {
        this.isActive = false;
        
        // Clear all interactions
        this.clearStepInteractions();
        
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
        
        // Clear highlights
        this.clearHighlights();
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

        // Clear previous highlights and interactions
        this.clearHighlights();
        this.clearStepInteractions();
        this.stepCompleted = false;
        
        // Highlight target element
        this.highlightElement(target, step.action);
        
        // Set up interaction if this is an interactive step
        if (step.interactive) {
            this.setupStepInteraction(step, target);
        }
        
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

    // Initialize CSS when tutorial starts
    start() {
        this.initializeCSS();
        // Default implementation - child classes should override
        this.isActive = true;
        this.currentStep = 0;
        this.createOverlay();
        this.showStep();
    }
}