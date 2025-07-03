import { BaseEmail } from './base-email.js';

class CompanyUpdateEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'company-update-001',
            sender: 'noreply@cyberquest.com',
            subject: 'Weekly Security Update - Important System Maintenance',
            timestamp: BaseEmail.createTimestamp(2, 30), // 2 hours 30 minutes ago
            suspicious: false,
            priority: 'normal'
        });
    }

    createBody() {
        return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <!-- Header -->
                <div style="background: #059669; padding: 0;">
                    <div style="padding: 20px 30px;">
                        <div style="display: flex; align-items: center;">
                            <div style="background: white; width: 50px; height: 50px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                <span style="color: #059669; font-weight: bold; font-size: 24px;">CQ</span>
                            </div>
                            <div>
                                <div style="color: white; font-size: 22px; font-weight: 600;">CyberQuest</div>
                                <div style="color: #a7f3d0; font-size: 13px;">Internal Communications</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Content -->
                <div style="padding: 30px;">
                    <div style="border-left: 4px solid #059669; padding-left: 20px; margin-bottom: 25px;">
                        <h1 style="color: #065f46; margin: 0 0 5px 0; font-size: 24px; font-weight: 600;">Weekly Security Update</h1>
                        <p style="color: #6b7280; margin: 0; font-size: 14px;">November 18, 2024 | Week 47</p>
                    </div>
                    
                    <div style="color: #374151; line-height: 1.6; font-size: 15px;">
                        <p style="margin-bottom: 20px;">
                            <strong>Hello Team,</strong>
                        </p>
                        
                        <p style="margin-bottom: 20px;">
                            This week's security update includes important information about upcoming system maintenance 
                            and new security protocols that will be implemented across all departments.
                        </p>
                        
                        <!-- Maintenance Schedule -->
                        <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 25px 0;">
                            <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">
                                🔧 Scheduled Maintenance Window
                            </h3>
                            <div style="color: #075985; font-size: 14px;">
                                <div style="margin-bottom: 8px;"><strong>Date:</strong> Saturday, November 23, 2024</div>
                                <div style="margin-bottom: 8px;"><strong>Time:</strong> 2:00 AM - 6:00 AM EST</div>
                                <div style="margin-bottom: 8px;"><strong>Affected Systems:</strong> Email, VPN, Internal Portal</div>
                                <div><strong>Expected Downtime:</strong> 2-3 hours</div>
                            </div>
                        </div>
                        
                        <!-- Security Updates -->
                        <h3 style="color: #065f46; margin: 25px 0 15px 0; font-size: 18px;">Security Protocol Updates</h3>
                        
                        <div style="background: #f6fdf9; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 15px;">
                            <h4 style="color: #047857; margin: 0 0 8px 0; font-size: 15px;">✅ Multi-Factor Authentication</h4>
                            <p style="color: #065f46; margin: 0; font-size: 14px;">
                                MFA will be mandatory for all systems starting December 1st. Please ensure your 
                                authenticator app is configured.
                            </p>
                        </div>
                        
                        <div style="background: #fefbf3; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 15px;">
                            <h4 style="color: #d97706; margin: 0 0 8px 0; font-size: 15px;">⚠️ Password Policy Update</h4>
                            <p style="color: #92400e; margin: 0; font-size: 14px;">
                                New password requirements include 12+ characters with special symbols. 
                                Update by November 30th.
                            </p>
                        </div>
                        
                        <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px;">
                            <h4 style="color: #1d4ed8; margin: 0 0 8px 0; font-size: 15px;">📚 Security Training</h4>
                            <p style="color: #1e40af; margin: 0; font-size: 14px;">
                                Q4 cybersecurity training modules are now available in the learning portal. 
                                Completion deadline: December 15th.
                            </p>
                        </div>
                        
                        <!-- Action Items -->
                        <div style="background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; margin: 25px 0;">
                            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">📋 Action Items</h3>
                            <div style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                                <div style="margin-bottom: 8px;">• Configure MFA by November 30th</div>
                                <div style="margin-bottom: 8px;">• Update passwords to meet new requirements</div>
                                <div style="margin-bottom: 8px;">• Complete security training modules</div>
                                <div>• Test VPN connectivity before maintenance window</div>
                            </div>
                        </div>
                        
                        <p style="margin-bottom: 20px;">
                            If you have any questions or concerns, please reach out to the IT Security team 
                            at <a href="mailto:security@cyberquest.com" style="color: #059669;">security@cyberquest.com</a>.
                        </p>
                        
                        <p style="margin-bottom: 5px;">
                            Best regards,<br>
                            <strong>CyberQuest IT Security Team</strong>
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f9fafb; padding: 20px 30px; border-top: 1px solid #e5e7eb;">
                    <div style="color: #6b7280; font-size: 12px; line-height: 1.4;">
                        <p style="margin: 0 0 5px 0;">
                            <strong>CyberQuest Training Platform</strong><br>
                            123 Education Blvd, Tech City, TC 12345
                        </p>
                        <p style="margin: 0;">
                            This message was sent to all employees. For support, visit 
                            <a href="#" style="color: #059669;">help.cyberquest.com</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}

export const CompanyUpdateEmail = new CompanyUpdateEmailClass().toEmailObject();
