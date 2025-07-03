import { BaseEmail } from './base-email.js';

class BankEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'bank-email',
            folder: 'inbox',
            sender: 'account-security@verifysystem-alerts.net',
            subject: 'URGENT: Account Verification Required',
            time: '3 hours ago',
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        const headerInfo = {
            bgColor: 'bg-blue-600',
            icon: 'bank',
            titleColor: 'text-blue-900',
            subtitleColor: 'text-blue-700',
            title: 'SecureBank Online',
            subtitle: 'Your Trusted Banking Partner'
        };

        const urgentAlert = `
            <div class="bg-red-100 border border-red-300 rounded p-3 mb-4 flex items-center">
                <i class="bi bi-exclamation-triangle text-red-600 mr-2"></i>
                <div>
                    <span class="font-semibold text-red-800">URGENT SECURITY ALERT!</span>
                    <p class="text-red-700 text-xs mt-1">Your account will be suspended in 24 hours due to suspicious activity. Please verify your credentials immediately!</p>
                </div>
            </div>
        `;

        const content = `
            ${urgentAlert}
            <div class="bg-white border border-red-200 rounded-lg p-4 mb-4">
                <h2 class="text-base font-semibold text-red-900 mb-2">Emergency Account Verification Required</h2>
                <p class="text-gray-800 text-sm mb-3">
                    Dear Customer,
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    We have detected suspicious activity on your bank account. For your protection, your online access has been <strong>immediately suspended</strong>.
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    To restore access and avoid permanent account closure, please 
                    <a href="#" 
                       class="text-blue-600 underline open-browser-link font-semibold" 
                       data-url="https://secure-verify-support.com">
                       verify your account now
                    </a> 
                    by confirming your personal and banking information.
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    Failure to act within 24 hours will result in your account being permanently locked.
                </p>
                <p class="text-gray-800 text-sm mt-4">
                    Thank you for your prompt attention.<br>
                    <span class="font-bold text-blue-900">SecureBank Security Team</span>
                </p>
            </div>
            <div class="text-center mt-4">
                <span class="text-red-600 font-bold text-xs">Act fast! Your account security depends on immediate verification!</span>
                <p class="text-xs text-gray-600 mt-1">This is the ONLY way to prevent account closure.</p>
            </div>
        `;

        return this.createStyledContainer(
            content,
            'bg-blue-50 border-blue-200',
            headerInfo
        );
    }
}

// Export as email object for compatibility
export const BankEmail = new BankEmailClass().toEmailObject();
