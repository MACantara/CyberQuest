import { BaseEmail } from './base-email.js';

class PasswordResetLegitimateClass extends BaseEmail {
    constructor() {
        super({
            id: 'password-reset-001',
            sender: 'noreply@cyberquest.com',
            subject: 'Password Reset Request for Your CyberQuest Account',
            time: '5 min ago',
            suspicious: false,
            priority: 'normal'
        });
    }

    createBody() {
        const headerInfo = {
            icon: 'key',
            bgColor: 'bg-green-500',
            title: 'CyberQuest Account Services',
            titleColor: 'text-green-800',
            subtitle: 'Password Reset Service',
            subtitleColor: 'text-green-600'
        };

        const content = `
            <div class="bg-white border border-green-200 rounded-lg p-4">
                <p class="text-gray-800 text-sm mb-3">Hello,</p>
                <p class="text-gray-800 text-sm mb-3">
                    We received a request to reset the password for your CyberQuest account associated with this email address.
                </p>
                
                <div class="bg-green-50 border border-green-200 rounded p-3 mb-4">
                    <h4 class="font-semibold text-green-800 text-sm mb-2">Request Details:</h4>
                    <div class="text-green-700 text-sm space-y-1">
                        <div class="flex justify-between">
                            <span>Time:</span>
                            <span>November 18, 2024 3:15 PM EST</span>
                        </div>
                        <div class="flex justify-between">
                            <span>IP Address:</span>
                            <span>192.168.1.45</span>
                        </div>
                        <div class="flex justify-between">
                            <span>User Agent:</span>
                            <span>Chrome 119 on Windows</span>
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-800 text-sm mb-4">
                    If you requested this password reset, click the button below to create a new password. This link will expire in 24 hours for security reasons.
                </p>
                
                <div class="text-center my-4">
                    <a href="#" class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded inline-block transition-colors duration-200" 
                       onclick="alert('This would take you to the legitimate CyberQuest password reset page.')">
                        Reset Your Password
                    </a>
                </div>
                
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-4">
                    <p class="text-yellow-800 font-semibold text-sm">🔒 Security Notice</p>
                    <p class="text-yellow-700 text-sm">If you didn't request this password reset, please ignore this email. Your account remains secure and no changes have been made.</p>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    For security reasons, we never ask for your current password, personal information, or account details via email.
                </p>
                
                <p class="text-gray-800 text-sm">
                    If you have questions, contact our support team at support@cyberquest.com
                </p>
                
                <p class="text-gray-800 text-sm mt-4">
                    Best regards,<br>
                    <span class="font-bold">CyberQuest Security Team</span><br>
                    <span class="text-xs text-gray-600">noreply@cyberquest.com</span>
                </p>
                
                <div class="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <p>CyberQuest Training Platform | 123 Security Blvd, Tech City, TC 12345</p>
                    <p class="mt-1">This is an automated message. For support, visit help.cyberquest.com</p>
                </div>
            </div>
        `;

        return this.createStyledContainer(
            content,
            'bg-green-50 border-green-200',
            headerInfo
        );
    }
}

export const PasswordResetLegitimate = new PasswordResetLegitimateClass().toEmailObject();
