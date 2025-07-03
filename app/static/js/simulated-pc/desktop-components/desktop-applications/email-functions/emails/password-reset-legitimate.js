import { BaseEmail } from './base-email.js';

class PasswordResetLegitimateClass extends BaseEmail {
    constructor() {
        super({
            id: 'password-reset-001',
            sender: 'noreply@cyberquest.com',
            subject: 'Reset your CyberQuest password',
            timestamp: BaseEmail.createTimestamp(0, 30), // 30 minutes ago
            suspicious: false,
            priority: 'normal'
        });
    }

    createBody() {
        return `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; line-height: 1.6;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px;">
                    <div style="text-align: center;">
                        <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                            <span style="color: #667eea; font-weight: bold; font-size: 24px;">CQ</span>
                        </div>
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Reset your password</h2>
                    
                    <p style="color: #4b5563; font-size: 16px; margin-bottom: 20px;">
                        Hi there,
                    </p>
                    
                    <p style="color: #4b5563; font-size: 16px; margin-bottom: 25px;">
                        Someone requested a password reset for your CyberQuest account. If this was you, click the button below to set a new password:
                    </p>
                    
                    <!-- Reset Button -->
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                            Reset My Password
                        </a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin: 25px 0; text-align: center;">
                        This link will expire in 24 hours for security reasons.
                    </p>
                    
                    <!-- Security Information -->
                    <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="color: #0c4a6e; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">
                            🔒 Security Information
                        </h3>
                        <div style="color: #075985; font-size: 14px; line-height: 1.5;">
                            <div style="margin-bottom: 8px;"><strong>Request time:</strong> November 18, 2024 at 2:15 PM PST</div>
                            <div style="margin-bottom: 8px;"><strong>IP address:</strong> 192.168.1.100</div>
                            <div style="margin-bottom: 8px;"><strong>Device:</strong> Chrome on Windows 11</div>
                            <div><strong>Location:</strong> San Francisco, CA (approximate)</div>
                        </div>
                    </div>
                    
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 600;">
                            If you didn't request this password reset, please ignore this email or 
                            <a href="mailto:security@cyberquest.com" style="color: #d97706;">contact our security team</a>.
                        </p>
                    </div>
                    
                    <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 30px 0 15px 0;">Can't click the button?</h3>
                    <p style="color: #4b5563; font-size: 14px; margin-bottom: 10px;">
                        Copy and paste this link into your browser:
                    </p>
                    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 13px; color: #374151; word-break: break-all;">
                        https://app.cyberquest.com/auth/reset-password?token=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
                    </div>
                    
                    <!-- Tips Section -->
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <h3 style="color: #166534; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                            💡 Password Security Tips
                        </h3>
                        <ul style="color: #15803d; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>Use a unique password that you don't use anywhere else</li>
                            <li>Make it at least 12 characters long</li>
                            <li>Include a mix of letters, numbers, and symbols</li>
                            <li>Consider using a password manager</li>
                            <li>Enable two-factor authentication for extra security</li>
                        </ul>
                    </div>
                    
                    <p style="color: #4b5563; font-size: 16px; margin-top: 30px;">
                        Best regards,<br>
                        <strong>The CyberQuest Security Team</strong>
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="color: #667eea; font-size: 18px; font-weight: bold;">CyberQuest</div>
                        <div style="color: #6b7280; font-size: 12px; margin-top: 5px;">Cybersecurity Training Platform</div>
                    </div>
                    
                    <div style="color: #6b7280; font-size: 12px; line-height: 1.4; text-align: center;">
                        <p style="margin: 0 0 10px 0;">
                            <strong>CyberQuest Training Platform</strong><br>
                            123 Education Blvd, Tech City, TC 12345
                        </p>
                        <p style="margin: 0 0 15px 0;">
                            This email was sent to you because you requested a password reset. 
                            If you have questions, contact us at 
                            <a href="mailto:support@cyberquest.com" style="color: #667eea;">support@cyberquest.com</a>
                        </p>
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                            <a href="#" style="color: #667eea; font-size: 12px; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                            <a href="#" style="color: #667eea; font-size: 12px; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                            <a href="#" style="color: #667eea; font-size: 12px; text-decoration: none; margin: 0 8px;">Help Center</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export const PasswordResetLegitimate = new PasswordResetLegitimateClass().toEmailObject();
