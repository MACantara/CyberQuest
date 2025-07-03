import { ALL_EMAILS } from './emails/email-registry.js';

export class EmailActionHandler {
    constructor(emailApp) {
        this.emailApp = emailApp;
    }

    // Handle reporting an email as phishing
    reportPhishingEmail(emailId) {
        const email = ALL_EMAILS.find(e => e.id === emailId);
        if (!email) return;

        // Show confirmation modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-shield-exclamation text-4xl text-red-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-gray-900 mb-4">Report Phishing Email</h2>
                    <p class="text-gray-700 mb-4">
                        Are you sure you want to report this email from <strong>${email.sender}</strong> as phishing?
                    </p>
                    <p class="text-sm text-gray-600 mb-6">
                        This will flag the email as dangerous and help protect other users.
                    </p>
                    <div class="flex space-x-3 justify-center">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors">
                            Cancel
                        </button>
                        <button onclick="window.emailActionHandler?.confirmPhishingReport('${emailId}'); this.closest('.fixed').remove()" 
                                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                            Report Phishing
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Confirm phishing report and execute the action
    confirmPhishingReport(emailId) {
        this.emailApp.state.reportAsPhishing(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-reported-phishing', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        this.showActionFeedback('Email reported as phishing and moved to spam!', 'success');
        this.emailApp.updateContent();
        
        // Automatically redirect to inbox after reporting phishing
        setTimeout(() => {
            this.emailApp.state.setFolder('inbox');
            this.emailApp.state.selectEmail(null);
            this.emailApp.updateContent();
        }, 1500);
    }

    // Handle marking an email as legitimate
    markEmailAsLegitimate(emailId) {
        const email = ALL_EMAILS.find(e => e.id === emailId);
        if (!email) return;

        this.emailApp.state.markAsLegitimate(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-marked-legitimate', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        this.showActionFeedback('Email marked as legitimate!', 'success');
        this.emailApp.updateContent();
    }

    // Handle moving an email from spam back to inbox
    moveEmailToInbox(emailId) {
        const email = ALL_EMAILS.find(e => e.id === emailId);
        if (!email) return;

        this.emailApp.state.moveToInbox(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-moved-to-inbox', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        this.showActionFeedback('Email moved back to inbox!', 'success');
        this.emailApp.updateContent();
    }

    // Show toast notification for user feedback
    showActionFeedback(message, type) {
        // Remove any existing toasts first
        const existingToasts = document.querySelectorAll('.email-action-toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `email-action-toast fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transform', 'translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Handle email opening actions
    handleEmailOpen(emailId) {
        this.emailApp.state.selectEmail(emailId);
        // Mark as read
        this.emailApp.readEmails.add(emailId);
        
        // Store read status in localStorage
        const readEmails = JSON.parse(localStorage.getItem('cyberquest_read_emails') || '[]');
        if (!readEmails.includes(emailId)) {
            readEmails.push(emailId);
            localStorage.setItem('cyberquest_read_emails', JSON.stringify(readEmails));
        }
        
        // Find the email and emit event for network monitoring
        const email = ALL_EMAILS.find(e => e.id === emailId);
        if (email) {
            document.dispatchEvent(new CustomEvent('email-opened', {
                detail: { 
                    sender: email.sender, 
                    subject: email.subject,
                    suspicious: email.suspicious 
                }
            }));
        }
        
        this.emailApp.updateContent();
    }

    // Handle folder switching
    handleFolderSwitch(folderId) {
        this.emailApp.state.setFolder(folderId);
        this.emailApp.updateContent();
    }

    // Handle back navigation
    handleBackNavigation() {
        this.emailApp.state.selectEmail(null);
        this.emailApp.updateContent();
    }

    // Load read email status from localStorage
    loadReadEmailStatus() {
        const readEmails = JSON.parse(localStorage.getItem('cyberquest_read_emails') || '[]');
        readEmails.forEach(emailId => {
            this.emailApp.readEmails.add(emailId);
        });
    }

    // Save read email status to localStorage
    saveReadEmailStatus() {
        const readEmailsArray = Array.from(this.emailApp.readEmails);
        localStorage.setItem('cyberquest_read_emails', JSON.stringify(readEmailsArray));
    }

    // Check if all emails have been processed (opened and categorized)
    checkEmailCompletionStatus() {
        const allEmailIds = ALL_EMAILS.map(email => email.id);
        const processedEmails = allEmailIds.filter(emailId => {
            const status = this.emailApp.state.getEmailStatus(emailId);
            return status === 'phishing' || status === 'legitimate';
        });
        
        // If all emails have been categorized, show completion dialogue
        if (processedEmails.length === allEmailIds.length) {
            this.showCompletionDialogue();
        }
        
        return {
            total: allEmailIds.length,
            processed: processedEmails.length,
            percentage: Math.round((processedEmails.length / allEmailIds.length) * 100)
        };
    }

    // Show completion dialogue when all emails are processed
    showCompletionDialogue() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="text-center">
                    <i class="bi bi-trophy text-6xl text-yellow-500 mb-4"></i>
                    <h2 class="text-xl font-bold text-green-600 mb-4">🎉 Email Analysis Complete!</h2>
                    <p class="text-gray-700 mb-4">
                        Excellent work! You've successfully categorized all emails in your inbox. 
                        Your email security skills are improving!
                    </p>
                    <div class="bg-green-50 p-3 rounded mb-4">
                        <p class="text-sm text-green-700">
                            <strong>Skills Developed:</strong><br>
                            • Email threat detection<br>
                            • Phishing identification<br>
                            • Source verification<br>
                            • Digital literacy
                        </p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
                        Continue Training
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Store completion status
        localStorage.setItem('cyberquest_email_training_completed', 'true');
    }

    // Get email statistics for progress tracking
    getEmailStatistics() {
        const allEmailIds = ALL_EMAILS.map(email => email.id);
        const readEmails = Array.from(this.emailApp.readEmails);
        const phishingReports = Array.from(this.emailApp.state.securityManager.reportedPhishing);
        const legitimateMarks = Array.from(this.emailApp.state.securityManager.markedLegitimate);
        
        return {
            total: allEmailIds.length,
            read: readEmails.length,
            categorized: phishingReports.length + legitimateMarks.length,
            phishingDetected: phishingReports.length,
            legitimateConfirmed: legitimateMarks.length,
            readPercentage: Math.round((readEmails.length / allEmailIds.length) * 100),
            categorizedPercentage: Math.round(((phishingReports.length + legitimateMarks.length) / allEmailIds.length) * 100)
        };
    }

    // Export user actions for analysis
    exportUserActions() {
        const stats = this.getEmailStatistics();
        const securityStats = this.emailApp.state.securityManager.getSecurityStats();
        
        return {
            timestamp: new Date().toISOString(),
            userStats: stats,
            securityActions: securityStats,
            readEmails: Array.from(this.emailApp.readEmails),
            sessionData: {
                startTime: this.sessionStartTime || new Date().toISOString(),
                endTime: new Date().toISOString()
            }
        };
    }

    // Initialize action handler
    initialize() {
        // Load saved state
        this.loadReadEmailStatus();
        this.sessionStartTime = new Date().toISOString();
        
        // Store global reference for modal callbacks
        window.emailActionHandler = this;
    }

    // Cleanup when email app is closed
    cleanup() {
        // Save current state
        this.saveReadEmailStatus();
        
        // Clean up global reference
        if (window.emailActionHandler === this) {
            window.emailActionHandler = null;
        }
        
        // Remove any remaining toasts
        const toasts = document.querySelectorAll('.email-action-toast');
        toasts.forEach(toast => toast.remove());
    }
}
