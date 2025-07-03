import { BaseTutorial } from '../base-tutorial.js';

export class ProcessMonitorTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '[data-app="process-monitor"]',
                title: 'Process Monitor',
                content: 'This is the Process Monitor application. It shows all running processes on the system and helps you identify potential security threats.',
                position: 'right',
                action: 'highlight'
            },
            {
                target: '.process-monitor .bg-gray-800:first-child',
                title: 'Control Panel',
                content: 'The control panel lets you refresh process data, pause real-time updates, and end suspicious processes.',
                position: 'bottom',
                action: 'highlight'
            },
            {
                target: '#cpu-usage',
                title: 'System Statistics',
                content: 'Monitor system resource usage including CPU, memory, active processes, and total threads.',
                position: 'bottom',
                action: 'pulse'
            },
            {
                target: '.process-row:first-child',
                title: 'Process List',
                content: 'Click on any process to view detailed information. Look for suspicious processes marked with warning icons.',
                position: 'right',
                action: 'pulse'
            },
            {
                target: '.sortable:first-child',
                title: 'Sorting',
                content: 'Click column headers to sort processes by name, CPU usage, memory consumption, or other attributes.',
                position: 'bottom',
                action: 'highlight'
            },
            {
                target: '#kill-process-btn',
                title: 'Process Control',
                content: 'Select a process and use this button to terminate it if it appears suspicious or consumes too many resources.',
                position: 'left',
                action: 'pulse'
            },
            {
                target: '.border-red-500',
                title: 'Security Alerts',
                content: 'Processes with red borders are flagged as potentially suspicious. These should be investigated carefully.',
                position: 'right',
                action: 'pulse',
                final: true
            }
        ];
    }

    async start() {
        // Ensure process monitor is open
        if (!this.desktop.windowManager.windows.has('process-monitor')) {
            // Open process monitor first
            const processMonitorApp = this.desktop.windowManager.applications.get('process-monitor');
            if (processMonitorApp) {
                await this.desktop.windowManager.openWindow('process-monitor', 'Process Monitor');
                
                // Wait a bit for the window to fully render
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Process Monitor application not found');
                return;
            }
        }

        // Start the tutorial
        this.createOverlay();
        this.isActive = true;
        window.currentTutorial = this;
        this.showStep();
    }

    complete() {
        super.complete();
        
        // Mark tutorial as completed
        localStorage.setItem('cyberquest_processmonitor_tutorial_completed', 'true');
        
        // Show completion message
        this.showCompletionMessage();
    }

    showCompletionMessage() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gray-800 border border-green-500 rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-cpu text-4xl text-green-400 mb-4"></i>
                    <h2 class="text-xl font-bold text-green-400 mb-4">Tutorial Complete!</h2>
                    <p class="text-gray-300 mb-4">
                        You've learned how to use the Process Monitor to identify and manage system processes. 
                        This is essential for detecting malware and managing system performance.
                    </p>
                    <div class="bg-green-900 border border-green-700 rounded p-3 mb-4">
                        <h4 class="text-green-400 font-semibold mb-2">Key Skills Learned:</h4>
                        <ul class="text-green-300 text-sm text-left list-disc pl-4">
                            <li>Monitoring system processes and resource usage</li>
                            <li>Identifying suspicious or malicious processes</li>
                            <li>Terminating problematic processes</li>
                            <li>Understanding process priorities and status</li>
                        </ul>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors cursor-pointer">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Override base class methods
    getSkipTutorialHandler() {
        return 'window.processMonitorTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.processMonitorTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.processMonitorTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.processMonitorTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    // Static methods for auto-start functionality
    static shouldAutoStart() {
        const tutorialCompleted = localStorage.getItem('cyberquest_processmonitor_tutorial_completed');
        const processMonitorOpened = localStorage.getItem('cyberquest_process_monitor_opened');
        return processMonitorOpened && !tutorialCompleted;
    }

    static startTutorial(desktop) {
        const tutorial = new ProcessMonitorTutorial(desktop);
        window.processMonitorTutorial = tutorial;
        tutorial.start();
    }

    static restart() {
        localStorage.removeItem('cyberquest_processmonitor_tutorial_completed');
        localStorage.removeItem('cyberquest_process_monitor_opened');
    }
}
