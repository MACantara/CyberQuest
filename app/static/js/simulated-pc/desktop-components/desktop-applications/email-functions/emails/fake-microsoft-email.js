import { BaseEmail } from './base-email.js';

class FakeMicrosoftEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'microsoft-phish-001',
            sender: 'account-security@microsoft.com',
            subject: 'Microsoft Account: Sign-in from new device requires verification',
            timestamp: BaseEmail.createTimestamp(0, 15), // 15 minutes ago
            suspicious: true,
            priority: 'normal'
        });
    }

    createBody() {
        return `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <!-- Microsoft Header -->
                <div style="background: #ffffff; padding: 20px 24px; border-bottom: 1px solid #e5e5e5;">
                    <div style="display: flex; align-items: center;">
                        <div style="margin-right: 12px;">
                            <svg width="32" height="32" viewBox="0 0 32 32">
                                <rect x="1" y="1" width="14" height="14" fill="#f25022"/>
                                <rect x="17" y="1" width="14" height="14" fill="#7fba00"/>
                                <rect x="1" y="17" width="14" height="14" fill="#00a4ef"/>
                                <rect x="17" y="17" width="14" height="14" fill="#ffb900"/>
                            </svg>
                        </div>
                        <span style="color: #323130; font-size: 20px; font-weight: 600;">Microsoft</span>
                    </div>
                </div>
                
                <!-- Content -->
                <div style="padding: 32px 24px;">
                    <h1 style="color: #323130; font-size: 24px; font-weight: 600; margin: 0 0 24px 0; line-height: 1.4;">
                        We noticed a new sign-in to your Microsoft account
                    </h1>
                    
                    <div style="color: #323130; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                        <p style="margin: 0 0 16px 0;">Hi there,</p>
                        <p style="margin: 0 0 16px 0;">
                            We noticed a new sign-in to your Microsoft account <strong>user@email.com</strong> from a device we don't recognize.
                        </p>
                    </div>
                    
                    <!-- Sign-in Details Card -->
                    <div style="background: #f3f2f1; border-radius: 4px; padding: 20px; margin: 24px 0;">
                        <h3 style="color: #323130; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Sign-in details</h3>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="border-bottom: 1px solid #e1dfdd;">
                                <td style="color: #605e5c; font-size: 14px; padding: 8px 0; font-weight: 600;">Date and time:</td>
                                <td style="color: #323130; font-size: 14px; padding: 8px 0;">November 18, 2024, 2:34:18 PM PST</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e1dfdd;">
                                <td style="color: #605e5c; font-size: 14px; padding: 8px 0; font-weight: 600;">Approximate location:</td>
                                <td style="color: #323130; font-size: 14px; padding: 8px 0;">Moscow, Russia</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e1dfdd;">
                                <td style="color: #605e5c; font-size: 14px; padding: 8px 0; font-weight: 600;">IP address:</td>
                                <td style="color: #323130; font-size: 14px; padding: 8px 0;">185.220.101.47</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e1dfdd;">
                                <td style="color: #605e5c; font-size: 14px; padding: 8px 0; font-weight: 600;">Device:</td>
                                <td style="color: #323130; font-size: 14px; padding: 8px 0;">Windows 11 PC</td>
                            </tr>
                            <tr>
                                <td style="color: #605e5c; font-size: 14px; padding: 8px 0; font-weight: 600;">Browser:</td>
                                <td style="color: #323130; font-size: 14px; padding: 8px 0;">Chrome 119.0.6045.199</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="color: #323130; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                        <p style="margin: 0 0 16px 0;">
                            If this was you, you can safely ignore this email. If you don't recognize this activity, 
                            <strong>your account may be compromised</strong>.
                        </p>
                    </div>
                    
                    <!-- Security Alert Box -->
                    <div style="background: #fff4ce; border: 1px solid #ffb900; border-radius: 4px; padding: 16px; margin: 24px 0;">
                        <div style="display: flex; align-items: flex-start;">
                            <div style="color: #8a6914; margin-right: 8px; font-size: 16px;">⚠️</div>
                            <div>
                                <h4 style="color: #8a6914; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">Secure your account</h4>
                                <p style="color: #8a6914; font-size: 14px; margin: 0; line-height: 1.4;">
                                    We recommend verifying your identity and reviewing your security settings immediately.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="margin: 32px 0; text-align: left;">
                        <a href="#" style="background: #0078d4; color: white; padding: 12px 20px; text-decoration: none; border-radius: 2px; font-size: 14px; font-weight: 600; display: inline-block; margin-right: 16px;" 
                           class="open-browser-link" data-url="https://login.microsft-secure.net/account/verify">
                            Verify identity
                        </a>
                        <a href="#" style="color: #0078d4; font-size: 14px; text-decoration: none; font-weight: 600;">
                            This wasn't me
                        </a>
                    </div>
                    
                    <div style="color: #323130; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
                        <p style="margin: 0;">
                            For your security, we've temporarily limited some account features until you can verify your identity.
                        </p>
                    </div>
                    
                    <!-- Additional Info -->
                    <div style="background: #f8f8f8; border-left: 4px solid #0078d4; padding: 16px; margin: 24px 0;">
                        <h4 style="color: #323130; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">Why am I getting this email?</h4>
                        <p style="color: #605e5c; font-size: 13px; margin: 0; line-height: 1.4;">
                            We send these notifications to help protect your account. Microsoft will never ask you 
                            to provide your password in an email.
                        </p>
                    </div>
                    
                    <div style="color: #323130; font-size: 14px; line-height: 1.5;">
                        <p style="margin: 0 0 8px 0;">Thanks,</p>
                        <p style="margin: 0; font-weight: 600;">The Microsoft Account Team</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f3f2f1; padding: 24px; border-top: 1px solid #e1dfdd;">
                    <div style="color: #605e5c; font-size: 12px; line-height: 1.4;">
                        <p style="margin: 0 0 8px 0;">
                            <strong>Microsoft Corporation</strong><br>
                            One Microsoft Way<br>
                            Redmond, WA 98052
                        </p>
                        <p style="margin: 0 0 16px 0;">
                            This is an automated message. Please do not reply to this email.
                        </p>
                        <div style="border-top: 1px solid #e1dfdd; padding-top: 16px;">
                            <a href="#" style="color: #0078d4; font-size: 12px; text-decoration: none; margin-right: 16px;">Privacy Statement</a>
                            <a href="#" style="color: #0078d4; font-size: 12px; text-decoration: none; margin-right: 16px;">Terms of Use</a>
                            <a href="#" style="color: #0078d4; font-size: 12px; text-decoration: none;">Security Info</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export const FakeMicrosoftEmail = new FakeMicrosoftEmailClass().toEmailObject();
