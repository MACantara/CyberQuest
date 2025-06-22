import { BaseDialogue } from '../base-dialogue.js';

export class TutorialIntroDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            {
                text: "Hello! I'm Dr. Cipher, your cybersecurity instructor. Before we dive into real scenarios, let me show you around the system."
            },
            {
                text: "This desktop simulation contains all the tools a cybersecurity professional uses daily: email clients, terminals, network monitors, and security scanners."
            },
            {
                text: "Each application serves a specific purpose in threat detection and response. You'll learn when and how to use each one effectively."
            },
            {
                text: "I'll guide you through interactive tutorials for each tool. Pay attention to the visual cues - they'll help you identify threats in real scenarios."
            },
            {
                text: "Don't worry if you make mistakes - this is a safe learning environment. In fact, making mistakes here helps you avoid them in the real world."
            },
            {
                text: "Ready to start your guided tour? We'll begin with the basics and gradually introduce more advanced concepts."
            }
        ];
    }

    onComplete() {
        // Store completion in localStorage
        localStorage.setItem('cyberquest_tutorial_intro_completed', 'true');
        
        // Start the initial tutorial
        if (this.desktop?.tutorialManager) {
            setTimeout(async () => {
                await this.desktop.tutorialManager.startInitialTutorial();
            }, 500);
        }
    }

    getFinalButtonText() {
        return 'Start Tutorial';
    }

    showSkipModal() {
        if (confirm('Are you sure you want to skip the tutorial introduction? This explains how the training system works.')) {
            this.complete();
        }
    }

    // Static methods
    static shouldAutoStart() {
        // Auto-start if welcome is done but tutorial intro is not
        const welcomeDone = localStorage.getItem('cyberquest_welcome_dialogue_completed');
        const tutorialIntroDone = localStorage.getItem('cyberquest_tutorial_intro_completed');
        return welcomeDone && !tutorialIntroDone;
    }

    static restart() {
        localStorage.removeItem('cyberquest_tutorial_intro_completed');
    }
}