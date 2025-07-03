import { BaseEmail } from './base-email.js';

class CompanyUpdateEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'company-update-001',
            sender: 'noreply@cyberquest.com',
            subject: 'Weekly Security Update - Important System Maintenance',
            time: '2 hours ago',
            suspicious: false,
            priority: 'normal'
        });
    }

    createBody() {
        const headerInfo = {
            icon: 'shield-check',
            bgColor: 'bg-blue-500',
            title: 'CyberQuest Security Team',
            titleColor: 'text-blue-800',
            subtitle: 'Weekly Security Update',
            subtitleColor: 'text-blue-600'
        };

        const content = `
            <div class="bg-white border border-blue-200 rounded-lg p-4">
                <p class="text-gray-800 text-sm mb-3">Dear CyberQuest Team,</p>
                <p class="text-gray-800 text-sm mb-3">
                    This is our weekly security update to inform you about upcoming system maintenance and security improvements.
                </p>
                <div class="bg-blue-50 p-3 rounded mb-3">
                    <h4 class="font-semibold text-blue-800 mb-2">Scheduled Maintenance:</h4>
                    <ul class="text-blue-700 text-sm space-y-1">
                        <li>• Date: Saturday, November 25th, 2024</li>
                        <li>• Time: 2:00 AM - 4:00 AM EST</li>
                        <li>• Duration: Approximately 2 hours</li>
                        <li>• Impact: Training platforms will be temporarily unavailable</li>
                    </ul>
                </div>
                <p class="text-gray-800 text-sm mb-3">
                    During this maintenance window, we will be implementing enhanced security protocols and updating our training modules based on the latest cybersecurity threats.
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    If you have any questions, please contact our support team at support@cyberquest.com
                </p>
                <p class="text-gray-800 text-sm">
                    Best regards,<br>
                    <span class="font-bold text-blue-900">CyberQuest Security Team</span><br>
                    <span class="text-xs text-gray-600">security@cyberquest.com</span>
                </p>
            </div>
        `;

        return this.createStyledContainer(
            content,
            'bg-blue-50 border-blue-200',
            headerInfo
        );
    }
}

export const CompanyUpdateEmail = new CompanyUpdateEmailClass().toEmailObject();
