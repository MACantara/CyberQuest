export class EmailSecurityManager {
    constructor() {
        this.reportedPhishing = new Set();
        this.markedLegitimate = new Set();
        this.spamEmails = new Set();
        this.loadFromLocalStorage();
    }

    // Phishing reporting methods
    reportAsPhishing(emailId) {
        this.reportedPhishing.add(emailId);
        this.spamEmails.add(emailId); // Move to spam when reported as phishing
        // Remove from legitimate if previously marked
        this.markedLegitimate.delete(emailId);
        this.saveToLocalStorage();
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-reported-phishing', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
    }

    markAsLegitimate(emailId) {
        this.markedLegitimate.add(emailId);
        this.spamEmails.delete(emailId); // Remove from spam if marked as legitimate
        // Remove from phishing reports if previously reported
        this.reportedPhishing.delete(emailId);
        this.saveToLocalStorage();
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-marked-legitimate', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
    }

    // Spam folder management
    moveToSpam(emailId) {
        this.spamEmails.add(emailId);
        this.saveToLocalStorage();
    }

    moveToInbox(emailId) {
        this.spamEmails.delete(emailId);
        this.reportedPhishing.delete(emailId); // Also remove phishing report
        this.saveToLocalStorage();
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-moved-to-inbox', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
    }

    // Email action methods - refactored from email-app.js
    confirmPhishingReport(emailId, emailApp) {
        this.reportAsPhishing(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-reported-phishing', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        if (emailApp && emailApp.actionHandler) {
            emailApp.actionHandler.showActionFeedback('Email reported as phishing and moved to spam!', 'success');
            
            // Redirect to inbox and clear selected email
            emailApp.state.setFolder('inbox');
            emailApp.state.selectEmail(null);
            emailApp.updateContent();
        }
    }

    markEmailAsLegitimate(emailId, emailApp) {
        this.markAsLegitimate(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-marked-legitimate', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        if (emailApp && emailApp.actionHandler) {
            emailApp.actionHandler.showActionFeedback('Email marked as legitimate!', 'success');
            emailApp.updateContent();
        }
    }

    moveEmailToInbox(emailId, emailApp) {
        this.moveToInbox(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-moved-to-inbox', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        if (emailApp && emailApp.actionHandler) {
            emailApp.actionHandler.showActionFeedback('Email moved back to inbox!', 'success');
            emailApp.updateContent();
        }
    }

    // Status checking methods
    isReportedAsPhishing(emailId) {
        return this.reportedPhishing.has(emailId);
    }

    isMarkedAsLegitimate(emailId) {
        return this.markedLegitimate.has(emailId);
    }

    isInSpam(emailId) {
        return this.spamEmails.has(emailId);
    }

    getEmailStatus(emailId) {
        if (this.isReportedAsPhishing(emailId)) return 'phishing';
        if (this.isMarkedAsLegitimate(emailId)) return 'legitimate';
        return 'unverified';
    }

    // Folder filtering
    getEmailsForFolder(allEmails, folderId) {
        switch (folderId) {
            case 'inbox':
                return allEmails.filter(email => !this.isInSpam(email.id));
            case 'spam':
                return allEmails.filter(email => this.isInSpam(email.id));
            default:
                return allEmails;
        }
    }

    // Persistence methods
    saveToLocalStorage() {
        localStorage.setItem('cyberquest_email_phishing_reports', JSON.stringify([...this.reportedPhishing]));
        localStorage.setItem('cyberquest_email_legitimate_marks', JSON.stringify([...this.markedLegitimate]));
        localStorage.setItem('cyberquest_email_spam', JSON.stringify([...this.spamEmails]));
    }

    loadFromLocalStorage() {
        const phishingReports = localStorage.getItem('cyberquest_email_phishing_reports');
        const legitimateMarks = localStorage.getItem('cyberquest_email_legitimate_marks');
        const spamEmails = localStorage.getItem('cyberquest_email_spam');
        
        if (phishingReports) {
            this.reportedPhishing = new Set(JSON.parse(phishingReports));
        }
        if (legitimateMarks) {
            this.markedLegitimate = new Set(JSON.parse(legitimateMarks));
        }
        if (spamEmails) {
            this.spamEmails = new Set(JSON.parse(spamEmails));
        }
    }

    // Statistics and analytics methods
    getSecurityStats() {
        return {
            totalReported: this.reportedPhishing.size,
            totalLegitimate: this.markedLegitimate.size,
            totalSpam: this.spamEmails.size,
            reportedEmails: [...this.reportedPhishing],
            legitimateEmails: [...this.markedLegitimate],
            spamEmails: [...this.spamEmails]
        };
    }

    // UI Helper methods for creating status indicators and badges
    createStatusIndicator(emailId, isRead = false) {
        const emailStatus = this.getEmailStatus(emailId);
        let statusIndicator = '';
        let statusClass = 'bg-gray-400';
        
        switch(emailStatus) {
            case 'phishing':
                statusIndicator = '<i class="bi bi-shield-exclamation text-red-500 text-xs ml-1" title="Reported as Phishing"></i>';
                statusClass = 'bg-red-500';
                break;
            case 'legitimate':
                statusIndicator = '<i class="bi bi-shield-check text-green-500 text-xs ml-1" title="Marked as Legitimate"></i>';
                statusClass = 'bg-green-500';
                break;
            default:
                statusClass = isRead ? 'bg-gray-400' : 'bg-blue-500';
        }

        return { statusIndicator, statusClass };
    }

    createStatusBadge(emailId) {
        const emailStatus = this.getEmailStatus(emailId);
        
        switch(emailStatus) {
            case 'phishing':
                return '<span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"><i class="bi bi-shield-exclamation mr-1"></i>Reported as Phishing</span>';
            case 'legitimate':
                return '<span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"><i class="bi bi-shield-check mr-1"></i>Marked as Legitimate</span>';
            default:
                return '';
        }
    }

    createActionButtons(emailId, currentFolder) {
        const currentStatus = this.getEmailStatus(emailId);
        let buttons = '';
        
        if (currentFolder === 'spam') {
            // In spam folder, show move to inbox button
            buttons += `
                <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors text-xs cursor-pointer" 
                        id="move-to-inbox-btn" data-email-id="${emailId}">
                    <i class="bi bi-inbox mr-1"></i>Move to Inbox
                </button>`;
        } else {
            // In inbox, show spam/legitimate buttons based on current status
            if (currentStatus === 'phishing') {
                buttons += `
                    <button class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition-colors text-xs cursor-pointer" 
                            id="mark-legitimate-btn" data-email-id="${emailId}">
                        <i class="bi bi-shield-check mr-1"></i>Mark Legitimate
                    </button>`;
            } else if (currentStatus === 'legitimate') {
                buttons += `
                    <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors text-xs cursor-pointer" 
                            id="report-phishing-btn" data-email-id="${emailId}">
                        <i class="bi bi-shield-exclamation mr-1"></i>Report Phishing
                    </button>`;
            } else {
                buttons += `
                    <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition-colors text-xs cursor-pointer" 
                            id="report-phishing-btn" data-email-id="${emailId}">
                        <i class="bi bi-shield-exclamation mr-1"></i>Report Phishing
                    </button>
                    <button class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition-colors text-xs cursor-pointer" 
                            id="mark-legitimate-btn" data-email-id="${emailId}">
                        <i class="bi bi-shield-check mr-1"></i>Mark Legitimate
                    </button>`;
            }
        }
        
        return buttons;
    }

    createPhishingWarning() {
        return `
            <div class="mt-4 mb-4 bg-red-900 border border-red-700 rounded p-4">
                <div class="flex items-center mb-2">
                    <i class="bi bi-exclamation-triangle text-red-400 mr-2"></i>
                    <h4 class="text-red-400 font-semibold">Phishing Email Reported</h4>
                </div>
                <p class="text-red-300 text-sm">
                    This email has been reported as a phishing attempt. It has been flagged for review and will be blocked from future delivery.
                </p>
                <div class="mt-2 text-red-400 text-xs">
                    <strong>Safety Tips:</strong> Never click links or download attachments from suspicious emails. 
                    Always verify sender identity before sharing personal information.
                </div>
            </div>`;
    }

    createLegitimateConfirmation() {
        return `
            <div class="mt-4 mb-4 bg-green-900 border border-green-700 rounded p-4">
                <div class="flex items-center mb-2">
                    <i class="bi bi-shield-check text-green-400 mr-2"></i>
                    <h4 class="text-green-400 font-semibold">Legitimate Email Verified</h4>
                </div>
                <p class="text-green-300 text-sm">
                    This email has been marked as legitimate and trusted. The sender is verified and the content is safe.
                </p>
            </div>`;
    }

    // Bulk operations
    clearAllSecurityData() {
        this.reportedPhishing.clear();
        this.markedLegitimate.clear();
        this.spamEmails.clear();
        this.saveToLocalStorage();
    }

    exportSecurityData() {
        return {
            reportedPhishing: [...this.reportedPhishing],
            markedLegitimate: [...this.markedLegitimate],
            spamEmails: [...this.spamEmails],
            exportDate: new Date().toISOString()
        };
    }

    importSecurityData(data) {
        if (data.reportedPhishing) {
            this.reportedPhishing = new Set(data.reportedPhishing);
        }
        if (data.markedLegitimate) {
            this.markedLegitimate = new Set(data.markedLegitimate);
        }
        if (data.spamEmails) {
            this.spamEmails = new Set(data.spamEmails);
        }
        this.saveToLocalStorage();
    }
}
