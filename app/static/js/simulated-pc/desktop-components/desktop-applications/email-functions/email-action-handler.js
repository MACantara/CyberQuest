import { ALL_EMAILS } from './emails/email-registry.js';
import { EmailFeedback } from './email-feedback.js';
import { EmailSessionSummary } from './email-session-summary.js';
import { EmailCompletionTracker } from './email-completion-tracker.js';

export class EmailActionHandler {
    constructor(emailApp) {
        this.emailApp = emailApp;
        this.feedback = new EmailFeedback(emailApp);
        this.sessionSummary = new EmailSessionSummary(emailApp);
        this.completionTracker = new EmailCompletionTracker(emailApp);
        this.sessionStartTime = new Date().toISOString();
        
        // Load previous session data
        this.feedback.loadSessionData();
        this.completionTracker.initialize();
    }

    // Handle reporting an email as phishing
    reportPhishingEmail(emailId) {
        const email = ALL_EMAILS.find(e => e.id === emailId);
        if (!email) return;

        // Get the email app window element
        const emailWindow = this.emailApp.windowElement;
        if (!emailWindow) return;

        // Remove any existing modals within the email window
        const existingModals = emailWindow.querySelectorAll('.email-modal');
        existingModals.forEach(modal => modal.remove());

        // Create modal within email window
        const modal = document.createElement('div');
        modal.className = 'email-modal absolute inset-0 bg-black/75 flex items-center justify-center z-50';
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
                        <button onclick="this.closest('.email-modal').remove()" 
                                class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button onclick="window.emailActionHandler?.confirmPhishingReport('${emailId}'); this.closest('.email-modal').remove()" 
                                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors cursor-pointer">
                            Report Phishing
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Append to email window instead of body
        emailWindow.appendChild(modal);
    }

    // Confirm phishing report and execute the action
    confirmPhishingReport(emailId) {
        // Use security manager to handle the action
        this.emailApp.state.securityManager.confirmPhishingReport(emailId, this.emailApp);
    }

    // Handle marking an email as legitimate
    markEmailAsLegitimate(emailId) {
        // Use security manager to handle the action
        this.emailApp.state.securityManager.markEmailAsLegitimate(emailId, this.emailApp);
    }

    // Handle moving an email from spam back to inbox
    moveEmailToInbox(emailId) {
        // Use security manager to handle the action
        this.emailApp.state.securityManager.moveEmailToInbox(emailId, this.emailApp);
    }

