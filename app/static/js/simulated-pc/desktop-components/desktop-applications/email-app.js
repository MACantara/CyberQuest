// TODO: Add dialogue after finishing all emails
// TODO: Create the necessary websites for each emails
// TODO: Update PayPal logo for the fake paypal phishing email

import { WindowBase } from '../window-base.js';
import { EmailState } from './email-functions/email-state.js';
import { EmailActionHandler } from './email-functions/email-action-handler.js';
import { EmailReadTracker } from './email-functions/email-read-tracker.js';
import { ALL_EMAILS } from './email-functions/emails/email-registry.js';
import { NavigationUtil } from '../shared-utils/navigation-util.js';

export class EmailApp extends WindowBase {
    constructor() {
        super('email', 'Email Client', {
            width: '80%',
            height: '70%'
        });
        this.state = new EmailState();
        this.readTracker = new EmailReadTracker();
        this.actionHandler = new EmailActionHandler(this);
        
        // Load saved email state
        this.state.loadFromLocalStorage();
    }

    createContent() {
        const currentFolder = this.state.getCurrentFolder();
        const selectedEmailId = this.state.getSelectedEmailId();
        
        // Get all emails and filter by folder
        const allEmails = [...ALL_EMAILS];
        const emails = this.state.getEmailsForFolder(allEmails, currentFolder);
        
        // Sort emails by timestamp (most recent first)
        emails.sort((a, b) => {
            const timestampA = a.timestamp ? new Date(a.timestamp).getTime() : this.parseTimeForSorting(a.time);
            const timestampB = b.timestamp ? new Date(b.timestamp).getTime() : this.parseTimeForSorting(b.time);
            return timestampB - timestampA; // Descending order (newest first)
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

    // Parse time strings for sorting when timestamp is not available
    parseTimeForSorting(timeString) {
        const now = Date.now();
        const lowerTime = timeString.toLowerCase();
        
        if (lowerTime.includes('min ago')) {
            const minutes = parseInt(lowerTime) || 0;
            return now - (minutes * 60 * 1000);
        } else if (lowerTime.includes('hour ago') || lowerTime.includes('hours ago')) {
            const hours = parseInt(lowerTime) || 0;
            return now - (hours * 60 * 60 * 1000);
        } else if (lowerTime.includes('yesterday')) {
            return now - (24 * 60 * 60 * 1000);
        } else if (lowerTime.includes('day ago') || lowerTime.includes('days ago')) {
            const days = parseInt(lowerTime) || 0;
            return now - (days * 24 * 60 * 60 * 1000);
        } else if (lowerTime.includes('last week')) {
            return now - (7 * 24 * 60 * 60 * 1000);
        } else {
            // Try to parse as date
            const parsed = new Date(timeString);
            return isNaN(parsed.getTime()) ? now : parsed.getTime();
        }
    }

    createEmailListItem(email) {
        const isRead = this.readTracker.isRead(email.id);
        const { statusIndicator, statusClass } = this.state.securityManager.createStatusIndicator(email.id, isRead);

        // Get both date and time display
        const displayDateTime = this.getDateTimeDisplay(email);

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
                    <div class="text-gray-400 text-xs">${displayDateTime}</div>
                </div>
            </div>
        `;
    }

    // Get formatted date and time for email list display
    getDateTimeDisplay(email) {
        if (email.timestamp) {
            const date = new Date(email.timestamp);
            const now = new Date();
            const diffInHours = (now - date) / (1000 * 60 * 60);
            
            // If today, show time only
            if (diffInHours < 24 && date.toDateString() === now.toDateString()) {
                return date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
            }
            
            // If yesterday, show "Yesterday" + time
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) {
                return `Yesterday ${date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                })}`;
            }
            
            // If this year, show month/day + time
            if (date.getFullYear() === now.getFullYear()) {
                return `${date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                })} ${date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                })}`;
            }
            
            // If older, show full date + time
            return `${date.toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'short', 
                day: 'numeric' 
            })} ${date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            })}`;
        }
        
        // Fallback to original time string if no timestamp
        return email.time;
    }

    createEmailDetail(email, folderId) {
        // Mark as read when viewing detail
        this.readTracker.markAsRead(email.id);
        
        const statusBadge = this.state.securityManager.createStatusBadge(email.id);
        const emailStatus = this.state.getEmailStatus(email.id);

        // Use full date time if available, otherwise format the time
        const displayTime = email.fullDateTime || this.formatDetailTime(email);

        return `
            <div class="p-6">
                <!-- Action buttons at the top -->
                <div class="mb-4 flex items-center space-x-2">
                    <button class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer" id="back-btn">
                        <i class="bi bi-arrow-left mr-1"></i>Back
                    </button>
                    ${this.state.securityManager.createActionButtons(email.id, this.state.getCurrentFolder())}
                </div>
                
                <!-- Security alerts -->
                ${emailStatus === 'phishing' ? this.state.securityManager.createPhishingWarning() : ''}
                ${emailStatus === 'legitimate' ? this.state.securityManager.createLegitimateConfirmation() : ''}
                
                <!-- Email information -->
                <div class="mb-4">
                    <div class="font-medium text-lg text-white">${email.subject}</div>
                    <div class="text-gray-400 text-sm">${email.sender}</div>
                    <div class="text-gray-500 text-xs mb-2" title="Full timestamp: ${displayTime}">
                        <i class="bi bi-clock mr-1"></i>${displayTime}
                    </div>
                    ${statusBadge ? `<div class="mt-2">${statusBadge}</div>` : ''}
                </div>
                
                <div class="bg-gray-800 text-white text-sm">
                    ${email.body}
                </div>
            </div>
        `;
    }

    // Format time for detail view when fullDateTime is not available
    formatDetailTime(email) {
        if (email.timestamp) {
            const date = new Date(email.timestamp);
            return date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZoneName: 'short'
            });
        }
        return email.time;
    }

    initialize() {
        super.initialize();
        
        // Initialize action handler
        this.actionHandler.initialize();
        
        // Clean up old read status for emails that no longer exist
        const currentEmailIds = ALL_EMAILS.map(email => email.id);
        this.readTracker.cleanupOldReadStatus(currentEmailIds);
        
        this.bindEvents();
    }

    cleanup() {
        // Clean up action handler
        this.actionHandler.cleanup();
        
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
                this.actionHandler.handleFolderSwitch(folderId);
            });
        });

        // Email list item click
        windowElement.querySelectorAll('.email-item').forEach(emailEl => {
            emailEl.addEventListener('click', () => {
                const emailId = emailEl.getAttribute('data-email-id');
                this.actionHandler.handleEmailOpen(emailId);
            });
        });

        // Back button
        const backBtn = windowElement.querySelector('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.actionHandler.handleBackNavigation();
            });
        }

        // Report phishing button
        const reportPhishingBtn = windowElement.querySelector('#report-phishing-btn');
        if (reportPhishingBtn) {
            reportPhishingBtn.addEventListener('click', () => {
                const emailId = reportPhishingBtn.getAttribute('data-email-id');
                this.actionHandler.reportPhishingEmail(emailId);
            });
        }

        // Mark legitimate button
        const markLegitimateBtn = windowElement.querySelector('#mark-legitimate-btn');
        if (markLegitimateBtn) {
            markLegitimateBtn.addEventListener('click', () => {
                const emailId = markLegitimateBtn.getAttribute('data-email-id');
                this.actionHandler.markEmailAsLegitimate(emailId);
            });
        }

        // Move to inbox button
        const moveToInboxBtn = windowElement.querySelector('#move-to-inbox-btn');
        if (moveToInboxBtn) {
            moveToInboxBtn.addEventListener('click', () => {
                const emailId = moveToInboxBtn.getAttribute('data-email-id');
                this.actionHandler.moveEmailToInbox(emailId);
            });
        }

        // Use shared navigation utility for email link handling
        NavigationUtil.bindEmailLinkHandlers(windowElement);
    }

    // Get email reading statistics for progress tracking
    getEmailStats() {
        const allEmails = [...ALL_EMAILS];
        const readingStats = this.readTracker.getReadingStats(allEmails);
        const securityStats = this.state.securityManager.getSecurityStats();
        
        return {
            ...readingStats,
            ...securityStats,
            lastUpdate: this.readTracker.getLastUpdateTimestamp()
        };
    }

    // Utility method to mark all emails as read
    markAllEmailsAsRead() {
        const allEmails = [...ALL_EMAILS];
        this.readTracker.markAllAsRead(allEmails);
        this.updateContent();
    }

    // Utility method to mark all emails as unread
    markAllEmailsAsUnread() {
        const allEmails = [...ALL_EMAILS];
        this.readTracker.markAllAsUnread(allEmails);
        this.updateContent();
    }

}

// For backward compatibility, also expose readEmails as a getter
Object.defineProperty(EmailApp.prototype, 'readEmails', {
    get: function() {
        return {
            has: (emailId) => this.readTracker.isRead(emailId),
            add: (emailId) => this.readTracker.markAsRead(emailId),
            size: this.readTracker.getReadCount()
        };
    }
});