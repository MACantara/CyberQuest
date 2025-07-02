export class EmailState {
    constructor() {
        this.currentFolder = 'inbox';
        this.selectedEmailId = null;
        this.reportedPhishing = new Set(); // Track reported phishing emails
        this.markedLegitimate = new Set(); // Track emails marked as legitimate
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
        // Remove from legitimate if previously marked
        this.markedLegitimate.delete(emailId);
        this.saveToLocalStorage();
    }

    markAsLegitimate(emailId) {
        this.markedLegitimate.add(emailId);
        // Remove from phishing reports if previously reported
        this.reportedPhishing.delete(emailId);
        this.saveToLocalStorage();
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
    }

    loadFromLocalStorage() {
        const phishingReports = localStorage.getItem('cyberquest_email_phishing_reports');
        const legitimateMarks = localStorage.getItem('cyberquest_email_legitimate_marks');
        
        if (phishingReports) {
            this.reportedPhishing = new Set(JSON.parse(phishingReports));
        }
        if (legitimateMarks) {
            this.markedLegitimate = new Set(JSON.parse(legitimateMarks));
        }
    }

    // Statistics methods
    getEmailStats() {
        return {
            totalReported: this.reportedPhishing.size,
            totalLegitimate: this.markedLegitimate.size,
            reportedEmails: [...this.reportedPhishing],
            legitimateEmails: [...this.markedLegitimate]
        };
    }
}
