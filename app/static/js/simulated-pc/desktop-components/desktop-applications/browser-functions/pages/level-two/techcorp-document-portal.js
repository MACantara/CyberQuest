import { BasePage } from '../base-page.js';

export class TechCorpDocumentPortalPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://secure-docs.techcorp-portal.net/auth/sign',
            title: 'TechCorp Secure Document Portal - Sign In',
            ipAddress: '185.220.101.47',
            securityLevel: 'dangerous',
            security: {
                isHttps: true,
                hasValidCertificate: false,
                certificate: {
                    valid: false,
                    issuer: 'Unknown CA',
                    expires: BasePage.generateCertExpiration(-1),
                    algorithm: 'RSA-1024',
                    trusted: false,
                    extendedValidation: false
                },
                threats: [
                    'Suspicious domain registration',
                    'Phishing attempt detected',
                    'Credential harvesting'
                ],
                riskFactors: [
                    'Recently registered domain',
                    'Mimics corporate portal',
                    'Requests sensitive credentials'
                ]
            }
        });
    }

    createContent() {
        return `
            <div style="min-height: 100vh; background: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <!-- Header -->
                <div style="background: #1e3a8a; padding: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <div style="background: white; width: 40px; height: 40px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                <span style="color: #1e3a8a; font-weight: bold; font-size: 16px;">TC</span>
                            </div>
                            <div>
                                <div style="color: white; font-size: 18px; font-weight: 600;">TechCorp Industries</div>
                                <div style="color: #bfdbfe; font-size: 12px;">Secure Document Portal</div>
                            </div>
                        </div>
                        <div style="color: #bfdbfe; font-size: 11px;">
                            🔒 SSL Secured | Enterprise Grade
                        </div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="max-width: 500px; margin: 50px auto; padding: 0 20px;">
                    <div style="background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 25px; text-align: center;">
                            <h1 style="color: white; margin: 0 0 8px 0; font-size: 22px; font-weight: 600;">Document Access Portal</h1>
                            <p style="color: #bfdbfe; margin: 0; font-size: 14px;">Q4 Budget Approval - Digital Signature Required</p>
                        </div>
                        
                        <div style="padding: 30px;">
                            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px;">
                                <div style="color: #92400e; font-size: 14px; font-weight: 600; margin-bottom: 5px;">⚠️ Time Sensitive Document</div>
                                <div style="color: #92400e; font-size: 12px;">Document: Q4_Budget_Final_Compliance_2024.xlsx<br>Deadline: Today 4:00 PM PST</div>
                            </div>
                            
                            <form id="loginForm">
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Enterprise Username</label>
                                    <input type="text" id="username" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px;" placeholder="your.name@cyberquest.com" required>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Password</label>
                                    <input type="password" id="password" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px;" placeholder="Enter your password" required>
                                </div>
                                
                                <div style="margin-bottom: 25px;">
                                    <label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Two-Factor Authentication</label>
                                    <input type="text" id="twofa" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 6px; font-size: 14px;" placeholder="Enter 6-digit code from authenticator app" required>
                                </div>
                                
                                <button type="submit" style="width: 100%; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 12px; border: none; border-radius: 6px; font-weight: 600; font-size: 16px; cursor: pointer;">
                                    Access Document Portal
                                </button>
                            </form>
                            
                            <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 6px;">
                                <div style="color: #1e40af; font-size: 12px; line-height: 1.4;">
                                    <strong>Security Notice:</strong> This portal uses enterprise-grade encryption. 
                                    Your credentials are verified against our Active Directory and require MFA authentication.
                                </div>
                            </div>
                            
                            <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                                <div style="color: #6b7280; font-size: 11px;">
                                    Need help? Contact IT Support: ext. 4501<br>
                                    TechCorp Industries | Secure Document Management
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents(contentElement) {
        const form = contentElement.querySelector('#loginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Simulate credential harvesting attempt
                const username = contentElement.querySelector('#username').value;
                const password = contentElement.querySelector('#password').value;
                const twofa = contentElement.querySelector('#twofa').value;
                
                // Show a fake loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.innerHTML = 'Verifying credentials...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('⚠️ PHISHING ATTEMPT DETECTED!\n\nThis is a fake website designed to steal your credentials. In a real scenario, your login information would be compromised.\n\nAlways verify URLs and be suspicious of urgent document requests.');
                    submitBtn.innerHTML = 'Access Document Portal';
                    submitBtn.disabled = false;
                }, 2000);
            });
        }
    }
}

// Export as page object for compatibility
export const TechCorpDocumentPortalPage = new TechCorpDocumentPortalPageClass().toPageObject();