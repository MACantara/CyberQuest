import { BaseEmail } from './base-email.js';

class FakeMicrosoftEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'microsoft-phish-001',
            sender: 'account-security@microsoft.com',
            subject: 'Microsoft Account: Sign-in from new device requires verification',
            timestamp: BaseEmail.createTimestamp(0, 15), // 15 minutes ago
            suspicious: true,
            priority: 'normal'
        });
    }

    createBody() {
        const headerInfo = {
            icon: 'shield-check',
            bgColor: 'bg-blue-500',
            title: 'Microsoft Account Security',
            titleColor: 'text-blue-800',
            subtitle: 'Account Protection Service',
            subtitleColor: 'text-blue-600'
        };

        const content = `
            <div class="bg-white border border-blue-200 rounded-lg p-4">
                <div class="flex items-center mb-4">
                    <div class="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                        <span class="text-white font-bold text-xs">MS</span>
                    </div>
                    <h3 class="font-bold text-blue-800">Microsoft Account Security</h3>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">Hi there,</p>
                <p class="text-gray-800 text-sm mb-3">
                    We noticed a new sign-in to your Microsoft account from a device we don't recognize.
                </p>
                
                <div class="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
                    <h4 class="font-semibold text-gray-800 text-sm mb-2">Sign-in Details:</h4>
                    <div class="text-gray-700 text-sm space-y-1">
                        <div class="flex justify-between">
                            <span>Time:</span>
                            <span>November 18, 2024 2:34 PM PST</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Location:</span>
                            <span>Moscow, Russia</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Device:</span>
                            <span>Windows 11 PC</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Browser:</span>
                            <span>Chrome 119</span>
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    If this was you, you can safely ignore this email. If you don't recognize this activity, your account may be compromised.
                </p>
                
                <div class="bg-orange-50 border-l-4 border-orange-500 p-3 mb-4">
                    <p class="text-orange-800 font-semibold text-sm">🔐 Secure your account</p>
                    <p class="text-orange-700 text-sm">We recommend verifying your identity and updating your security settings.</p>
                </div>
                
                <div class="text-center my-4">
                    <a href="#" class="open-browser-link bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-block transition-colors duration-200 mr-3" 
                       data-url="https://login.microsft-secure.net/account/verify">
                        Verify Identity
                    </a>
                    <a href="#" class="text-blue-600 hover:underline text-sm">This wasn't me</a>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    For your security, we've temporarily limited some account features until you can verify your identity.
                </p>
                
                <p class="text-gray-800 text-sm">
                    Thanks,<br>
                    <span class="font-bold">The Microsoft Account Team</span>
                </p>
                
                <div class="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <p>Microsoft Corporation | One Microsoft Way, Redmond, WA 98052</p>
                    <p class="mt-1">This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        `;

        return this.createStyledContainer(
            content,
            'bg-orange-50 border-orange-200',
            headerInfo
        );
    }
}

export const FakeMicrosoftEmail = new FakeMicrosoftEmailClass().toEmailObject();
