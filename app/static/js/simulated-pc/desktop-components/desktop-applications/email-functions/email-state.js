export class EmailState {
    constructor() {
        this.currentFolder = 'inbox';
        this.selectedEmailId = null;
        this.reportedPhishing = new Set(); // Track reported phishing emails
        this.markedLegitimate = new Set(); // Track emails marked as legitimate
        this.spamEmails = new Set(); // Track emails moved to spam
    }

    setFolder(folderId) {
        this.currentFolder = folderId;
        this.selectedEmailId = null;
    }

    selectEmail(emailId) {
        this.selectedEmailId = emailId;
    }

    getCurrentFolder() {
        return this.currentFolder;
    }

    getSelectedEmailId() {
        return this.selectedEmailId;
    }

    // Phishing reporting methods
    reportAsPhishing(emailId) {
        this.reportedPhishing.add(emailId);
        this.spamEmails.add(emailId); // Move to spam when reported as phishing
        // Remove from legitimate if previously marked
        this.markedLegitimate.delete(emailId);
        this.saveToLocalStorage();
    }

    markAsLegitimate(emailId) {
        this.markedLegitimate.add(emailId);
        this.spamEmails.delete(emailId); // Remove from spam if marked as legitimate
        // Remove from phishing reports if previously reported
        this.reportedPhishing.delete(emailId);
        this.saveToLocalStorage();
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
    }

    isInSpam(emailId) {
        return this.spamEmails.has(emailId);
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

    isReportedAsPhishing(emailId) {
        return this.reportedPhishing.has(emailId);
    }

    isMarkedAsLegitimate(emailId) {
        return this.markedLegitimate.has(emailId);
    }

    getEmailStatus(emailId) {
        if (this.isReportedAsPhishing(emailId)) return 'phishing';
        if (this.isMarkedAsLegitimate(emailId)) return 'legitimate';
        return 'unverified';
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

    // Statistics methods
    getEmailStats() {
        return {
            totalReported: this.reportedPhishing.size,
            totalLegitimate: this.markedLegitimate.size,
            totalSpam: this.spamEmails.size,
            reportedEmails: [...this.reportedPhishing],
            legitimateEmails: [...this.markedLegitimate],
            spamEmails: [...this.spamEmails]
        };
    }
}
