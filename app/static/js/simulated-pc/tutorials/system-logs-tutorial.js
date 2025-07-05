import { BaseTutorial } from './base-tutorial.js';
import { tutorialInteractionManager } from './tutorial-interaction-manager.js';

export class SystemLogsTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '.bg-gray-700.p-2.border-b.border-gray-600',
                title: 'System Logs Toolbar',
                content: 'This toolbar helps you filter and manage system logs. You can filter by log level, source, and category to focus on specific types of events.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#level-filter',
                title: 'Log Level Filtering',
                content: 'Use this dropdown to filter logs by severity level. Critical and Error logs indicate serious issues that need immediate attention.',
                action: 'pulse',
                position: 'bottom'
            },
            {
                target: '#source-filter',
                title: 'Source Filtering',
                content: 'Filter logs by source component: System (general operations), Security (threats and access), or Network (connectivity issues).',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#category-filter',
                title: 'Category Filtering',
                content: 'Filter by specific event categories like authentication attempts, malware detection, or service operations for focused analysis.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#log-headers',
                title: 'Log Entry Structure',
                content: 'Each log entry shows: Timestamp (when it occurred), Level (severity), Source (system component), Category (event type), Message (description), and Details (additional info).',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#logs-container',
                title: 'Log Entries Display',
                content: 'This area displays all log entries from system activities. Look for color-coded severity levels: blue (INFO), yellow (WARNING), red (ERROR), and dark red (CRITICAL).',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '.bg-gray-700.p-2.border-t.border-gray-600',
                title: 'Status Bar Information',
                content: 'The status bar shows log counts by type and the last update time. Monitor error and warning counts to gauge system health.',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '#logs-container',
                title: 'System Logs Analysis Complete!',
                content: 'Excellent! You\'ve learned to analyze system logs effectively: filtering by severity levels, monitoring different sources, analyzing log structures, and tracking system health indicators. Monitor logs regularly and investigate warnings promptly for robust cybersecurity!',
                action: 'highlight',
                position: 'left',
                final: true
            }
        ];
    }

    async start() {
        // Ensure system logs is open
        if (!this.desktop.windowManager.windows.has('system-logs')) {
            try {
                await this.desktop.windowManager.openSystemLogs();
                // Wait for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('System Logs application not found:', error);
                return;
            }
        }

        // Initialize CSS first
        this.initializeCSS();
        
        // Enable tutorial mode
        tutorialInteractionManager.enableTutorialMode();
        
        // Set tutorial state
        this.isActive = true;
        this.stepManager.reset();
        
        // Create overlay before showing any steps
        this.createOverlay();
        
        // Ensure system logs window is in front
        this.ensureSystemLogsInFront();
        
        // Set global reference
        window.systemLogsTutorial = this;
        window.currentTutorial = this;
        
        // Wait for system logs to be fully loaded and then start showing steps
        setTimeout(() => {
            this.showStep();
        }, 1000);
    }

    ensureSystemLogsInFront() {
        const systemLogsWindow = document.querySelector('.window[data-window-id="system-logs"]') || 
                                document.querySelector('.window .system-logs') ||
                                document.querySelector('[id*="system-logs"]')?.closest('.window');
        
        if (systemLogsWindow) {
            systemLogsWindow.style.zIndex = '51';
            systemLogsWindow.style.position = 'relative';
        }
    }

    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        let target = document.querySelector(step.target);
        
        // Special handling for filter steps - ensure dropdowns are visible
        if (step.target.includes('filter')) {
            // Make sure the system logs app is active and filters are available
            const filterElement = document.querySelector(step.target);
            if (!filterElement) {
                // If filter not found, skip to next step
                this.nextStep();
                return;
            }
            target = filterElement;
        }

        // Special handling for logs container - logs are populated by real activity only
        if (step.target === '#logs-container') {
            const logsContainer = document.querySelector('#logs-container');
            if (logsContainer && logsContainer.children.length === 0) {
                // No need to trigger refresh since auto-refresh is removed
                // Logs will appear naturally from system activities
            }
            target = logsContainer;
        }
        
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

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_systemlogs_tutorial_completed', 'true');
    }

    // Override base class methods for proper tutorial flow
    getSkipTutorialHandler() {
        return 'window.systemLogsTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.systemLogsTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.systemLogsTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.systemLogsTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    // Static methods for auto-start functionality
    static shouldAutoStart() {
        const tutorialCompleted = localStorage.getItem('cyberquest_systemlogs_tutorial_completed');
        const systemLogsOpened = localStorage.getItem('cyberquest_systemlogs_opened');
        
        return systemLogsOpened && !tutorialCompleted;
    }

    static startTutorial(desktop) {
        console.log('Starting System Logs tutorial...');
        const tutorial = new SystemLogsTutorial(desktop);
        window.systemLogsTutorial = tutorial;
        tutorial.start();
        return tutorial;
    }

    static restart() {
        localStorage.removeItem('cyberquest_systemlogs_tutorial_completed');
        localStorage.removeItem('cyberquest_systemlogs_opened');
    }
}