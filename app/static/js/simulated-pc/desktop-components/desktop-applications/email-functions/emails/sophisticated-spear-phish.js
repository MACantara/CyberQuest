import { BaseEmail } from './base-email.js';

class SophisticatedSpearPhishClass extends BaseEmail {
    constructor() {
        super({
            id: 'spear-phish-001',
            sender: 'michael.chen@techcorp-industries.com',
            subject: 'Re: Q4 Budget Approval - Urgent Signature Required',
            timestamp: BaseEmail.createTimestamp(1, 0), // 1 hour ago
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; color: #2c2c2c;">
                <!-- Corporate Header -->
                <div style="background: #1e3a8a; padding: 20px 30px; border-bottom: 3px solid #3b82f6;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <div style="background: white; width: 45px; height: 45px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <span style="color: #1e3a8a; font-weight: bold; font-size: 18px;">TC</span>
                            </div>
                            <div>
                                <div style="color: white; font-size: 20px; font-weight: 600;">TechCorp Industries</div>
                                <div style="color: #bfdbfe; font-size: 13px;">Global Technology Solutions</div>
                            </div>
                        </div>
                        <div style="color: #bfdbfe; font-size: 11px; text-align: right;">
                            CONFIDENTIAL<br>
                            Internal Communication
                        </div>
                    </div>
                </div>
                
                <!-- Email Threading Header -->
                <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 15px 30px; font-size: 12px; color: #64748b;">
                    <div style="margin-bottom: 8px;">
                        <strong>From:</strong> Michael Chen &lt;michael.chen@techcorp-industries.com&gt;<br>
                        <strong>To:</strong> Finance Team &lt;finance-team@cyberquest.com&gt;<br>
                        <strong>Subject:</strong> Re: Q4 Budget Approval - Urgent Signature Required<br>
                        <strong>Date:</strong> Monday, November 18, 2024 1:45 PM PST
                    </div>
                    <div style="font-style: italic; color: #94a3b8;">
                        Thread: [TechCorp-Finance] Q4 Budget Review → Budget Adjustments → Final Approval
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 25px 30px;">
                    <!-- Reply Chain Indicator -->
                    <div style="border-left: 3px solid #e5e7eb; padding-left: 15px; margin-bottom: 25px; color: #6b7280; font-size: 13px;">
                        <div style="margin-bottom: 5px;"><strong>Previous message (Nov 17, 3:42 PM):</strong></div>
                        <div style="font-style: italic;">"Michael, the compliance requirements from our recent audit need to be reflected in the Q4 projections. Can you prepare the updated documentation for board review?" - Sarah Williams, CFO</div>
                    </div>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 18px;">
                        Hi Team,
                    </p>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 18px;">
                        Following up on Sarah's request and our call yesterday regarding the Q4 budget adjustments. 
                        I've been working with the compliance team to address the audit requirements.
                    </p>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 18px;">
                        The board meeting has been moved up to this Friday (Nov 22) due to the upcoming holiday, 
                        so we need to finalize the documentation today to allow time for legal review.
                    </p>
                    
                    <!-- Document Section -->
                    <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 25px 0;">
                        <h3 style="color: #0c4a6e; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                            📎 Required Documentation
                        </h3>
                        
                        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <div style="background: #22c55e; color: white; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 14px;">
                                    📊
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #1e293b; font-size: 14px;">Q4_Budget_Final_Compliance_2024.xlsx</div>
                                    <div style="color: #64748b; font-size: 12px;">3.2 MB • Created: Nov 18, 2024 12:30 PM</div>
                                </div>
                            </div>
                            <div style="color: #475569; font-size: 13px; line-height: 1.5;">
                                Updated budget allocation spreadsheet with compliance adjustments per audit requirements. 
                                <span style="color: #dc2626; font-weight: 600;">Encrypted with enterprise-grade security.</span>
                            </div>
                        </div>
                        
                        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 12px; margin-bottom: 15px;">
                            <div style="color: #92400e; font-size: 13px; font-weight: 600;">
                                ⚠️ Document requires digital signature from department heads before board submission
                            </div>
                        </div>
                        
                        <p style="color: #475569; font-size: 14px; margin: 0;">
                            Please review the attached document and provide your digital signature through our secure portal. 
                            Use your standard enterprise credentials from our shared workspace.
                        </p>
                    </div>
                    
                    <!-- Action Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);" 
                           class="open-browser-link" data-url="https://secure-docs.techcorp-portal.net/auth/sign">
                            Access Secure Document Portal
                        </a>
                    </div>
                    
                    <!-- Urgency Section -->
                    <div style="background: #fef2f2; border-left: 4px solid #f87171; padding: 16px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h4 style="color: #dc2626; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
                            ⏰ Time-Critical Action Required
                        </h4>
                        <div style="color: #b91c1c; font-size: 13px; line-height: 1.5;">
                            <div style="margin-bottom: 6px;">• <strong>Deadline:</strong> Today, 4:00 PM PST</div>
                            <div style="margin-bottom: 6px;">• <strong>Board Review:</strong> Tomorrow, 9:00 AM PST</div>
                            <div>• <strong>Legal Compliance:</strong> Must be completed before market close</div>
                        </div>
                    </div>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 18px;">
                        As discussed in our department meeting, the new compliance protocols require all financial 
                        documentation to be digitally signed using our enhanced security platform. The system will 
                        verify your identity using the same credentials from our integrated workspace environment.
                    </p>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 18px;">
                        I've coordinated with IT Security to ensure the platform is ready for the increased traffic 
                        from all department submissions. They mentioned there might be brief authentication delays 
                        due to the new security protocols, but the system should handle all requests efficiently.
                    </p>
                    
                    <!-- Contact Information -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;">
                        <div style="color: #475569; font-size: 13px;">
                            <strong>Need assistance?</strong> Contact our Financial Operations team:<br>
                            • IT Support: ext. 4501 (for platform access issues)<br>
                            • Compliance: ext. 4502 (for documentation questions)<br>
                            • Emergency: michael.chen@techcorp-industries.com
                        </div>
                    </div>
                    
                    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-top: 25px;">
                        Best regards,<br>
                        <strong>Michael Chen</strong><br>
                        <span style="color: #6b7280; font-size: 13px;">
                            Senior Finance Manager | TechCorp Industries<br>
                            Direct: (555) 123-4567 | Mobile: (555) 987-6543<br>
                            michael.chen@techcorp-industries.com
                        </span>
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background: #f1f5f9; padding: 20px 30px; border-top: 1px solid #cbd5e1;">
                    <div style="color: #64748b; font-size: 11px; line-height: 1.4;">
                        <div style="margin-bottom: 10px;">
                            <strong>CONFIDENTIAL & PRIVILEGED:</strong> This email and any attachments contain confidential and proprietary information 
                            belonging to TechCorp Industries. If you are not the intended recipient, please delete this message immediately 
                            and notify the sender.
                        </div>
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center;">
                            <strong>TechCorp Industries</strong> | 1500 Technology Drive, Silicon Valley, CA 94025<br>
                            Phone: (555) 123-4500 | <a href="https://techcorp-industries.com" style="color: #3b82f6;">www.techcorp-industries.com</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export const SophisticatedSpearPhish = new SophisticatedSpearPhishClass().toEmailObject();
