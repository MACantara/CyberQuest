import { BaseDialogue } from '../base-dialogue.js';

export class WelcomeDialogue extends BaseDialogue {
    constructor(desktop, character = 'agent') {
        super(desktop, character);
        this.messages = [
            {
                text: "Welcome to CyberQuest, Agent! I'm your guide through this cybersecurity training simulation."
            },
            {
                text: "In this simulation, you'll learn to identify and respond to various cyber threats. Your decisions will determine the outcome of each mission."
            },
            {
                text: "You'll encounter phishing emails, suspicious files, network intrusions, and other security incidents. Stay alert and trust your training!"
            },
            {
                text: "Remember: In the real world, cybersecurity professionals are the first line of defense against digital threats. Your skills can protect organizations and people."
            },
            {
                text: "Are you ready to begin your cybersecurity training? Let's start with the basics and work our way up to advanced threat detection!"
            }
        ];
    }

    onComplete() {
        // Store completion in localStorage
        localStorage.setItem('cyberquest_welcome_dialogue_completed', 'true');
        
        // Start the initial tutorial after welcome
        if (this.desktop?.tutorialManager) {
            setTimeout(async () => {
                const shouldStart = await this.desktop.tutorialManager.shouldAutoStartInitial();
                if (shouldStart) {
                    await this.desktop.tutorialManager.startInitialTutorial();
                }
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Begin Training';
    }

    getSkipHandler() {
        return 'window.currentDialogue.showSkipModal()';
    }

    showSkipModal() {
        if (confirm('Are you sure you want to skip the welcome message? This introduces you to the cybersecurity training simulation.')) {
            this.complete();
        }
    }

    // Static methods
    static shouldAutoStart() {
        return !localStorage.getItem('cyberquest_welcome_dialogue_completed');
    }

    static restart() {
        localStorage.removeItem('cyberquest_welcome_dialogue_completed');
    }
}