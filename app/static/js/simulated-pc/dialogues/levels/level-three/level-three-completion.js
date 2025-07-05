import { BaseDialogue } from '../../base-dialogue.js';

export class LevelThreeCompletionDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
        super(desktop, character);
        this.messages = [
            { text: 'Outstanding work, Agent! You\'ve successfully completed Level 3: Malware Mayhem. Your cybersecurity expertise has saved the gaming championship!' },
            { text: 'You demonstrated exceptional skills by identifying malicious processes, terminating threats, performing thorough malware scans, and recovering encrypted files using specialized decryption tools.' },
            { text: 'Your rapid response prevented a complete tournament shutdown. All encrypted championship data has been recovered, and the gaming event can continue as scheduled.' },
            { text: 'You\'ve earned 250 XP in Advanced Threat Response and unlocked the \'Malware Hunter\' and \'Data Recovery Specialist\' badges. Your comprehensive approach to malware incident response is exemplary.' },
            { text: 'Remember: Modern malware attacks often involve multiple stages - process infiltration, system compromise, data encryption, and ransom demands. Your systematic approach of process monitoring, malware scanning, and decryption was textbook perfect.' },
            { text: 'You\'re now ready for the most advanced cybersecurity challenges. Keep applying these multi-layered defense strategies to protect organizations from sophisticated cyber threats!' }
        ];
    }

    getCharacterName() {
        // Force return the instructor name if dialogue manager isn't working
        if (this.desktop?.dialogueManager) {
            const name = this.desktop.dialogueManager.getCharacterName(this.character);
            return name;
        }
        
        // Fallback to hardcoded instructor name
        return 'Dr. Cipher';
    }

    async onComplete() {
        // Mark Level 3 as completed and update progress
        localStorage.setItem('cyberquest_level_3_completed', 'true');
        localStorage.setItem('cyberquest_current_level', '4');
        
        // Award XP and badges
        const currentXP = parseInt(localStorage.getItem('cyberquest_xp_threat_response') || '0');
        localStorage.setItem('cyberquest_xp_threat_response', (currentXP + 250).toString());
        
        const badges = JSON.parse(localStorage.getItem('cyberquest_badges') || '[]');
        if (!badges.includes('malware-hunter')) {
            badges.push('malware-hunter');
        }
        if (!badges.includes('data-recovery-specialist')) {
            badges.push('data-recovery-specialist');
        }
        localStorage.setItem('cyberquest_badges', JSON.stringify(badges));
        
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
        return 'Complete Advanced Training';
    }

    static shouldAutoStart() {
        // Don't auto-start; only invoked manually after successful decryption
        return false;
    }
}
