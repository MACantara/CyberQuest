import { BaseDialogue } from '../../../dialogues/base-dialogue.js';
import { EmailSessionSummary } from '../../../desktop-components/desktop-applications/email-functions/email-session-summary.js';

export class EmailSecurityCompletionDialogue extends BaseDialogue {
    constructor(desktop, character = 'instructor') {
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
        
        // Show email session summary
        this.showEmailSessionSummary();
        
        // Navigate back to main dashboard after a delay
        setTimeout(() => {
            if (this.desktop?.windowManager) {
                try {
                    const browserApp = this.desktop.windowManager.applications.get('browser');
                    if (browserApp) {
                        browserApp.navigation.navigateToUrl('https://cyberquest.com');
                    }
                } catch (error) {
                    console.error('Failed to navigate to dashboard:', error);
                }
            }
        }, 1000);
    }

    showEmailSessionSummary() {
        try {
            // Get session stats from localStorage
            const sessionStats = this.getStoredSessionStats();
            const feedbackHistory = this.getStoredFeedbackHistory();
            
            // Create a temporary email session summary instance
            const sessionSummary = new EmailSessionSummary(null);
            sessionSummary.showSessionSummary(sessionStats, feedbackHistory);
        } catch (error) {
            console.error('Failed to show email session summary:', error);
        }
    }

    getStoredSessionStats() {
        // Reconstruct session stats from stored data
        const emailTrainingScore = parseInt(localStorage.getItem('cyberquest_email_training_score') || '0');
        const phishingReports = JSON.parse(localStorage.getItem('cyberquest_email_phishing_reports') || '[]');
        const legitimateMarks = JSON.parse(localStorage.getItem('cyberquest_email_legitimate_marks') || '[]');
        
        const totalActions = phishingReports.length + legitimateMarks.length;
        const correctActions = Math.round((emailTrainingScore / 100) * totalActions);
        
        return {
            accuracy: emailTrainingScore,
            totalActions: totalActions,
            correctActions: correctActions,
            totalReported: phishingReports.length,
            totalLegitimate: legitimateMarks.length
        };
    }

    getStoredFeedbackHistory() {
        // Try to get feedback history from localStorage
        const feedbackHistory = JSON.parse(localStorage.getItem('cyberquest_email_feedback_history') || '[]');
        
        // If no stored history, create a basic one from security manager data
        if (feedbackHistory.length === 0) {
            const phishingReports = JSON.parse(localStorage.getItem('cyberquest_email_phishing_reports') || '[]');
            const legitimateMarks = JSON.parse(localStorage.getItem('cyberquest_email_legitimate_marks') || '[]');
            
            const mockHistory = [];
            phishingReports.forEach((emailId, index) => {
                mockHistory.push({
                    emailId: emailId,
                    timestamp: new Date().toISOString(),
                    playerAction: 'report',
                    isSuspicious: true,
                    isCorrect: true,
                    emailSender: `sender_${index}@example.com`,
                    emailSubject: `Suspicious Email ${index + 1}`
                });
            });
            
            legitimateMarks.forEach((emailId, index) => {
                mockHistory.push({
                    emailId: emailId,
                    timestamp: new Date().toISOString(),
                    playerAction: 'trust',
                    isSuspicious: false,
                    isCorrect: true,
                    emailSender: `legitimate_${index}@company.com`,
                    emailSubject: `Business Email ${index + 1}`
                });
            });
            
            return mockHistory;
        }
        
        return feedbackHistory;
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
