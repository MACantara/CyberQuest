// TODO: Add dialogue after finishing all emails
// TODO: Create the necessary websites for each emails
// TODO: Remove the training alerts of each emails
// TODO: Redirect to the email inbox after reporting an email as phishing
// TODO: Put the toast message for phishing report or marking as legitimate within the email client
// TODO: Design the emails uniquely to realistic simulate emails and not use a uniform design
// TODO: Sort the emails from most recent to oldest
// TODO: Move the phishing email report at the top from the bottom
// TODO: Store in local storage if the email has been opened or not

import { WindowBase } from '../window-base.js';
import { EmailState } from './email-functions/email-state.js';
import { ALL_EMAILS } from './email-functions/emails/email-registry.js';
import { NavigationUtil } from '../shared-utils/navigation-util.js';

export class EmailApp extends WindowBase {
    constructor() {
        super('email', 'Email Client', {
            width: '80%',
            height: '70%'
        });
        this.state = new EmailState();
        this.readEmails = new Set(); // Track read email IDs
        
        // Load saved email state
        this.state.loadFromLocalStorage();
    }

    createContent() {
        const currentFolder = this.state.getCurrentFolder();
        const selectedEmailId = this.state.getSelectedEmailId();
        
        // Get all emails and filter by folder
        const allEmails = [...ALL_EMAILS];
        const emails = this.state.getEmailsForFolder(allEmails, currentFolder);
        
        // Sort emails by recency (most recent first)
        emails.sort((a, b) => {
            const parseTime = (email) => {
                const t = email.time.toLowerCase();
                if (t.includes('min')) return 0 + parseInt(t) * 60;
                if (t.includes('hour')) return 1000 + parseInt(t) * 3600;
                if (t.includes('yesterday')) return 2000;
                if (t.includes('last week')) return 3000;
                if (t.includes('day')) return 1500 + parseInt(t) * 86400;
                return 9999;
            };
            return parseTime(a) - parseTime(b);
        });
        
        const selectedEmail = selectedEmailId ? allEmails.find(e => e.id === selectedEmailId) : null;
        const inboxCount = this.state.getEmailsForFolder(allEmails, 'inbox').length;
        const spamCount = this.state.getEmailsForFolder(allEmails, 'spam').length;

        return `
            <div class="h-full flex">
                <div class="w-48 bg-gray-700 border-r border-gray-600 p-3 flex flex-col">
                    <div class="email-folder px-3 py-2 rounded text-sm font-medium mb-1 cursor-pointer transition-colors duration-200
                        ${currentFolder === 'inbox' ? 'bg-green-400 text-black' : 'text-gray-300 hover:bg-gray-600'}"
                        data-folder="inbox">
                        📧 Inbox (${inboxCount})
                    </div>
                    <div class="email-folder px-3 py-2 rounded text-sm font-medium mb-1 cursor-pointer transition-colors duration-200
                        ${currentFolder === 'spam' ? 'bg-red-400 text-black' : 'text-gray-300 hover:bg-gray-600'}"
                        data-folder="spam">
                        🗑️ Spam (${spamCount})
                    </div>
                </div>
                <div class="flex-1 flex flex-col">
                    <div class="flex-1 overflow-y-auto" id="email-list">
                        ${selectedEmail
                            ? this.createEmailDetail(selectedEmail, currentFolder)
                            : emails.map(email => this.createEmailListItem(email)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createEmailListItem(email) {
        const isRead = this.readEmails.has(email.id);
        const { statusIndicator, statusClass } = this.state.securityManager.createStatusIndicator(email.id, isRead);

        return `
            <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200 flex items-center"
                 data-email-id="${email.id}">
                <span class="inline-block w-2 h-2 rounded-full mr-3 ${statusClass}"></span>
                <div class="flex-1">
                    <div class="font-medium text-white text-sm flex items-center">
                        ${email.sender}
                        ${statusIndicator}
                    </div>
                    <div class="text-sm mb-1 ${isRead ? 'text-gray-300 font-normal' : 'text-white font-bold'}">${email.subject}</div>
                    <div class="text-gray-400 text-xs">${email.time}</div>
                </div>
            </div>
        `;
    }

    createEmailDetail(email, folderId) {
        // Mark as read when viewing detail
        this.readEmails.add(email.id);
        const statusBadge = this.state.securityManager.createStatusBadge(email.id);
        const emailStatus = this.state.getEmailStatus(email.id);

        return `
            <div class="p-6">
                <div class="mb-4 flex items-center justify-between">
                    <div class="flex-1">
                        <div class="font-medium text-lg text-white">${email.subject}</div>
                        <div class="text-gray-400 text-sm">${email.sender}</div>
                        <div class="text-gray-500 text-xs mb-2">${email.time}</div>
                        ${statusBadge ? `<div class="mt-2">${statusBadge}</div>` : ''}
                    </div>
                    <div class="flex flex-col space-y-2 ml-4">
                        <button class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer" id="back-btn">
                            <i class="bi bi-arrow-left mr-1"></i>Back
                        </button>
                        ${this.state.securityManager.createActionButtons(email.id, this.state.getCurrentFolder())}
                    </div>
                </div>
                <div class="bg-gray-800 border border-gray-700 rounded p-4 text-white text-sm">
                    ${email.body}
                </div>
                
                ${emailStatus === 'phishing' ? this.state.securityManager.createPhishingWarning() : ''}
                ${emailStatus === 'legitimate' ? this.state.securityManager.createLegitimateConfirmation() : ''}
            </div>
        `;
    }

    initialize() {
        super.initialize();
        
        // Store global reference for modal callbacks
        window.emailAppInstance = this;
        
        this.bindEvents();
    }

    cleanup() {
        // Clean up global reference
        if (window.emailAppInstance === this) {
            window.emailAppInstance = null;
        }
        
        super.cleanup();
    }

    updateContent() {
        // Re-render content and re-bind events to ensure UI updates and handlers are attached
        if (this.windowElement) {
            const contentElement = this.windowElement.querySelector('.window-content');
            if (contentElement) {
                contentElement.innerHTML = this.createContent();
                this.bindEvents();
            }
        }
    }

    bindEvents() {
        const windowElement = this.windowElement;
        if (!windowElement) return;

        // Folder switching
        windowElement.querySelectorAll('.email-folder').forEach(folderEl => {
            folderEl.addEventListener('click', () => {
                const folderId = folderEl.getAttribute('data-folder');
                this.state.setFolder(folderId);
                this.updateContent();
            });
        });

        // Email list item click
        windowElement.querySelectorAll('.email-item').forEach(emailEl => {
            emailEl.addEventListener('click', () => {
                const emailId = emailEl.getAttribute('data-email-id');
                this.state.selectEmail(emailId);
                // Mark as read
                this.readEmails.add(emailId);
                
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
                
                this.updateContent();
            });
        });

        // Back button
        const backBtn = windowElement.querySelector('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.state.selectEmail(null);
                this.updateContent();
            });
        }

        // Report phishing button
        const reportPhishingBtn = windowElement.querySelector('#report-phishing-btn');
        if (reportPhishingBtn) {
            reportPhishingBtn.addEventListener('click', () => {
                const emailId = reportPhishingBtn.getAttribute('data-email-id');
                this.reportPhishingEmail(emailId);
            });
        }

        // Mark legitimate button
        const markLegitimateBtn = windowElement.querySelector('#mark-legitimate-btn');
        if (markLegitimateBtn) {
            markLegitimateBtn.addEventListener('click', () => {
                const emailId = markLegitimateBtn.getAttribute('data-email-id');
                this.markEmailAsLegitimate(emailId);
            });
        }

        // Move to inbox button
        const moveToInboxBtn = windowElement.querySelector('#move-to-inbox-btn');
        if (moveToInboxBtn) {
            moveToInboxBtn.addEventListener('click', () => {
                const emailId = moveToInboxBtn.getAttribute('data-email-id');
                this.moveEmailToInbox(emailId);
            });
        }

        // Use shared navigation utility for email link handling
        NavigationUtil.bindEmailLinkHandlers(windowElement);
    }

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
                        <button onclick="window.emailAppInstance?.confirmPhishingReport('${emailId}'); this.closest('.fixed').remove()" 
                                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                            Report Phishing
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    confirmPhishingReport(emailId) {
        this.state.reportAsPhishing(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-reported-phishing', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        this.showActionFeedback('Email reported as phishing and moved to spam!', 'success');
        this.updateContent();
    }

    markEmailAsLegitimate(emailId) {
        const email = ALL_EMAILS.find(e => e.id === emailId);
        if (!email) return;

        this.state.markAsLegitimate(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-marked-legitimate', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        this.showActionFeedback('Email marked as legitimate!', 'success');
        this.updateContent();
    }

    moveEmailToInbox(emailId) {
        const email = ALL_EMAILS.find(e => e.id === emailId);
        if (!email) return;

        this.state.moveToInbox(emailId);
        
        // Emit event for network monitoring
        document.dispatchEvent(new CustomEvent('email-moved-to-inbox', {
            detail: { emailId, timestamp: new Date().toISOString() }
        }));
        
        this.showActionFeedback('Email moved back to inbox!', 'success');
        this.updateContent();
    }

    showActionFeedback(message, type) {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
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
}