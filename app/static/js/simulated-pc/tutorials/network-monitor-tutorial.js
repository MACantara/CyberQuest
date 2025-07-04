import { BaseTutorial } from './base-tutorial.js';

export class NetworkMonitorTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '#network-toolbar',
                title: 'Network Monitor Toolbar',
                content: 'This toolbar controls network packet capture. The "Live Capture" button starts monitoring network traffic in real-time.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#live-capture-btn',
                title: 'Live Capture Control',
                content: 'Click "Live Capture" to start monitoring network traffic. This shows all data packets flowing through your network connection.',
                action: 'pulse',
                position: 'bottom'
            },
            {
                target: '#filters-btn',
                title: 'Packet Filtering',
                content: 'Use filters to focus on specific types of network traffic. This helps identify suspicious activity among normal network communications.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#statistics-btn',
                title: 'Network Statistics',
                content: 'View network statistics to analyze traffic patterns and identify potential security threats or network anomalies.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#clear-packets-btn',
                title: 'Clear Packet History',
                content: 'Use this button to clear the packet history when you need a fresh start for monitoring new network activity.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#packet-headers',
                title: 'Packet Information Headers',
                content: 'These columns show packet details: Time (when sent), Source (sender IP), Destination (receiver IP), Protocol (communication type), and Info (packet contents).',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#packet-data',
                title: 'Packet Analysis Area',
                content: 'This area displays captured network packets. Look for suspicious destinations, unusual protocols, or unexpected file transfers that could indicate security threats.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#packet-list',
                title: 'Network Security Complete!',
                content: 'Excellent! You\'ve learned to use network monitoring tools. Watch for red-highlighted suspicious traffic, unusual destinations, and unexpected protocols to identify security threats.',
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
        
        // Wait for network monitor to be fully loaded
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
        }, 1000);
    }

    // Override to add network monitor specific tutorial behaviors
    showStep() {
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[this.currentStep];
        
        // Special handling for live capture step - ensure capture is ready
        if (step.target === '#live-capture-btn') {
            // Make sure the network monitor is ready for capture
            const captureBtn = document.querySelector('#live-capture-btn');
            if (captureBtn && captureBtn.textContent.includes('Stop')) {
                // If already capturing, that's fine - continue with tutorial
            }
        }

        // Special handling for packet data area - ensure it's visible
        if (step.target === '#packet-data') {
            const packetData = document.querySelector('#packet-data');
            if (packetData && packetData.querySelector('.text-center')) {
                // If showing initial message, that's expected - continue
            }
        }

        super.showStep();
    }

    // Override base class methods
    getSkipTutorialHandler() {
        return 'window.networkMonitorTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.networkMonitorTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.networkMonitorTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.networkMonitorTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_networkmonitor_tutorial_completed', 'true');
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_networkmonitor_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_networkmonitor_tutorial_completed');
    }
}