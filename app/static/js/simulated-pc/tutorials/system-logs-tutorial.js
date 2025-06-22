import { BaseTutorial } from '../base-tutorial.js';
import { SkipTutorialModal } from '../desktop-components/skip-tutorial-modal.js';

export class SystemLogsTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.skipTutorialModal = null;
        this.steps = [
            {
                target: '#logs-toolbar',
                title: 'System Logs Toolbar',
                content: 'This toolbar helps you filter and manage system logs. You can filter by log type (Security, Network, System) and refresh the view.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#log-filter',
                title: 'Log Filtering',
                content: 'Use this dropdown to filter logs by category. This helps you focus on specific types of events like security alerts or system errors.',
                action: 'pulse',
                position: 'bottom'
            },
            {
                target: '#log-headers',
                title: 'Log Entry Structure',
                content: 'Each log entry shows: Time (when it occurred), Level (severity), Message (what happened), and Source (which system component).',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#info-log',
                title: 'INFO Level Logs',
                content: 'Blue INFO logs show normal system operations. This indicates everything is working correctly - system startup completed successfully.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#warning-log',
                title: '⚠️ WARNING Level Logs',
                content: 'Yellow WARNING logs indicate potential issues that need attention. This shows suspicious network activity - investigate immediately!',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#error-log',
                title: '🚨 ERROR Level Logs',
                content: 'Red ERROR logs are critical security events! This shows a failed login attempt - could be a brute force attack. Take immediate action!',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#logs-container',
                title: 'Log Analysis Complete',
                content: 'You now understand system log analysis! Monitor logs regularly, investigate warnings promptly, and respond immediately to errors.',
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

    async showSkipModal() {
        if (!this.skipTutorialModal) {
            this.skipTutorialModal = new SkipTutorialModal(document.body);
        }
        
        const shouldSkip = await this.skipTutorialModal.show();
        if (shouldSkip) {
            this.complete();
        }
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_systemlogs_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_systemlogs_tutorial_completed');
    }
}