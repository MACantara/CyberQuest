export class TutorialStepManager {
    constructor(baseTutorial) {
        this.tutorial = baseTutorial;
        this.currentStep = 0;
        this.stepCompleted = false;
        this.interactionListeners = new Map();
    }

    // Step navigation methods
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

    goToStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.tutorial.steps.length) {
            this.currentStep = stepIndex;
            this.showStep();
        }
    }

    getCurrentStep() {
        return this.tutorial.steps[this.currentStep] || null;
    }

    getCurrentStepIndex() {
        return this.currentStep;
    }

    getTotalSteps() {
        return this.tutorial.steps.length;
    }

    isLastStep() {
        return this.currentStep >= this.tutorial.steps.length - 1;
    }

    isFirstStep() {
        return this.currentStep === 0;
    }

    // Step display and management
    showStep() {
        if (this.currentStep >= this.tutorial.steps.length) {
            this.tutorial.complete();
            return;
        }

        const step = this.tutorial.steps[this.currentStep];
        const target = document.querySelector(step.target);
        
        if (!target) {
            console.warn(`Tutorial target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Clear previous highlights and interactions
        this.tutorial.clearHighlights();
        this.clearStepInteractions();
        this.stepCompleted = false;
        
        // Highlight target element
        this.tutorial.highlightElement(target, step.action);
        
        // Set up interaction if this is an interactive step
        if (step.interactive) {
            this.setupStepInteraction(step, target);
        }
        
        // Position and show tooltip
        this.tutorial.showTooltip(target, step);
    }

    // Step validation and error handling
    validateStep(step) {
        const requiredFields = ['target', 'title', 'content'];
        const optionalFields = ['position', 'action', 'interactive', 'interaction', 'final'];
        
        for (const field of requiredFields) {
            if (!step[field]) {
                throw new Error(`Step is missing required field: ${field}`);
            }
        }

        if (step.interactive && !step.interaction) {
            throw new Error('Interactive step must have interaction configuration');
        }

        if (step.interaction) {
            this.validateInteraction(step.interaction);
        }

        return true;
    }

    validateInteraction(interaction) {
        const requiredFields = ['type'];
        const validTypes = ['click', 'input', 'dblclick', 'hover', 'scroll', 'select'];
        
        if (!interaction.type || !validTypes.includes(interaction.type)) {
            throw new Error(`Invalid interaction type: ${interaction.type}`);
        }

        return true;
    }

    // Step interaction management
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
        if (this.tutorial.tooltip) {
            const successMessage = interaction.successMessage || 'Great! Step completed successfully.';
            const successElement = document.createElement('div');
            successElement.className = 'tutorial-success-message bg-green-600 text-white p-2 rounded mt-2 text-sm';
            successElement.innerHTML = `
                <i class="bi bi-check-circle mr-2"></i>
                ${successMessage}
            `;
            this.tutorial.tooltip.appendChild(successElement);
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

    // Step button creation
    createStepButton(step) {
        if (step.final) {
            return `
                <button class="tutorial-btn-primary px-4 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" onclick="${this.tutorial.getFinalStepHandler()}">
                    ${this.tutorial.getFinalButtonText()}
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
                    <button class="tutorial-btn-secondary px-3 py-1 text-xs border border-gray-500 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200 cursor-pointer" onclick="${this.tutorial.getNextStepHandler()}">
                        Skip <i class="bi bi-arrow-right ml-1"></i>
                    </button>
                </div>
            `;
        } else {
            return `
                <button class="tutorial-btn-primary px-4 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer" onclick="${this.tutorial.getNextStepHandler()}">
                    Next
                    <i class="bi bi-arrow-right ml-1"></i>
                </button>
            `;
        }
    }

    // Step progress indicators
    createStepProgress() {
        return this.tutorial.steps.map((_, index) => `
            <div class="w-2 h-2 rounded-full ${index === this.currentStep ? 'bg-green-400' : 'bg-gray-600'}"></div>
        `).join('');
    }

    getStepProgressText() {
        return `Step ${this.currentStep + 1} of ${this.tutorial.steps.length}`;
    }

    // Step state management
    getStepState() {
        return {
            currentStep: this.currentStep,
            stepCompleted: this.stepCompleted,
            totalSteps: this.tutorial.steps.length,
            isFirstStep: this.isFirstStep(),
            isLastStep: this.isLastStep()
        };
    }

    setStepState(state) {
        this.currentStep = state.currentStep || 0;
        this.stepCompleted = state.stepCompleted || false;
    }

    reset() {
        this.currentStep = 0;
        this.stepCompleted = false;
        this.clearStepInteractions();
    }

    // Utility methods
    findStepByTarget(target) {
        return this.tutorial.steps.findIndex(step => step.target === target);
    }

    getStepByIndex(index) {
        return this.tutorial.steps[index] || null;
    }

    hasStep(index) {
        return index >= 0 && index < this.tutorial.steps.length;
    }

    // Step filtering and searching
    getStepsByType(type) {
        return this.tutorial.steps.filter(step => step.action === type);
    }

    getInteractiveSteps() {
        return this.tutorial.steps.filter(step => step.interactive);
    }

    getNonInteractiveSteps() {
        return this.tutorial.steps.filter(step => !step.interactive);
    }

    // Cleanup
    cleanup() {
        this.clearStepInteractions();
        this.currentStep = 0;
        this.stepCompleted = false;
    }
}

export default TutorialStepManager;
