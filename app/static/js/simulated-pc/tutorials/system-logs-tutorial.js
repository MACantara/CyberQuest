import { BaseTutorial } from './base-tutorial.js';

export class SystemLogsTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '.bg-gray-700.p-2.border-b.border-gray-600',
                title: 'System Logs Toolbar',
                content: 'This toolbar helps you filter and manage system logs. You can filter by log level, source, category, and enable auto-refresh to monitor real-time events.',
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
                target: '#refresh-btn',
                title: 'Manual Refresh',
                content: 'Click to manually refresh the log entries and see the latest system events. Use this when auto-refresh is disabled.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#auto-refresh',
                title: 'Auto-Refresh Monitoring',
                content: 'Enable auto-refresh to continuously monitor new log entries as they appear. Essential for real-time threat detection.',
                action: 'pulse',
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
                content: 'This area displays all log entries. Look for color-coded severity levels: blue (INFO), yellow (WARNING), red (ERROR), and dark red (CRITICAL).',
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
                content: 'Excellent! You\'ve learned to analyze system logs effectively. Monitor logs regularly, investigate warnings promptly, and respond immediately to critical errors for robust cybersecurity.',
                action: 'highlight',
                position: 'left',
                final: true
            }
        ];
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        
        // Wait for system logs to be fully loaded
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
        }, 1000);
    }

    // Override to add system logs specific tutorial behaviors
    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        
        // Special handling for filter steps - ensure dropdowns are visible
        if (step.target.includes('filter')) {
            // Make sure the system logs app is active and filters are available
            const filterElement = document.querySelector(step.target);
            if (!filterElement) {
                // If filter not found, skip to next step
                this.nextStep();
                return;
            }
        }

        // Special handling for logs container - ensure some log entries exist
        if (step.target === '#logs-container') {
            const logsContainer = document.querySelector('#logs-container');
            if (logsContainer && logsContainer.children.length === 0) {
                // If no logs are visible, trigger refresh to show some entries
                const refreshBtn = document.querySelector('#refresh-btn');
                if (refreshBtn) {
                    refreshBtn.click();
                    // Wait a moment for logs to load
                    setTimeout(() => {
                        super.showStep();
                    }, 500);
                    return;
                }
            }
        }

        super.showStep();
    }

    // Override base class methods
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

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_systemlogs_tutorial_completed', 'true');
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_systemlogs_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_systemlogs_tutorial_completed');
    }
}