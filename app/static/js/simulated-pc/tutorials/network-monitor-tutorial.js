import { BaseTutorial } from '../base-tutorial.js';
import { SkipTutorialModal } from '../desktop-components/skip-tutorial-modal.js';

export class NetworkMonitorTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.skipTutorialModal = null;
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
                target: '#packet-headers',
                title: 'Packet Information Headers',
                content: 'These columns show packet details: Time (when sent), Source (sender IP), Destination (receiver IP), Protocol (communication type), and Info (packet contents).',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#normal-packet-1',
                title: 'Normal Network Traffic',
                content: 'This is normal DNS traffic - your computer asking Google\'s DNS server (8.8.8.8) to resolve "google.com". This type of traffic is completely normal.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#malicious-packet',
                title: '🚨 MALICIOUS TRAFFIC DETECTED',
                content: 'ALERT! This packet shows suspicious activity - someone is trying to download malware.exe from a malicious site. Notice the red highlighting indicating danger!',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#normal-packet-2',
                title: 'Normal TCP Traffic',
                content: 'This is normal TCP acknowledgment traffic between your router (192.168.1.1) and your computer. Green indicates safe, standard network communication.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#packet-list',
                title: 'Network Security Complete',
                content: 'You\'ve learned to identify malicious network traffic! Watch for suspicious destinations, unusual file downloads, and unexpected connections.',
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
        return !localStorage.getItem('cyberquest_networkmonitor_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_networkmonitor_tutorial_completed');
    }
}