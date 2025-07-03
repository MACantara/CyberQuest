import { BaseEmail } from './base-email.js';

class NigerianPrinceEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'nigerian-prince-001',
            sender: 'prince.emmanuel@royal-treasury.ng',
            subject: 'URGENT BUSINESS PROPOSAL - $10,500,000 USD INHERITANCE',
            timestamp: BaseEmail.createSpecificTimestamp(2024, 11, 16, 14, 20), // 2 days ago
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        const headerInfo = {
            icon: 'crown',
            bgColor: 'bg-yellow-600',
            title: 'Royal Nigerian Treasury',
            titleColor: 'text-yellow-800',
            subtitle: 'International Transfer Department',
            subtitleColor: 'text-yellow-600'
        };

        const content = `
            <div class="bg-white border border-yellow-200 rounded-lg p-4">
                <p class="text-gray-800 text-sm mb-3">Dear Friend,</p>
                <p class="text-gray-800 text-sm mb-3">
                    I am Prince Emmanuel from Nigeria. I have discovered an unclaimed inheritance of <strong>$10,500,000 USD</strong> belonging to a distant relative who shares your last name.
                    As I am unable to claim these funds myself, I am seeking your assistance to transfer the money to your account. You will receive <strong>40% of the total amount</strong> for your help.
                </p>
                
                <div class="bg-yellow-100 border border-yellow-300 rounded p-3 mb-4">
                    <h4 class="font-semibold text-yellow-800 text-sm mb-2">💰 INHERITANCE DETAILS</h4>
                    <div class="text-yellow-700 text-sm space-y-1">
                        <div class="flex justify-between">
                            <span>Total Amount:</span>
                            <span class="font-bold">$10,500,000 USD</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Your Share (40%):</span>
                            <span class="font-bold">$4,200,000 USD</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Processing Fee:</span>
                            <span>Only $2,500 USD</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Time Required:</span>
                            <span>5-7 business days</span>
                        </div>
                    </div>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    This is a completely legal transaction overseen by the Central Bank of Nigeria. All documentation is prepared and waiting for your signature.
                </p>
                
                <p class="text-gray-800 text-sm mb-3">
                    To proceed, please reply with your full name, address, phone number, and bank details. I will also need a small processing fee of $2,500 to cover legal documentation and transfer costs.
                </p>
                
                <div class="bg-green-50 border border-green-200 rounded p-3 mb-4">
                    <h4 class="font-semibold text-green-800 text-sm mb-2">✅ WHAT MAKES THIS LEGITIMATE:</h4>
                    <ul class="text-green-700 text-sm list-disc ml-4 space-y-1">
                        <li>Approved by Central Bank of Nigeria</li>
                        <li>All legal documents prepared by certified attorneys</li>
                        <li>Insurance coverage provided by Lloyd's of London</li>
                        <li>No risk to you - money back guarantee</li>
                    </ul>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    Please reply with your banking information as soon as possible so we can proceed. This is a confidential matter and requires your immediate attention.
                </p>
                
                <p class="text-gray-800 text-sm">
                    Sincerely,<br>
                    <span class="font-bold text-yellow-900">Prince Emmanuel</span><br>
                    <span class="text-xs text-gray-600">Royal Nigerian Treasury Department<br>
                    Central Bank of Nigeria Authorization #CBN-2024-INT-7749</span>
                </p>
            </div>
            <div class="bg-yellow-100 border border-yellow-300 rounded p-3 mt-4">
                <p class="font-medium text-yellow-800">
                    ⚠️ URGENT: Respond within 48 hours or this opportunity will be lost forever!
                </p>
                <p class="text-yellow-700 text-sm mt-1">
                    Three other candidates are being considered. First to respond gets the full 40% share.
                </p>
            </div>
        `;

        return this.createStyledContainer(
            content,
            'bg-yellow-50 border-yellow-200',
            headerInfo
        );
    }
}

export const NigerianPrinceEmail = new NigerianPrinceEmailClass().toEmailObject();
