import { BasePage } from '../base-page.js';

export class PayPalAccountConfirmPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://paypal-security.net/account/confirm',
            title: 'PayPal - Confirm Your Identity',
            ipAddress: '104.28.14.15',
            securityLevel: 'dangerous',
            security: {
                isHttps: true,
                hasValidCertificate: false,
                certificate: {
                    valid: false,
                    issuer: 'Unknown Authority',
                    expires: BasePage.generateCertExpiration(7),
                    algorithm: 'RSA-1024',
                    trusted: false,
                    extendedValidation: false
                },
                threats: [
                    'PayPal impersonation',
                    'Account limitation scam',
                    'Payment credential theft'
                ],
                riskFactors: [
                    'Fake PayPal domain',
                    'Account limitation pressure',
                    'Requests sensitive payment data'
                ]
            }
        });
    }

    createContent() {
        return `
            <div style="min-height: 100vh; background: #f7f7f7; font-family: 'Helvetica Neue', Arial, sans-serif;">
                <!-- Header -->
                <div style="background: #003087; padding: 20px 0;">
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center;">
                        <img src="/static/images/level-two/paypal.svg" alt="PayPal Logo" style="height: 32px; width: auto; margin-right: 15px;">
                        <div style="color: white; font-size: 28px; font-weight: bold; letter-spacing: -1px;">
                            <span style="color: #0070ba;">Pay</span><span style="color: #ffffff;">Pal</span>
                        </div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="max-width: 500px; margin: 40px auto; padding: 0 20px;">
                    <div style="background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                        <div style="background: #fff8e1; border-left: 4px solid #ffc107; padding: 20px;">
                            <h2 style="color: #b8860b; margin: 0 0 10px 0; font-size: 18px;">Account Limitation Notice</h2>
                            <p style="color: #8a6914; margin: 0; font-size: 14px;">
                                We've temporarily limited your account due to unusual activity. 
                                Please confirm your identity to restore full access.
                            </p>
                        </div>
                        
                        <div style="padding: 30px;">
                            <h3 style="color: #2c2e2f; margin: 0 0 20px 0; font-size: 20px;">Confirm Your Identity</h3>
                            
                            <form id="confirmForm">
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #2c2e2f; font-weight: 600; margin-bottom: 8px;">Email Address</label>
                                    <input type="email" id="email" style="width: 100%; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 14px;" placeholder="Enter your PayPal email" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #2c2e2f; font-weight: 600; margin-bottom: 8px;">Password</label>
                                    <input type="password" id="password" style="width: 100%; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 14px;" placeholder="Enter your password" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #2c2e2f; font-weight: 600; margin-bottom: 8px;">Full Name</label>
                                    <input type="text" id="fullName" style="width: 100%; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 14px;" placeholder="Full name as on account" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #2c2e2f; font-weight: 600; margin-bottom: 8px;">Date of Birth</label>
                                    <input type="date" id="dob" style="width: 100%; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 14px;" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #2c2e2f; font-weight: 600; margin-bottom: 8px;">Social Security Number (Last 4 digits)</label>
                                    <input type="text" id="ssn" style="width: 100%; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 14px;" placeholder="XXXX" maxlength="4" required>
                                </div>
                                
                                <div style="margin-bottom: 25px;">
                                    <label style="display: block; color: #2c2e2f; font-weight: 600; margin-bottom: 8px;">Payment Method Verification</label>
                                    <input type="text" id="cardNumber" style="width: 100%; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 14px; margin-bottom: 10px;" placeholder="Card number (for verification only)" required>
                                    <div style="display: flex; gap: 10px;">
                                        <input type="text" id="expiry" style="flex: 1; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 14px;" placeholder="MM/YY" required>
                                        <input type="text" id="cvv" style="flex: 1; padding: 12px; border: 1px solid #e5e5e5; border-radius: 4px; font-size: 14px;" placeholder="CVV" maxlength="3" required>
                                    </div>
                                </div>
                                
                                <button type="submit" style="width: 100%; background: #0070ba; color: white; padding: 14px; border: none; border-radius: 20px; font-size: 16px; font-weight: 600; cursor: pointer; margin-bottom: 16px;">
                                    Confirm My Identity
                                </button>
                            </form>
                            
                            <div style="background: #f7f7f7; border-radius: 4px; padding: 15px; margin-top: 20px;">
                                <h4 style="color: #2c2e2f; font-size: 14px; margin: 0 0 8px 0;">Why we need this information</h4>
                                <ul style="color: #666; font-size: 12px; margin: 0; padding-left: 15px; line-height: 1.4;">
                                    <li>To verify your identity and protect your account</li>
                                    <li>To comply with security regulations</li>
                                    <li>To restore full access to your PayPal services</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <div style="color: #666; font-size: 12px;">
                            <a href="#" style="color: #0070ba; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                            <a href="#" style="color: #0070ba; text-decoration: none; margin: 0 8px;">User Agreement</a>
                            <a href="#" style="color: #0070ba; text-decoration: none; margin: 0 8px;">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents(contentElement) {
        const form = contentElement.querySelector('#confirmForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                alert('🚨 PHISHING SCAM DETECTED!\n\nThis is a fake PayPal website!\n\nRed flags:\n• Suspicious domain: "paypal-security.net" instead of "paypal.com"\n• Asking for SSN and full payment details\n• Urgent account limitation claims\n\nReal PayPal will never ask for:\n• Full SSN or payment details via email links\n• Immediate "verification" to avoid account closure\n\nAlways go directly to PayPal.com!');
            });
        }
    }
}

// Export as page object for compatibility
export const PayPalAccountConfirmPage = new PayPalAccountConfirmPageClass().toPageObject();