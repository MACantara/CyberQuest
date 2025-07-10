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
        
        // Show shutdown sequence before navigation
        await this.showShutdownSequenceAndNavigate();
    }

    async showShutdownSequenceAndNavigate() {
        // Create shutdown overlay
        const shutdownOverlay = document.createElement('div');
        shutdownOverlay.className = 'fixed inset-0 bg-black z-50';
        shutdownOverlay.style.zIndex = '9999';
        document.body.appendChild(shutdownOverlay);
        
        try {
            // Import and run shutdown sequence
            const { ShutdownSequence } = await import('../../../shutdown-sequence.js');
            
            // Run shutdown sequence
            await ShutdownSequence.runShutdown(shutdownOverlay);
            
            // After shutdown completes, navigate to levels overview
            this.navigateToLevelsOverview();
            
        } catch (error) {
            console.error('Failed to run shutdown sequence:', error);
            // Fallback to direct navigation if shutdown fails
            setTimeout(() => {
                this.navigateToLevelsOverview();
            }, 1000);
        } finally {
            // Clean up shutdown overlay
            if (shutdownOverlay.parentNode) {
                shutdownOverlay.remove();
            }
        }
    }

    navigateToLevelsOverview() {
        // Navigate to levels overview in the actual browser (not simulated browser)
        window.location.href = '/levels';
    }

    getFinalButtonText() {
        return 'Continue to Advanced Training';
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

    static shouldAutoStart() {
        const levelCompleted = localStorage.getItem('cyberquest_level_3_completed');
        const decryptionCompleted = localStorage.getItem('cyberquest_level_3_decryption_completed');
        return decryptionCompleted && !levelCompleted;
    }
}
