import { WindowBase } from '../window-base.js';

export class EmailApp extends WindowBase {
    constructor() {
        super('email', 'Email Client', {
            width: '80%',
            height: '70%'
        });
    }

    createContent() {
        return `
            <div class="h-full flex">
                <div class="w-48 bg-gray-700 border-r border-gray-600 p-3">
                    <div class="email-folder bg-green-400 text-black px-3 py-2 rounded text-sm font-medium mb-1 cursor-pointer">Inbox (3)</div>
                    <div class="email-folder px-3 py-2 text-gray-300 text-sm hover:bg-gray-600 rounded cursor-pointer transition-colors duration-200">Sent</div>
                    <div class="email-folder px-3 py-2 text-gray-300 text-sm hover:bg-gray-600 rounded cursor-pointer transition-colors duration-200">Trash</div>
                </div>                
                <div class="flex-1 flex flex-col">
                    <div class="flex-1 overflow-y-auto" id="email-list">
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200 border-l-4 border-red-500 bg-red-900 bg-opacity-20" id="suspicious-email">
                            <div class="font-medium text-white text-sm" id="suspicious-sender">prince.nigeria@totally-real.com</div>
                            <div class="text-gray-300 text-sm mb-1" id="suspicious-subject">URGENT: Claim Your Inheritance!</div>
                            <div class="text-gray-400 text-xs">2 min ago</div>
                        </div>
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200" id="legitimate-email">
                            <div class="font-medium text-white text-sm" id="legitimate-sender">admin@cyberquest.com</div>
                            <div class="text-gray-300 text-sm mb-1">Welcome to CyberQuest Training</div>
                            <div class="text-gray-400 text-xs">1 hour ago</div>
                        </div>
                        <div class="email-item p-3 border-b border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors duration-200" id="bank-email">
                            <div class="font-medium text-white text-sm" id="bank-sender">noreply@bank.com</div>
                            <div class="text-gray-300 text-sm mb-1">Your account has been suspended</div>
                            <div class="text-gray-400 text-xs">3 hours ago</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
