import { BaseEmail } from './base-email.js';

class FakePaypalEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'paypal-phish-001',
            sender: 'service@paypal.com',
            subject: 'Your account has been limited - Action required',
            timestamp: BaseEmail.createTimestamp(0, 45), // 45 minutes ago
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        return `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0 auto; background: #ffffff;">
                <!-- PayPal Header -->
                <div style="background: #003087; padding: 20px 30px;">
                    <div style="display: flex; align-items: center;">
                        <div style="color: white; font-size: 28px; font-weight: bold; letter-spacing: -1px;">
                            <span style="color: #0070ba;">Pay</span><span style="color: #ffffff;">Pal</span>
                        </div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 30px;">
                    <h1 style="color: #2c2e2f; font-size: 24px; font-weight: 300; margin: 0 0 20px 0;">We've limited your account</h1>
                    
                    <p style="color: #2c2e2f; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                        Hello,
                    </p>
                    
                    <p style="color: #2c2e2f; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                        We've noticed some unusual activity on your PayPal account and have temporarily limited access to keep your account secure.
                    </p>
                    
                    <!-- Security Alert Box -->
                    <div style="background: #fff8e1; border-left: 4px solid #ffc107; padding: 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
                        <div style="display: flex; align-items: flex-start;">
                            <div style="color: #ff6600; margin-right: 12px; font-size: 18px;">⚠️</div>
                            <div>
                                <h3 style="color: #b8860b; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Account Security Alert</h3>
                                <p style="color: #8a6914; font-size: 14px; margin: 0; line-height: 1.4;">
                                    Multiple login attempts from unrecognized devices have been detected on your account.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <p style="color: #2c2e2f; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                        To restore full access to your account, please confirm your identity by updating your account information.
                    </p>
                    
                    <!-- Activity Details -->
                    <div style="background: #f7f7f7; border: 1px solid #e5e5e5; border-radius: 4px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #2c2e2f; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">Recent Activity Summary</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="border-bottom: 1px solid #e5e5e5;">
                                <td style="color: #666; font-size: 14px; padding: 8px 0; font-weight: 600;">Date:</td>
                                <td style="color: #2c2e2f; font-size: 14px; padding: 8px 0;">November 18, 2024, 1:22 PM PST</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e5e5e5;">
                                <td style="color: #666; font-size: 14px; padding: 8px 0; font-weight: 600;">Location:</td>
                                <td style="color: #2c2e2f; font-size: 14px; padding: 8px 0;">Unknown (IP: 185.220.101.47)</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e5e5e5;">
                                <td style="color: #666; font-size: 14px; padding: 8px 0; font-weight: 600;">Device:</td>
                                <td style="color: #2c2e2f; font-size: 14px; padding: 8px 0;">Unrecognized Windows Device</td>
                            </tr>
                            <tr>
                                <td style="color: #666; font-size: 14px; padding: 8px 0; font-weight: 600;">Action:</td>
                                <td style="color: #dc3545; font-size: 14px; padding: 8px 0; font-weight: 600;">Failed login attempt</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Action Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="background: #0070ba; color: white; padding: 14px 40px; text-decoration: none; border-radius: 20px; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 2px 8px rgba(0, 112, 186, 0.3);" 
                           class="open-browser-link" data-url="https://paypal-security.net/account/confirm">
                            Confirm Your Identity
                        </a>
                    </div>
                    
                    <p style="color: #2c2e2f; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                        We'll ask you to confirm some details about your account. This usually takes about 5-10 minutes.
                    </p>
                    
                    <!-- Alternative Actions -->
                    <div style="background: #f7f7f7; border-radius: 4px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #2c2e2f; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">What you can do</h3>
                        <div style="space-y: 8px;">
                            <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                                <span style="color: #0070ba; margin-right: 8px;">•</span>
                                <span style="color: #2c2e2f; font-size: 14px;">Complete identity verification to remove limitations</span>
                            </div>
                            <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                                <span style="color: #0070ba; margin-right: 8px;">•</span>
                                <span style="color: #2c2e2f; font-size: 14px;">Update your security settings and add two-factor authentication</span>
                            </div>
                            <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                                <span style="color: #0070ba; margin-right: 8px;">•</span>
                                <span style="color: #2c2e2f; font-size: 14px;">Review and confirm your payment methods</span>
                            </div>
                        </div>
                    </div>
                    
                    <p style="color: #2c2e2f; font-size: 15px; line-height: 1.6; margin-bottom: 5px;">
                        Thanks,<br>
                        <strong>PayPal Account Review Team</strong>
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background: #f7f7f7; padding: 20px 30px; border-top: 1px solid #e5e5e5;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="color: #0070ba; font-size: 20px; font-weight: bold; margin-bottom: 10px;">
                            <span style="color: #0070ba;">Pay</span><span style="color: #003087;">Pal</span>
                        </div>
                    </div>
                    
                    <div style="color: #666; font-size: 12px; line-height: 1.4; text-align: center;">
                        <p style="margin: 0 0 8px 0;">
                            <strong>PayPal Inc.</strong><br>
                            2211 North First Street<br>
                            San Jose, CA 95131
                        </p>
                        <p style="margin: 0 0 16px 0;">
                            This is an automated security notification. Please do not reply to this email.
                        </p>
                        <div style="border-top: 1px solid #e5e5e5; padding-top: 16px;">
                            <a href="#" style="color: #0070ba; font-size: 12px; text-decoration: none; margin-right: 16px;">Privacy Policy</a>
                            <a href="#" style="color: #0070ba; font-size: 12px; text-decoration: none; margin-right: 16px;">User Agreement</a>
                            <a href="#" style="color: #0070ba; font-size: 12px; text-decoration: none;">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export const FakePaypalEmail = new FakePaypalEmailClass().toEmailObject();
