import { WindowBase } from '../window-base.js';
import { EmailState } from './email-functions/email-state.js';
import { LEGITIMATE_EMAILS, SUSPICIOUS_EMAILS } from './email-functions/emails/email-registry.js';

export class EmailApp extends WindowBase {
    constructor() {
        super('email', 'Email Client', {
            width: '80%',
            height: '70%'
        });
        this.state = new EmailState();
        this.readEmails = new Set(); // Track read email IDs
    }

    createContent() {
        const currentFolder = this.state.getCurrentFolder();
        const selectedEmailId = this.state.getSelectedEmailId();
        // Use centralized registry for inbox emails
        let emails = [];
        if (currentFolder === 'inbox') {
            emails = [...LEGITIMATE_EMAILS, ...SUSPICIOUS_EMAILS];
        }
        // Sort emails by recency (most recent first)
        emails.sort((a, b) => {
            // Helper to convert time string to a comparable value
            const parseTime = (email) => {
                const t = email.time.toLowerCase();
                if (t.includes('min')) return 0 + parseInt(t) * 60; // minutes ago
                if (t.includes('hour')) return 1000 + parseInt(t) * 3600; // hours ago
                if (t.includes('yesterday')) return 2000;
                if (t.includes('last week')) return 3000;
                if (t.includes('day')) return 1500 + parseInt(t) * 86400; // days ago
                return 9999; // fallback for unknown/older
            };
            return parseTime(a) - parseTime(b);
        });
        const selectedEmail = selectedEmailId ? emails.find(e => e.id === selectedEmailId) : null;

        // Only show Inbox as folder
        return `
            <div class="h-full flex">
                <div class="w-48 bg-gray-700 border-r border-gray-600 p-3 flex flex-col">
                    <div class="email-folder px-3 py-2 rounded text-sm font-medium mb-1 cursor-pointer transition-colors duration-200
                        ${currentFolder === 'inbox' ? 'bg-green-400 text-black' : 'text-gray-300 hover:bg-gray-600'}"
                        data-folder="inbox">
                        Inbox (${LEGITIMATE_EMAILS.length + SUSPICIOUS_EMAILS.length})
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
        // Unread: bold subject, blue dot; Read: normal subject, gray dot
        return `
            <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200 flex items-center"
                 data-email-id="${email.id}">
                <span class="inline-block w-2 h-2 rounded-full mr-3 ${isRead ? 'bg-gray-400' : 'bg-blue-500'}"></span>
                <div class="flex-1">
                    <div class="font-medium text-white text-sm">${email.sender}</div>
                    <div class="text-sm mb-1 ${isRead ? 'text-gray-300 font-normal' : 'text-white font-bold'}">${email.subject}</div>
                    <div class="text-gray-400 text-xs">${email.time}</div>
                </div>
            </div>
        `;
    }

    createEmailDetail(email, folderId) {
        // Mark as read when viewing detail
        this.readEmails.add(email.id);
        return `
            <div class="p-6">
                <div class="mb-4 flex items-center justify-between">
                    <div>
                        <div class="font-medium text-lg text-white">${email.subject}</div>
                        <div class="text-gray-400 text-sm">${email.sender}</div>
                        <div class="text-gray-500 text-xs mb-2">${email.time}</div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-xs cursor-pointer" id="back-btn">Back</button>
                    </div>
                </div>
                <div class="bg-gray-800 border border-gray-700 rounded p-4 text-white text-sm">
                    ${email.body}
                </div>
            </div>
        `;
    }

    initialize() {
        super.initialize();
        this.bindEvents();
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

        // Folder switching (only inbox)
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
                this.updateContent();
            });
        });

        // Email detail actions
        const backBtn = windowElement.querySelector('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.state.selectEmail(null);
                this.updateContent();
            });
        }
    }
}