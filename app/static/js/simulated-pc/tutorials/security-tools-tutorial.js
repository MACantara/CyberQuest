import { BaseTutorial } from '../base-tutorial.js';

export class SecurityToolsTutorial extends BaseTutorial {
    constructor(desktop) {
        super(desktop);
        this.steps = [
            {
                target: '#security-tools-title',
                title: 'Security Analysis Tools',
                content: 'Welcome to the Security Tools dashboard! This is your central hub for cybersecurity analysis and threat detection.',
                action: 'highlight',
                position: 'bottom'
            },
            {
                target: '#antivirus-tool',
                title: 'Antivirus Scanner',
                content: 'The Antivirus tool scans your system for known viruses and malware. It uses signature-based detection to identify threats.',
                action: 'pulse',
                position: 'right'
            },
            {
                target: '#malware-detector',
                title: 'Malware Detector',
                content: 'This advanced tool uses behavioral analysis to detect suspicious activities that might indicate malware presence, even if it\'s not in virus databases.',
                action: 'highlight',
                position: 'right'
            },
            {
                target: '#network-scanner',
                title: 'Network Scanner',
                content: 'Monitors your network for unusual traffic patterns, unauthorized connections, and potential intrusion attempts.',
                action: 'highlight',
                position: 'left'
            },
            {
                target: '#encryption-tool',
                title: 'Encryption Tool',
                content: 'Helps you encrypt sensitive files and communications to protect them from unauthorized access.',
                action: 'highlight',
                position: 'left'
            },
            {
                target: '#scan-results-title',
                title: 'Active Threat Monitoring',
                content: 'This section shows real-time scan results and detected threats. Always pay attention to these alerts!',
                action: 'highlight',
                position: 'top'
            },
            {
                target: '#suspicious-file-result',
                title: '⚠️ Suspicious File Alert',
                content: 'Yellow alerts indicate suspicious files that need investigation. These might be false positives, but should be checked carefully.',
                action: 'pulse',
                position: 'top'
            },
            {
                target: '#malware-result',
                title: '🚨 MALWARE DETECTED',
                content: 'RED ALERT! This indicates confirmed malware. Immediate action is required - isolate, analyze, and remove the threat!',
                action: 'pulse',
                position: 'top'
            },
            {
                target: '#security-tools-grid',
                title: 'Security Tools Complete',
                content: 'You now understand the essential security tools! Regular scanning, monitoring alerts, and quick response to threats are key to cybersecurity.',
                action: 'highlight',
                position: 'bottom',
                final: true
            }
        ];
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentStep = 0;
        
        // Wait for security tools to be fully loaded
        setTimeout(() => {
            this.createOverlay();
            this.showStep();
        }, 1000);
    }

    // Override base class methods
    getSkipTutorialHandler() {
        return 'window.securityToolsTutorial.showSkipModal()';
    }

    getPreviousStepHandler() {
        return 'window.securityToolsTutorial.previousStep()';
    }

    getNextStepHandler() {
        return 'window.securityToolsTutorial.nextStep()';
    }

    getFinalStepHandler() {
        return 'window.securityToolsTutorial.complete()';
    }

    getFinalButtonText() {
        return 'Finish Tutorial';
    }

    complete() {
        super.complete();
        
        // Store completion in localStorage
        localStorage.setItem('cyberquest_securitytools_tutorial_completed', 'true');
    }

    showSkipModal() {
        if (confirm('Are you sure you want to skip the security tools tutorial? This training is essential for understanding cybersecurity defense tools.')) {
            this.complete();
        }
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_securitytools_tutorial_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_securitytools_tutorial_completed');
    }
}