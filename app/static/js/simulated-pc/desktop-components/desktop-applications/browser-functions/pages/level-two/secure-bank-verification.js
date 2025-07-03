import { BasePage } from '../base-page.js';

export class SecureBankVerificationPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://secure-verify-bank.net/account/verification',
            title: 'Secure Bank - Account Verification',
            ipAddress: '203.0.113.45',
            securityLevel: 'dangerous',
            security: {
                isHttps: true,
                hasValidCertificate: false,
                certificate: {
                    valid: false,
                    issuer: 'Fake CA',
                    expires: BasePage.generateCertExpiration(-30),
                    algorithm: 'RSA-1024',
                    trusted: false,
                    extendedValidation: false
                },
                threats: [
                    'Banking phishing scam',
                    'Identity theft attempt',
                    'Financial fraud'
                ],
                riskFactors: [
                    'Suspicious domain name',
                    'Requests sensitive financial data',
                    'Creates false urgency'
                ]
            }
        });
    }

    createContent() {
        return `
            <div style="min-height: 100vh; background: #f8f9fa; font-family: Arial, sans-serif;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center;">
                        <div style="background: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            <span style="color: #1e3a8a; font-weight: bold; font-size: 24px;">$</span>
                        </div>
                        <div>
                            <div style="color: white; font-size: 24px; font-weight: bold;">Secure Bank</div>
                            <div style="color: #bfdbfe; font-size: 14px;">Account Security Verification</div>
                        </div>
                    </div>
                </div>
                
                <!-- Alert Banner -->
                <div style="background: #dc2626; color: white; padding: 10px 0; text-align: center; font-weight: bold;">
                    🚨 URGENT: Account Verification Required - Limited Time
                </div>
                
                <!-- Main Content -->
                <div style="max-width: 600px; margin: 30px auto; padding: 0 20px;">
                    <div style="background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                        <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px;">
                            <h2 style="color: #dc2626; margin: 0 0 10px 0; font-size: 20px;">Security Alert - Immediate Action Required</h2>
                            <p style="color: #b91c1c; margin: 0; font-size: 14px;">
                                Suspicious activity detected on account ending in ****4729. 
                                Please verify your identity to restore full access.
                            </p>
                        </div>
                        
                        <div style="padding: 30px;">
                            <form id="verificationForm">
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Full Name *</label>
                                    <input type="text" id="fullName" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 4px; font-size: 14px;" placeholder="Enter your full legal name" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Social Security Number *</label>
                                    <input type="text" id="ssn" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 4px; font-size: 14px;" placeholder="XXX-XX-XXXX" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Online Banking Password *</label>
                                    <input type="password" id="bankPassword" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 4px; font-size: 14px;" placeholder="Enter your online banking password" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Account PIN *</label>
                                    <input type="password" id="pin" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 4px; font-size: 14px;" placeholder="4-digit PIN" maxlength="4" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Mother's Maiden Name *</label>
                                    <input type="text" id="maidenName" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 4px; font-size: 14px;" placeholder="Security question answer" required>
                                </div>
                                
                                <div style="margin-bottom: 25px;">
                                    <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Credit Card Information *</label>
                                    <input type="text" id="cardNumber" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 4px; font-size: 14px; margin-bottom: 10px;" placeholder="Credit card number" required>
                                    <div style="display: flex; gap: 10px;">
                                        <input type="text" id="expiry" style="flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 4px; font-size: 14px;" placeholder="MM/YY" required>
                                        <input type="text" id="cvv" style="flex: 1; padding: 12px; border: 2px solid #e5e7eb; border-radius: 4px; font-size: 14px;" placeholder="CVV" maxlength="3" required>
                                    </div>
                                </div>
                                
                                <button type="submit" style="width: 100%; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 15px; border: none; border-radius: 4px; font-weight: bold; font-size: 16px; cursor: pointer;">
                                    VERIFY ACCOUNT IMMEDIATELY
                                </button>
                            </form>
                            
                            <div style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 4px;">
                                <div style="color: #374151; font-size: 12px; line-height: 1.4;">
                                    <strong>Security Notice:</strong> This verification is required due to suspicious login attempts from IP 203.0.113.45 (Nigeria). 
                                    Your account will be permanently closed if verification is not completed within 24 hours.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents(contentElement) {
        const form = contentElement.querySelector('#verificationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Show immediate phishing alert
                alert('🚨 PHISHING ATTACK DETECTED!\n\nThis is a fake banking website designed to steal your personal information!\n\nReal banks will NEVER ask for:\n• Social Security Numbers via email\n• Full passwords or PINs\n• Credit card details for "verification"\n\nAlways navigate to your bank\'s website directly, never through email links.');
            });
        }
    }
}

// Export as page object for compatibility
export const SecureBankVerificationPage = new SecureBankVerificationPageClass().toPageObject();