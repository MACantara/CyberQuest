import { BaseEmail } from './base-email.js';

class CyberquestWelcomeEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'cyberquest-welcome',
            folder: 'inbox',
            sender: 'welcome@cyberquest.com',
            subject: 'Welcome to CyberQuest Training',
            timestamp: BaseEmail.createTimestamp(3, 15), // 3 hours 15 minutes ago
            suspicious: false,
            priority: 'normal'
        });
    }

    createBody() {
        const headerInfo = {
            bgColor: 'bg-green-600',
            icon: 'shield-check',
            titleColor: 'text-green-900',
            subtitleColor: 'text-green-700',
            title: 'CyberQuest Training Platform',
            subtitle: 'Professional Cybersecurity Education'
        };

        const content = `
            <div class="bg-white border border-green-200 rounded-lg p-4">
                <h2 class="text-base font-semibold text-green-900 mb-3">Welcome to Your Cybersecurity Journey!</h2>
                <p class="text-gray-800 text-sm mb-3">
                    Dear Trainee,
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    Thank you for joining CyberQuest Training Platform. You're now enrolled in our comprehensive cybersecurity education program.
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    During this simulation, you'll learn to identify and respond to various cyber threats including:
                </p>
                <ul class="text-gray-800 text-sm mb-3 list-disc list-inside">
                    <li>Phishing emails and suspicious links</li>
                    <li>Fraudulent websites and scam pages</li>
                    <li>Network security monitoring</li>
                    <li>Safe browsing practices</li>
                </ul>
                <p class="text-gray-800 text-sm mb-3">
                    Remember: Always verify the authenticity of emails and websites before sharing personal information.
                </p>
                <p class="text-gray-800 text-sm mt-4">
                    Stay safe and happy learning!<br>
                    <span class="font-bold text-green-900">The CyberQuest Team</span>
                </p>
            </div>
        `;

        return this.createStyledContainer(
            content,
            'bg-green-50 border-green-200',
            headerInfo
        );
    }
}

// Export as email object for compatibility
export const CyberquestWelcomeEmail = new CyberquestWelcomeEmailClass().toEmailObject();
