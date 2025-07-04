import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';
import { tutorialRegistry } from './tutorial-registry.js';

export class TutorialManager {
    constructor(desktop) {
        this.desktop = desktop;
        this.currentTutorial = null;
        this.interactionManager = tutorialInteractionManager;
        this.registry = tutorialRegistry;
    }

    // Generic tutorial starter using registry
    async startTutorial(tutorialName, tutorialClass, globalVarName) {
        if (this.currentTutorial) {
            this.currentTutorial.cleanup();
        }
        
        // Enable tutorial mode to disable interactions
        this.interactionManager.enableTutorialMode();
        
        // Dynamic import to avoid circular dependency
        const module = await import(`./${tutorialName}-tutorial.js`);
        const TutorialClass = module[tutorialClass];
        
        this.currentTutorial = new TutorialClass(this.desktop);
        window[globalVarName] = this.currentTutorial; // For global access
        window.currentTutorial = this.currentTutorial; // For shared base functionality
        
        // Override the tutorial's complete method to disable tutorial mode
        const originalComplete = this.currentTutorial.complete.bind(this.currentTutorial);
        this.currentTutorial.complete = () => {
            originalComplete();
            this.interactionManager.disableTutorialMode();
        };
        
        // Override the tutorial's cleanup method to disable tutorial mode
        const originalCleanup = this.currentTutorial.cleanup.bind(this.currentTutorial);
        this.currentTutorial.cleanup = () => {
            originalCleanup();
            this.interactionManager.disableTutorialMode();
        };
        
        this.currentTutorial.start();
    }

    // Generic tutorial starter using registry configuration
    async startTutorialByName(tutorialName) {
        const tutorialConfig = this.registry.getTutorial(tutorialName);
        if (!tutorialConfig) {
            throw new Error(`Tutorial '${tutorialName}' not found in registry`);
        }

        return await this.startTutorial(
            tutorialName,
            tutorialConfig.className,
            tutorialConfig.globalVarName
        );
    }

    // Generic auto-start checker using registry
    async shouldAutoStart(tutorialName, tutorialClass) {
        const module = await import(`./${tutorialName}-tutorial.js`);
        const TutorialClass = module[tutorialClass];
        return TutorialClass.shouldAutoStart();
    }

    // Generic tutorial restarter using registry
    async restartTutorial(tutorialName) {
        const tutorialConfig = this.registry.getTutorial(tutorialName);
        if (!tutorialConfig) {
            throw new Error(`Tutorial '${tutorialName}' not found in registry`);
        }

        // Reset completion status
        this.registry.resetTutorial(tutorialName);
        
        // Import and call static restart method
        const module = await import(`./${tutorialName}-tutorial.js`);
        const TutorialClass = module[tutorialConfig.className];
        if (TutorialClass.restart) {
            TutorialClass.restart();
        }
        
        // Start the tutorial
        return await this.startTutorialByName(tutorialName);
    }

    // Dynamic method generation for all registered tutorials
    generateTutorialMethods() {
        this.registry.getAllTutorialNames().forEach(tutorialName => {
            const config = this.registry.getTutorial(tutorialName);
            
            // Generate start method
            if (config.startMethod) {
                this[config.startMethod] = async () => {
                    return await this.startTutorial(
                        tutorialName,
                        config.className,
                        config.globalVarName
                    );
                };
            }

            // Generate should auto-start method
            if (config.tutorialMethod) {
                this[config.tutorialMethod] = async () => {
                    return await this.shouldAutoStart(tutorialName, config.className);
                };
            }

            // Generate restart method
            if (config.restartMethod) {
                this[config.restartMethod] = async () => {
                    return await this.restartTutorial(tutorialName);
                };
            }
        });
    }

    // Initialize dynamic methods
    initialize() {
        this.generateTutorialMethods();
    }

    // Utility methods using registry
    getTutorialList() {
        return this.registry.getAllTutorials().map(tutorial => ({
            name: tutorial.name,
            class: tutorial.className,
            title: tutorial.title,
            description: tutorial.description,
            category: tutorial.category,
            estimatedTime: tutorial.estimatedTime,
            completed: this.registry.isTutorialCompleted(tutorial.name)
        }));
    }

    // Get tutorials by category
    getTutorialsByCategory(category) {
        return this.registry.getTutorialsByCategory(category);
    }

    // Get completion statistics
    getCompletionStats() {
        return this.registry.getCompletionStats();
    }

    // Check if specific tutorial is completed
    isTutorialCompleted(tutorialName) {
        return this.registry.isTutorialCompleted(tutorialName);
    }

    // Get next recommended tutorial
    getNextRecommendedTutorial() {
        const remaining = this.registry.getRemainingTutorials();
        if (remaining.length === 0) return null;
        
        // Return first tutorial in order, or could implement more sophisticated logic
        return remaining[0];
    }

    // Reset all tutorials
    resetAllTutorials() {
        this.registry.resetAllTutorials();
    }

    // Get tutorial by name
    getTutorial(name) {
        return this.registry.getTutorial(name);
    }

    // Registry management methods
    getRegistry() {
        return this.registry;
    }

    // Export tutorial data
    exportTutorialData() {
        return this.registry.exportRegistry();
    }
}

// Initialize tutorial manager and generate methods
const originalConstructor = TutorialManager.prototype.constructor;
TutorialManager.prototype.constructor = function(desktop) {
    originalConstructor.call(this, desktop);
    this.initialize();
};

// Maintain Tutorial as an alias for backwards compatibility
export const Tutorial = TutorialManager;

// Export BaseTutorial for backwards compatibility
export { BaseTutorial };

// Export tutorial registry for direct access
export { tutorialRegistry };