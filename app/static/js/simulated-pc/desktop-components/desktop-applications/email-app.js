import { WindowBase } from '../window-base.js';
import { EMAIL_FOLDERS } from './email-functions/email-data.js';
import { EmailState } from './email-functions/email-state.js';
import { getEmailsByFolder, getEmailById } from './email-functions/email-utils.js';

export class EmailApp extends WindowBase {
    constructor() {
        super('email', 'Email Client', {
            width: '80%',
            height: '70%'
        });
        this.state = new EmailState();
    }

    createContent() {
        const currentFolder = this.state.getCurrentFolder();
        const selectedEmailId = this.state.getSelectedEmailId();
        const emails = getEmailsByFolder(currentFolder);
        const selectedEmail = selectedEmailId ? getEmailById(currentFolder, selectedEmailId) : null;

        return `
            <div class="h-full flex">
                <div class="w-48 bg-gray-700 border-r border-gray-600 p-3 flex flex-col">
                    ${EMAIL_FOLDERS.map(folder => `
                        <div class="email-folder px-3 py-2 rounded text-sm font-medium mb-1 cursor-pointer transition-colors duration-200
                            ${currentFolder === folder.id ? 'bg-green-400 text-black' : 'text-gray-300 hover:bg-gray-600'}"
                            data-folder="${folder.id}">
                            ${folder.name} (${getEmailsByFolder(folder.id).length})
                        </div>
                    `).join('')}
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
        const suspiciousClass = email.suspicious
            ? 'border-l-4 border-red-500 bg-red-900 bg-opacity-20'
            : '';
        return `
            <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${suspiciousClass}"
                 data-email-id="${email.id}">
                <div class="font-medium text-white text-sm">${email.sender}</div>
                <div class="text-gray-300 text-sm mb-1">${email.subject}</div>
                <div class="text-gray-400 text-xs">${email.time}</div>
            </div>
        `;
    }

    createEmailDetail(email, folderId) {
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
                ${email.suspicious
                    ? `<div class="mt-4 bg-red-900/30 border border-red-500/30 rounded p-3 text-red-300 text-sm">
                        <i class="bi bi-exclamation-triangle text-red-400 mr-2"></i>
                        This email is suspicious. Do not click links or provide personal information.
                       </div>`
                    : ''
                }
            </div>
        `;
    }

    initialize() {
        super.initialize();
        this.bindEvents();
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