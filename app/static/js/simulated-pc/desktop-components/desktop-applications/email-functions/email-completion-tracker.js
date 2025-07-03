import { ALL_EMAILS } from './emails/email-registry.js';

export class EmailCompletionTracker {
    constructor(emailApp) {
        this.emailApp = emailApp;
        this.hasTriggeredCompletion = false;
        this.completionCheckInterval = null;
    }

    initialize() {
        // Start monitoring email completion status
        this.startCompletionMonitoring();
        
        // Listen for email action events
        this.bindCompletionEvents();
    }

    startCompletionMonitoring() {
        // Check completion status every few seconds
        this.completionCheckInterval = setInterval(() => {
            this.checkCompletionStatus();
        }, 3000);
    }

    bindCompletionEvents() {
        // Listen for email security events
        document.addEventListener('email-reported-phishing', () => {
            setTimeout(() => this.checkCompletionStatus(), 1000);
        });

        document.addEventListener('email-marked-legitimate', () => {
            setTimeout(() => this.checkCompletionStatus(), 1000);
        });

        document.addEventListener('email-moved-to-inbox', () => {
            setTimeout(() => this.checkCompletionStatus(), 1000);
        });
    }

    checkCompletionStatus() {
        if (this.hasTriggeredCompletion) return;

        const allEmailIds = ALL_EMAILS.map(email => email.id);
        const securityManager = this.emailApp.state.securityManager;
        
        // Check if all emails have been categorized
        const processedEmails = allEmailIds.filter(emailId => {
            const status = securityManager.getEmailStatus(emailId);
            return status === 'phishing' || status === 'legitimate';
        });

        const completionPercentage = (processedEmails.length / allEmailIds.length) * 100;
        
        // Trigger completion when all emails are processed
        if (completionPercentage === 100) {
            this.triggerLevelCompletion();
        }
    }

    triggerLevelCompletion() {
        if (this.hasTriggeredCompletion) return;
        
        this.hasTriggeredCompletion = true;
        
        // Stop monitoring
        if (this.completionCheckInterval) {
            clearInterval(this.completionCheckInterval);
            this.completionCheckInterval = null;
        }

        // Mark email training as completed
        localStorage.setItem('cyberquest_email_training_completed', 'true');
        
        // Delay before showing completion dialogue
        setTimeout(() => {
            this.showLevelCompletionDialogue();
        }, 2000);
    }

    showLevelCompletionDialogue() {
        // Import and trigger the Level 2 completion dialogue
        import('../../../dialogues/levels/level-two/email-security-completion-dialogue.js').then(module => {
            const EmailSecurityCompletionDialogue = module.EmailSecurityCompletionDialogue;
            if (EmailSecurityCompletionDialogue.startCompletionDialogue && window.desktop) {
                EmailSecurityCompletionDialogue.startCompletionDialogue(window.desktop);
            }
        }).catch(error => {
            console.error('Failed to load Level 2 completion dialogue:', error);
        });
    }

    // Get completion statistics
    getCompletionStats() {
        const allEmailIds = ALL_EMAILS.map(email => email.id);
        const securityManager = this.emailApp.state.securityManager;
        
        const stats = {
            totalEmails: allEmailIds.length,
            processedEmails: 0,
            phishingDetected: 0,
            legitimateConfirmed: 0,
            completionPercentage: 0
        };

        allEmailIds.forEach(emailId => {
            const status = securityManager.getEmailStatus(emailId);
            if (status === 'phishing') {
                stats.processedEmails++;
                stats.phishingDetected++;
            } else if (status === 'legitimate') {
                stats.processedEmails++;
                stats.legitimateConfirmed++;
            }
        });

        stats.completionPercentage = Math.round((stats.processedEmails / stats.totalEmails) * 100);
        
        return stats;
    }

    // Force completion check (for testing)
    forceCompletionCheck() {
        this.checkCompletionStatus();
    }

    // Reset completion tracking
    resetCompletion() {
        this.hasTriggeredCompletion = false;
        localStorage.removeItem('cyberquest_email_training_completed');
        
        if (!this.completionCheckInterval) {
            this.startCompletionMonitoring();
        }
    }

    // Cleanup when email app is closed
    cleanup() {
        if (this.completionCheckInterval) {
            clearInterval(this.completionCheckInterval);
            this.completionCheckInterval = null;
        }
        
        // Remove event listeners
        document.removeEventListener('email-reported-phishing', this.checkCompletionStatus);
        document.removeEventListener('email-marked-legitimate', this.checkCompletionStatus);
        document.removeEventListener('email-moved-to-inbox', this.checkCompletionStatus);
    }
}
