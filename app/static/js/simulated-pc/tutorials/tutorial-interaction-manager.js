export class TutorialInteractionManager {
    constructor() {
        this.isActive = false;
        this.allowedElements = new Set();
        this.preventContextMenu = this.preventContextMenu.bind(this);
        this.preventKeyboardShortcuts = this.preventKeyboardShortcuts.bind(this);
        this.preventDragDrop = this.preventDragDrop.bind(this);
        this.preventClicks = this.preventClicks.bind(this);
        this.initializeCSS();
    }

    initializeCSS() {
        // Add tutorial CSS styles to the page
        if (document.getElementById('tutorial-interaction-styles')) return;

        const tutorialStyles = document.createElement('style');
        tutorialStyles.id = 'tutorial-interaction-styles';
        tutorialStyles.textContent = `
            .tutorial-highlight {
                animation: tutorial-glow 2s ease-in-out infinite alternate;
                border: 2px solid #10b981 !important;
                border-radius: 8px !important;
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.6) !important;
            }
            
            .tutorial-pulse {
                animation: tutorial-pulse 1.5s ease-in-out infinite;
            }
            
            @keyframes tutorial-glow {
                from {
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
                }
                to {
                    box-shadow: 0 0 30px rgba(16, 185, 129, 0.9), 0 0 40px rgba(16, 185, 129, 0.6);
                }
            }
            
            @keyframes tutorial-pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
            
            .tutorial-tooltip {
                backdrop-filter: blur(10px);
                border: 1px solid rgba(16, 185, 129, 0.3);
                background: rgba(31, 41, 55, 0.95);
                z-index: 9999 !important;
            }
            
            .tutorial-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
            }
            
            .tutorial-btn-secondary:hover {
                transform: translateY(-1px);
            }
            
            .tutorial-close:hover {
                text-decoration: underline;
            }
            
            /* Tutorial overlay positioning */
            .tutorial-overlay {
                z-index: 50 !important;
                pointer-events: none !important;
            }
            
            /* Ensure tutorial target windows appear above overlay */
            .tutorial-mode-active .window {
                position: relative;
            }
            
            /* Disable interactions during tutorial */
            .tutorial-mode-active .window-header {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .window-controls {
                pointer-events: none !important;
            }
            
            .tutorial-mode-active .resize-handle {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .taskbar-button {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .start-button {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .desktop-icon {
                pointer-events: none !important;
                cursor: default !important;
            }
            
            .tutorial-mode-active .window-content {
                pointer-events: none !important;
            }
            
            /* Allow tutorial elements to be interactive */
            .tutorial-mode-active .tutorial-tooltip {
                pointer-events: auto !important;
                z-index: 9999 !important;
            }
            
            .tutorial-mode-active .tutorial-tooltip * {
                pointer-events: auto !important;
            }
            
            .tutorial-mode-active .tutorial-overlay {
                pointer-events: auto !important;
            }
            
            /* Allow highlighted elements to be interactive if needed */
            .tutorial-mode-active .tutorial-highlight {
                pointer-events: auto !important;
            }
            
            /* Allow interactive tutorial elements */
            .tutorial-mode-active .tutorial-interactive-allowed {
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(tutorialStyles);
    }

    // Enable tutorial mode - disable all interactions
    enableTutorialMode() {
        if (this.isActive) return;
        
        this.isActive = true;
        document.body.classList.add('tutorial-mode-active');
        
        // Disable right-click context menu during tutorial
        document.addEventListener('contextmenu', this.preventContextMenu, true);
        
        // Disable keyboard shortcuts during tutorial
        document.addEventListener('keydown', this.preventKeyboardShortcuts, true);
        
        // Disable drag and drop during tutorial
        document.addEventListener('dragstart', this.preventDragDrop, true);
        document.addEventListener('drop', this.preventDragDrop, true);
        
        // Disable clicks except on allowed elements
        document.addEventListener('click', this.preventClicks, true);
        document.addEventListener('mousedown', this.preventClicks, true);
        document.addEventListener('mouseup', this.preventClicks, true);
    }

    // Disable tutorial mode - re-enable all interactions
    disableTutorialMode() {
        if (!this.isActive) return;
        
        this.isActive = false;
        document.body.classList.remove('tutorial-mode-active');
        
        // Clear allowed elements
        this.allowedElements.clear();
        
        // Re-enable right-click context menu
        document.removeEventListener('contextmenu', this.preventContextMenu, true);
        
        // Re-enable keyboard shortcuts
        document.removeEventListener('keydown', this.preventKeyboardShortcuts, true);
        
        // Re-enable drag and drop
        document.removeEventListener('dragstart', this.preventDragDrop, true);
        document.removeEventListener('drop', this.preventDragDrop, true);
        
        // Re-enable clicks
        document.removeEventListener('click', this.preventClicks, true);
        document.removeEventListener('mousedown', this.preventClicks, true);
        document.removeEventListener('mouseup', this.preventClicks, true);
    }

    // Allow interactions for a specific element
    allowInteractionFor(element) {
        if (element) {
            this.allowedElements.add(element);
            element.classList.add('tutorial-interactive-allowed');
        }
    }

    // Remove interaction allowance for a specific element
    disallowInteractionFor(element) {
        if (element) {
            this.allowedElements.delete(element);
            element.classList.remove('tutorial-interactive-allowed');
        }
    }

    // Clear all allowed interactions
    clearAllowedInteractions() {
        this.allowedElements.forEach(element => {
            element.classList.remove('tutorial-interactive-allowed');
        });
        this.allowedElements.clear();
    }

    // Check if an element or its ancestors are allowed to interact
    isInteractionAllowed(element) {
        if (!element) return false;
        
        // Check if the element itself is allowed
        if (this.allowedElements.has(element)) return true;
        
        // Check if any parent element is allowed
        let currentElement = element.parentElement;
        while (currentElement) {
            if (this.allowedElements.has(currentElement)) return true;
            currentElement = currentElement.parentElement;
        }
        
        // Always allow tutorial tooltip interactions
        if (element.closest('.tutorial-tooltip')) return true;
        
        // Always allow interactions with highlighted tutorial elements
        if (element.classList.contains('tutorial-interactive') || 
            element.classList.contains('tutorial-highlight')) return true;
        
        return false;
    }

    // Prevent clicks except on allowed elements
    preventClicks(e) {
        if (!this.isInteractionAllowed(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    // Prevent context menu during tutorial
    preventContextMenu(e) {
        // Allow context menu only on tutorial elements or allowed elements
        if (!this.isInteractionAllowed(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    // Prevent keyboard shortcuts during tutorial
    preventKeyboardShortcuts(e) {
        // Allow only basic navigation keys and tutorial-specific keys
        const allowedKeys = [
            'Tab', 'Shift', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown', 
            'ArrowLeft', 'ArrowRight', 'Space'
        ];
        
        // Block Ctrl/Cmd combinations except for basic text editing
        if ((e.ctrlKey || e.metaKey) && !['c', 'v', 'a', 'x'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Block Alt combinations
        if (e.altKey && !allowedKeys.includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Block F keys (except F5 for refresh in development)
        if (e.key.startsWith('F') && e.key !== 'F5') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    // Prevent drag and drop during tutorial
    preventDragDrop(e) {
        if (!this.isInteractionAllowed(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    // Get current tutorial mode state
    isTutorialModeActive() {
        return this.isActive;
    }

    // Cleanup method
    cleanup() {
        this.disableTutorialMode();
    }

    // Static method to create or get singleton instance
    static getInstance() {
        if (!TutorialInteractionManager._instance) {
            TutorialInteractionManager._instance = new TutorialInteractionManager();
        }
        return TutorialInteractionManager._instance;
    }
}

// Export singleton instance
export const tutorialInteractionManager = TutorialInteractionManager.getInstance();

// Export class for testing/custom instances
export default TutorialInteractionManager;
