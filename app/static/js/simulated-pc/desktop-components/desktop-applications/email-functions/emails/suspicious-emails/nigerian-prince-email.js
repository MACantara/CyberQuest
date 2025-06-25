import { BaseEmail } from '../base-email.js';

class SuspiciousEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'suspicious-email',
            folder: 'inbox',
            sender: 'prince.nigeria@totally-real.com',
            subject: 'URGENT: Claim Your Inheritance!',
            time: '2 min ago',
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        const headerInfo = {
            bgColor: 'bg-yellow-600',
            icon: 'crown',
            titleColor: 'text-yellow-900',
            subtitleColor: 'text-yellow-700',
            title: 'Royal Nigerian Treasury',
            subtitle: 'Official Government Communication'
        };

        const content = `
            <div class="bg-white border border-yellow-200 rounded-lg p-4">
                <p class="text-gray-800 text-sm mb-3">Dear Friend,</p>
                <p class="text-gray-800 text-sm mb-3">
                    I am Prince Emmanuel from Nigeria. I have discovered an unclaimed inheritance of <strong>$10,500,000 USD</strong> belonging to a distant relative who shares your last name.
                    As I am unable to claim these funds myself, I am seeking your assistance to transfer the money to your account. You will receive <strong>40% of the total amount</strong> for your help.
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    Please reply with your full name, address, and bank details as soon as possible so we can proceed. This is a confidential matter and requires your immediate attention.
                </p>
                <p class="text-gray-800 text-sm">
                    Sincerely,<br>
                    <span class="font-bold text-yellow-900">Prince Emmanuel</span><br>
                    <span class="text-xs text-gray-600">Royal Nigerian Treasury Department</span>
                </p>
            </div>
            <div class="bg-yellow-100 border border-yellow-300 rounded p-3 mt-4">
                <p class="text-yellow-800 text-xs font-semibold">
                    ⚠️ URGENT: Respond within 48 hours or this opportunity will be lost forever!
                </p>
            </div>
        `;

        const trainingAlert = this.createTrainingAlert(
            'Classic "Nigerian Prince" scam! Red flags: too-good-to-be-true offer, urgent timeline, requests for personal information, and promises of easy money.',
            'danger'
        );

        return this.createStyledContainer(
            content + trainingAlert,
            'bg-yellow-50 border-yellow-200',
            headerInfo
        );
    }
}

// Export as email object for compatibility
export const SuspiciousEmail = new SuspiciousEmailClass().toEmailObject();
