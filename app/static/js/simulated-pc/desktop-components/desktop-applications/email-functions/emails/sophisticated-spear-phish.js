import { BaseEmail } from './base-email.js';

class SophisticatedSpearPhishClass extends BaseEmail {
    constructor() {
        super({
            id: 'spear-phish-001',
            sender: 'michael.chen@techcorp-industries.com',
            subject: 'Re: Q4 Budget Approval - Urgent Signature Required',
            time: '1 hour ago',
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        const headerInfo = {
            icon: 'briefcase',
            bgColor: 'bg-gray-600',
            title: 'TechCorp Industries',
            titleColor: 'text-gray-800',
            subtitle: 'Finance Department',
            subtitleColor: 'text-gray-600'
        };

        const content = `
            <div class="bg-white border border-gray-200 rounded-lg p-4">
                <div class="text-xs text-gray-500 mb-3">
                    From: Michael Chen &lt;michael.chen@techcorp-industries.com&gt;<br>
                    To: finance-team@cyberquest.com<br>
                    Subject: Re: Q4 Budget Approval - Urgent Signature Required
                </div>
                
                <p class="text-gray-800 text-sm mb-3">Hi Team,</p>
                <p class="text-gray-800 text-sm mb-3">
                    Following up on our call yesterday regarding the Q4 budget adjustments. The board meeting has been moved up to this Friday, so we need to finalize the documentation today.
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    I've prepared the updated budget allocation spreadsheet with the changes we discussed. As mentioned, the new compliance requirements from our recent audit need to be reflected in our financial projections.
                </p>
                
                <div class="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                    <p class="text-blue-800 font-semibold text-sm mb-2">📎 Document Attached:</p>
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-green-600 rounded mr-2 flex items-center justify-center">
                            <i class="bi bi-file-earmark-excel text-white text-xs"></i>
                        </div>
                        <div>
                            <p class="font-medium text-sm">Q4_Budget_Final_2024.xlsx</p>
                            <p class="text-xs text-gray-600">2.4 MB - Encrypted with AES-256</p>
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    Please review the attached document and provide your digital signature through our secure portal. The file is password-protected - use the same credentials from our shared workspace.
                </p>
                
                <div class="text-center my-4">
                    <a href="#" class="open-browser-link bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-block transition-colors duration-200" 
                       data-url="https://secure-docs.techcorp-portal.net/auth/sign">
                        Access Secure Document Portal
                    </a>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    Time is critical here - the CFO needs this by 3 PM today to present to the board. Let me know if you have any questions.
                </p>
                
                <p class="text-gray-800 text-sm mb-3">
                    Also, IT mentioned they're rolling out new security protocols next week. Make sure your credentials are updated in the system to avoid any access issues.
                </p>
                
                <p class="text-gray-800 text-sm">
                    Best regards,<br>
                    <span class="font-bold">Michael Chen</span><br>
                    <span class="text-xs text-gray-600">Senior Finance Manager | TechCorp Industries<br>
                    Direct: (555) 123-4567 | michael.chen@techcorp-industries.com</span>
                </p>
                
                <div class="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <p><strong>CONFIDENTIAL:</strong> This email and any attachments contain confidential information. If you are not the intended recipient, please delete this message.</p>
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

export const SophisticatedSpearPhish = new SophisticatedSpearPhishClass().toEmailObject();
