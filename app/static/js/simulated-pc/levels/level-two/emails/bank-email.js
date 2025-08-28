import { BaseEmail } from './base-email.js';

class BankEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'bank-phish-001',
            sender: 'security@securebank-alerts.com',
            subject: 'URGENT: Account Security Alert - Immediate Action Required',
            timestamp: BaseEmail.createTimestamp(1, 30), // 1 hour 30 minutes ago
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        return `
            <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px;">
                <!-- Bank Header -->
                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 20px; border-radius: 8px 8px 0 0;">
                    <div style="color: white; font-size: 24px; font-weight: bold; display: flex; align-items: center;">
                        <div style="width: 40px; height: 40px; background: white; border-radius: 50%; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #1e3a8a; font-weight: bold; font-size: 20px;">$</span>
                        </div>
                        Secure Bank
                    </div>
                    <div style="color: #bfdbfe; font-size: 14px; margin-top: 5px;">Account Security Department</div>
                </div>
                
                <!-- Alert Banner -->
                <div style="background: #dc2626; color: white; padding: 15px; text-align: center; font-weight: bold; font-size: 16px;">
                    🚨 URGENT SECURITY ALERT 🚨
                </div>
                
                <!-- Main Content -->
                <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 25px;">
                        <h2 style="color: #dc2626; margin: 0 0 15px 0; font-size: 20px;">Account Security Alert</h2>
                        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                            Dear Valued Customer,
                        </p>
                        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                            We have detected <strong style="color: #dc2626;">suspicious activity</strong> on your account ending in ****4729. 
                            For your protection, we have temporarily restricted access to your online banking services.
                        </p>
                    </div>
                    
                    <!-- Threat Details Box -->
                    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">SUSPICIOUS ACTIVITY DETECTED</h3>
                        <div style="color: #7f1d1d; font-size: 14px; line-height: 1.5;">
                            <div style="margin-bottom: 8px;">• <strong>Unauthorized login attempt</strong> from IP: 203.0.113.45 (Nigeria)</div>
                            <div style="margin-bottom: 8px;">• <strong>Failed transaction</strong> of $2,847.99</div>
                            <div style="margin-bottom: 8px;">• <strong>Password change request</strong> from unknown device</div>
                            <div style="color: #dc2626; font-weight: bold; margin-top: 15px;">⏰ Account will be permanently closed in 24 hours if not verified</div>
                        </div>
                    </div>
                    
                    <!-- Action Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); text-transform: uppercase;" 
                           class="open-browser-link" data-url="https://secure-verify-bank.net/account/verification">
                            🔒 VERIFY ACCOUNT IMMEDIATELY
                        </a>
                    </div>
                    
                    <!-- Required Information -->
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">To restore full access, please provide:</h3>
                        <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                            ✓ Full Social Security Number<br>
                            ✓ Account PIN and Password<br>
                            ✓ Mother's maiden name<br>
                            ✓ Credit card number and CVV
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                        <p style="color: #374151; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                            Sincerely,<br>
                            <strong>Secure Bank Security Team</strong>
                        </p>
                        <div style="color: #9ca3af; font-size: 12px; line-height: 1.4;">
                            This is an automated security message. Please do not reply to this email.<br>
                            Secure Bank | 123 Financial District, Banking City, BC 12345<br>
                            © 2024 Secure Bank. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export const BankEmail = new BankEmailClass().toEmailObject();
