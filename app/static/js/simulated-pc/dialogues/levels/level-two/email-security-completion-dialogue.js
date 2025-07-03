import { BaseDialogue } from '../../../base-dialogue.js';

export class EmailSecurityCompletionDialogue extends BaseDialogue {
    constructor(desktop, character = 'security-analyst') {
        super(desktop, character);
        this.messages = [
            {
                text: "Outstanding work, Agent! You've successfully completed Level 2: Shadow Inbox. Your email security analysis skills are now at professional level."
            },
            {
                text: "You've demonstrated exceptional ability to identify sophisticated phishing attempts, distinguish legitimate communications, and protect sensitive information from cybercriminals."
            },
            {
                text: "Your analysis helped prevent multiple potential security breaches. You correctly identified advanced threats including spear-phishing, credential harvesting, and social engineering attacks."
            },
            {
                text: "You've earned 150 XP in Cybersecurity and unlocked the 'Email Security Expert' badge. These skills are crucial for protecting both personal and organizational digital assets."
            },
            {
                text: "Remember: Email remains the primary attack vector for cybercriminals. Your vigilance and expertise in email security make you a valuable defender against digital threats."
            },
            {
                text: "You're now ready for advanced cybersecurity challenges. Keep applying these skills - verify sender authenticity, scrutinize links and attachments, and help others recognize email-based threats!"
            }
        ];
    }

    async onComplete() {
        // Mark Level 2 as completed and update progress
        localStorage.setItem('cyberquest_level_2_completed', 'true');
        localStorage.setItem('cyberquest_current_level', '3');
        
        // Award XP and badges
        const currentXP = parseInt(localStorage.getItem('cyberquest_xp_cybersecurity') || '0');
        localStorage.setItem('cyberquest_xp_cybersecurity', (currentXP + 150).toString());
        
        const badges = JSON.parse(localStorage.getItem('cyberquest_badges') || '[]');
        if (!badges.includes('email-security-expert')) {
            badges.push('email-security-expert');
            localStorage.setItem('cyberquest_badges', JSON.stringify(badges));
        }
        
        // Navigate back to main dashboard
        if (this.desktop?.windowManager) {
            try {
                const browserApp = this.desktop.windowManager.applications.get('browser');
                if (browserApp) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    browserApp.navigation.navigateToUrl('https://cyberquest.com');
                }
            } catch (error) {
                console.error('Failed to navigate to dashboard:', error);
            }
        }
    }

    getFinalButtonText() {
        return 'Continue Advanced Training';
    }

    static shouldAutoStart() {
        const levelCompleted = localStorage.getItem('cyberquest_level_2_completed');
        const allEmailsProcessed = localStorage.getItem('cyberquest_email_training_completed');
        return allEmailsProcessed && !levelCompleted;
    }

    static startCompletionDialogue(desktop) {
        const dialogue = new EmailSecurityCompletionDialogue(desktop);
        dialogue.start();
    }
}