    // Show toast notification for user feedback within the email client
    showActionFeedback(message, type) {
        // Get the email app window element
        const emailWindow = this.emailApp.windowElement;
        if (!emailWindow) return;

        // Remove any existing email toasts first
        const existingToasts = emailWindow.querySelectorAll('.email-action-toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `email-action-toast absolute top-16 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Position relative to email window, not body
        emailWindow.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('opacity-0', 'transform', 'translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    // Handle email opening actions
    handleEmailOpen(emailId) {
        this.emailApp.state.selectEmail(emailId);
        
        // Mark as read using the read tracker
        this.emailApp.readTracker.markAsRead(emailId);
        
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
        // This is now handled by EmailReadTracker automatically
        return true;
    }

    // Save read email status to localStorage
    saveReadEmailStatus() {
        // This is now handled by EmailReadTracker automatically
        return true;
    }

    // Check if all emails have been processed (opened and categorized)
    checkEmailCompletionStatus() {
        const allEmailIds = ALL_EMAILS.map(email => email.id);
        const processedEmails = allEmailIds.filter(emailId => {
            const status = this.emailApp.state.getEmailStatus(emailId);
            return status === 'phishing' || status === 'legitimate';
        });
        
        
        return {
            total: allEmailIds.length,
            processed: processedEmails.length,
            percentage: Math.round((processedEmails.length / allEmailIds.length) * 100)
        };
    }


    // Get email statistics for progress tracking
    getEmailStatistics() {
        const stats = this.feedback.getSessionStats();
        return {
            categorized: stats.totalReported + stats.totalLegitimate,
            phishingDetected: stats.totalReported,
            legitimateConfirmed: stats.totalLegitimate,
            categorizedPercentage: Math.round(((stats.totalReported + stats.totalLegitimate) / ALL_EMAILS.length) * 100),
            emailSecurityAccuracy: stats.accuracy
        };
    }

    // Export user actions for analysis
    exportUserActions() {
        const stats = this.getEmailStatistics();
        
        return {
            timestamp: new Date().toISOString(),
            userStats: stats,
            feedbackHistory: this.feedback.feedbackHistory,
            sessionData: {
                startTime: this.sessionStartTime,
                endTime: new Date().toISOString()
            }
        };
    }

    /**
     * Complete email security training session
     */
    completeEmailTraining() {
        const sessionStats = this.feedback.getSessionStats();
        const feedbackHistory = this.feedback.feedbackHistory;
        
        // Use completion tracker to handle the full completion flow
        const completionTriggered = this.completionTracker.checkAndTriggerCompletion(sessionStats, feedbackHistory);
        
        if (!completionTriggered) {
            // If level completion criteria not met, just show training completion
            this.completionTracker.showTrainingCompletionOnly(sessionStats, feedbackHistory);
        }
        
        // Mark email training as completed regardless of level completion
        localStorage.setItem('cyberquest_email_training_completed', 'true');
        localStorage.setItem('cyberquest_email_training_score', sessionStats.accuracy.toString());
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
        
        // Remove any remaining toasts and modals from the email window
        if (this.emailApp.windowElement) {
            const toasts = this.emailApp.windowElement.querySelectorAll('.email-action-toast');
            toasts.forEach(toast => toast.remove());
            
            const modals = this.emailApp.windowElement.querySelectorAll('.email-modal');
            modals.forEach(modal => modal.remove());
        }

        // Clean up completion tracker
        this.completionTracker.cleanup();
    }

    /**
     * Handle email reporting action
     * @param {Object} email - Email object to report
     * @param {string} reason - Reason for reporting
     */
    handleReportEmail(email, reason = 'Suspicious content') {
        // Use security manager which will trigger feedback automatically
        if (this.emailApp.state?.securityManager) {
            this.emailApp.state.securityManager.confirmPhishingReport(email.id, this.emailApp);
            
            // Check if training should be completed
            this.emailApp.state.securityManager.checkTrainingCompletion(this.emailApp);
        }
        
        console.log(`Email reported: ${email.subject}`);
        return { success: true, action: 'report' };
    }

    /**
     * Handle email trust action
     * @param {Object} email - Email object to trust
     */
    handleTrustEmail(email) {
        // Use security manager which will trigger feedback automatically
        if (this.emailApp.state?.securityManager) {
            this.emailApp.state.securityManager.markEmailAsLegitimate(email.id, this.emailApp);
            
            // Check if training should be completed
            this.emailApp.state.securityManager.checkTrainingCompletion(this.emailApp);
        }
        
        console.log(`Email trusted: ${email.subject}`);
        return { success: true, action: 'trust' };
    }

    /**
     * Handle email deletion action
     * @param {Object} email - Email object to delete
     */
    handleDeleteEmail(email) {
        // Use security manager which will trigger feedback automatically
        if (this.emailApp.state?.securityManager) {
            this.emailApp.state.securityManager.deleteEmail(email.id, this.emailApp);
            
            // Check if training should be completed
            this.emailApp.state.securityManager.checkTrainingCompletion(this.emailApp);
        }
        
        console.log(`Email deleted: ${email.subject}`);
        return { success: true, action: 'delete' };
    }

    /**
     * Handle email ignore action (normal processing)
     * @param {Object} email - Email object to process normally
     */
    handleIgnoreEmail(email) {
        // Use security manager which will trigger feedback automatically
        if (this.emailApp.state?.securityManager) {
            this.emailApp.state.securityManager.ignoreEmail(email.id, this.emailApp);
            
            // Check if training should be completed
            this.emailApp.state.securityManager.checkTrainingCompletion(this.emailApp);
        }
        
        console.log(`Email processed normally: ${email.subject}`);
        return { success: true, action: 'ignore' };
    }

    showEmailContextMenu(email, x, y) {
        const existingMenu = document.querySelector('.email-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'email-context-menu fixed bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-2 min-w-48';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        const menuItems = [
            {
                label: '🚨 Report as Suspicious',
                action: () => this.handleReportEmail(email),
                class: 'text-red-600 hover:bg-red-50',
                show: true
            },
            {
                label: '✅ Mark as Legitimate',
                action: () => this.handleTrustEmail(email),
                class: 'text-green-600 hover:bg-green-50',
                show: true
            },
            {
                label: '🗑️ Delete Email',
                action: () => this.handleDeleteEmail(email),
                class: 'text-red-500 hover:bg-red-50',
                show: true
            },
            {
                label: '📂 Process Normally',
                action: () => this.handleIgnoreEmail(email),
                class: 'text-blue-600 hover:bg-blue-50',
                show: true
            },
            {
                label: '📊 View Details',
                action: () => this.showEmailDetails(email),
                class: 'text-gray-600 hover:bg-gray-50',
                show: true
            }
        ];

        menuItems.forEach(item => {
            if (!item.show) return;
            
            const menuItem = document.createElement('div');
            menuItem.className = `px-4 py-2 cursor-pointer text-sm ${item.class || 'hover:bg-gray-50'}`;
            menuItem.textContent = item.label;
            menuItem.addEventListener('click', () => {
                item.action();
                menu.remove();
            });
            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        // Remove menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function removeMenu() {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            });
        }, 100);
    }
}