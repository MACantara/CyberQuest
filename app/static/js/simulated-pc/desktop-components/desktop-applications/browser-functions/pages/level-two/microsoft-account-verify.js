import { BasePage } from '../base-page.js';

export class MicrosoftAccountVerifyPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://login.microsft-secure.net/account/verify',
            title: 'Microsoft Account - Verify Your Identity',
            ipAddress: '192.168.1.100',
            securityLevel: 'dangerous',
            security: {
                isHttps: true,
                hasValidCertificate: false,
                certificate: {
                    valid: false,
                    issuer: 'Self-signed',
                    expires: BasePage.generateCertExpiration(30),
                    algorithm: 'RSA-1024',
                    trusted: false,
                    extendedValidation: false
                },
                threats: [
                    'Microsoft impersonation',
                    'Typosquatting domain',
                    'Credential phishing'
                ],
                riskFactors: [
                    'Misspelled domain (microsft vs microsoft)',
                    'Suspicious certificate',
                    'Account verification scam'
                ]
            }
        });
    }

    createContent() {
        return `
            <div style="min-height: 100vh; background: #f3f2f1; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <!-- Header -->
                <div style="background: white; padding: 20px 0; border-bottom: 1px solid #e1dfdd;">
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center;">
                        <svg width="108" height="24" viewBox="0 0 108 24" style="margin-right: 15px;">
                            <rect x="0" y="0" width="10" height="10" fill="#f25022"/>
                            <rect x="12" y="0" width="10" height="10" fill="#7fba00"/>
                            <rect x="0" y="12" width="10" height="10" fill="#00a4ef"/>
                            <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
                        </svg>
                        <span style="color: #323130; font-size: 20px; font-weight: 600;">Microsoft</span>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="max-width: 440px; margin: 50px auto; padding: 0 20px;">
                    <div style="background: white; border-radius: 2px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); overflow: hidden;">
                        <div style="padding: 44px 44px 20px 44px;">
                            <h1 style="color: #323130; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">Help us protect your account</h1>
                            
                            <div style="background: #fff4ce; border: 1px solid #ffb900; border-radius: 2px; padding: 12px; margin-bottom: 24px;">
                                <div style="color: #8a6914; font-size: 14px;">
                                    <strong>Unusual sign-in activity detected</strong><br>
                                    We noticed a sign-in from Moscow, Russia that may not have been you.
                                </div>
                            </div>
                            
                            <p style="color: #323130; font-size: 15px; margin-bottom: 24px;">
                                To help keep your account secure, please verify your identity by providing the information below.
                            </p>
                            
                            <form id="verifyForm">
                                <div style="margin-bottom: 16px;">
                                    <label style="display: block; color: #323130; font-size: 15px; margin-bottom: 4px;">Email address</label>
                                    <input type="email" id="email" style="width: 100%; padding: 8px 12px; border: 1px solid #605e5c; border-radius: 2px; font-size: 15px;" placeholder="someone@example.com" required>
                                </div>
                                
                                <div style="margin-bottom: 16px;">
                                    <label style="display: block; color: #323130; font-size: 15px; margin-bottom: 4px;">Password</label>
                                    <input type="password" id="password" style="width: 100%; padding: 8px 12px; border: 1px solid #605e5c; border-radius: 2px; font-size: 15px;" placeholder="Password" required>
                                </div>
                                
                                <div style="margin-bottom: 16px;">
                                    <label style="display: block; color: #323130; font-size: 15px; margin-bottom: 4px;">Phone number (for verification)</label>
                                    <input type="tel" id="phone" style="width: 100%; padding: 8px 12px; border: 1px solid #605e5c; border-radius: 2px; font-size: 15px;" placeholder="+1 (555) 123-4567" required>
                                </div>
                                
                                <div style="margin-bottom: 24px;">
                                    <label style="display: block; color: #323130; font-size: 15px; margin-bottom: 4px;">Recovery email</label>
                                    <input type="email" id="recoveryEmail" style="width: 100%; padding: 8px 12px; border: 1px solid #605e5c; border-radius: 2px; font-size: 15px;" placeholder="backup@example.com" required>
                                </div>
                                
                                <button type="submit" style="width: 100%; background: #0078d4; color: white; padding: 12px; border: none; border-radius: 2px; font-size: 15px; font-weight: 600; cursor: pointer; margin-bottom: 16px;">
                                    Verify my account
                                </button>
                            </form>
                            
                            <div style="margin-top: 24px; padding: 16px; background: #f8f8f8; border-radius: 2px;">
                                <h4 style="color: #323130; font-size: 15px; margin: 0 0 8px 0;">Why we're asking for this</h4>
                                <p style="color: #605e5c; font-size: 13px; margin: 0; line-height: 1.4;">
                                    We detected sign-in attempts from unusual locations. This extra verification 
                                    helps us confirm it's really you and keeps your account safe.
                                </p>
                            </div>
                            
                            <div style="text-align: center; margin-top: 16px;">
                                <a href="#" style="color: #0078d4; font-size: 13px; text-decoration: none;">This wasn't me</a>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <div style="color: #605e5c; font-size: 12px;">
                            <a href="#" style="color: #0078d4; text-decoration: none; margin: 0 8px;">Privacy & cookies</a>
                            <a href="#" style="color: #0078d4; text-decoration: none; margin: 0 8px;">Terms of use</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents(contentElement) {
        const form = contentElement.querySelector('#verifyForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                alert('⚠️ PHISHING ATTEMPT DETECTED!\n\nThis is a fake Microsoft login page!\n\nNotice the suspicious URL: "microsft-secure.net" (missing "o" in Microsoft)\n\nReal Microsoft URLs:\n✓ login.microsoftonline.com\n✓ account.microsoft.com\n\nNever enter credentials on suspicious domains!');
            });
        }
    }
}

// Export as page object for compatibility
export const MicrosoftAccountVerifyPage = new MicrosoftAccountVerifyPageClass().toPageObject();