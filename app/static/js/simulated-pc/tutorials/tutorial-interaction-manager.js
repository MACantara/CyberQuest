export class TutorialInteractionManager {
    constructor() {
        this.isActive = false;
        this.preventContextMenu = this.preventContextMenu.bind(this);
        this.preventKeyboardShortcuts = this.preventKeyboardShortcuts.bind(this);
        this.preventDragDrop = this.preventDragDrop.bind(this);
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
    }

    // Disable tutorial mode - re-enable all interactions
    disableTutorialMode() {
        if (!this.isActive) return;
        
        this.isActive = false;
        document.body.classList.remove('tutorial-mode-active');
        
        // Re-enable right-click context menu
        document.removeEventListener('contextmenu', this.preventContextMenu, true);
        
        // Re-enable keyboard shortcuts
        document.removeEventListener('keydown', this.preventKeyboardShortcuts, true);
        
        // Re-enable drag and drop
        document.removeEventListener('dragstart', this.preventDragDrop, true);
        document.removeEventListener('drop', this.preventDragDrop, true);
    }

    // Prevent context menu during tutorial
    preventContextMenu(e) {
        // Allow context menu only on tutorial elements
        if (!e.target.closest('.tutorial-tooltip') && !e.target.closest('.tutorial-highlight')) {
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
        if (!e.target.closest('.tutorial-tooltip')) {
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
