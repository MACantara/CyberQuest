import { BaseEmail } from './base-email.js';

class FakePaypalEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'paypal-phish-001',
            sender: 'service@paypal-security.com',
            subject: 'Urgent: Your PayPal Account Has Been Limited',
            time: '45 min ago',
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        const headerInfo = {
            icon: 'credit-card',
            bgColor: 'bg-blue-600',
            title: 'PayPal Security',
            titleColor: 'text-blue-800',
            subtitle: 'Account Security Alert',
            subtitleColor: 'text-blue-600'
        };

        const content = `
            <div class="bg-white border border-blue-200 rounded-lg p-4">
                <div class="flex items-center mb-4">
                    <div class="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                        <span class="text-white font-bold text-sm">PP</span>
                    </div>
                    <h3 class="font-bold text-blue-800">PayPal Security Center</h3>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">Dear Valued Customer,</p>
                <p class="text-gray-800 text-sm mb-3">
                    We have detected unusual activity on your PayPal account and have temporarily limited access for your protection.
                </p>
                
                <div class="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                    <p class="text-red-800 font-semibold text-sm">⚠️ IMMEDIATE ACTION REQUIRED</p>
                    <p class="text-red-700 text-sm">Your account will be permanently suspended within 48 hours if not verified.</p>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    <strong>Suspicious Activity Detected:</strong><br>
                    • Login attempt from IP: 192.168.1.100 (Russia)<br>
                    • Failed payment of $847.99<br>
                    • Password change request from unknown device
                </p>
                
                <div class="text-center my-4">
                    <a href="#" class="open-browser-link bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded inline-block transition-colors duration-200" 
                       data-url="https://paypal-security-verify.net/account/restore">
                        Verify Account Now
                    </a>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    Please verify your identity by clicking the button above and providing the following information:
                </p>
                <ul class="text-gray-700 text-sm mb-3 list-disc ml-5">
                    <li>Full legal name and address</li>
                    <li>Social Security Number</li>
                    <li>Credit card information</li>
                    <li>Online banking credentials</li>
                </ul>
                
                <p class="text-gray-800 text-sm mb-3">
                    Thank you for helping us keep your account secure.
                </p>
                <p class="text-gray-800 text-sm">
                    Sincerely,<br>
                    <span class="font-bold">PayPal Security Team</span><br>
                    <span class="text-xs text-gray-600">This is an automated message. Please do not reply.</span>
                </p>
            </div>
        `;

        return this.createStyledContainer(
            content,
            'bg-red-50 border-red-200',
            headerInfo
        );
    }
}

export const FakePaypalEmail = new FakePaypalEmailClass().toEmailObject();
