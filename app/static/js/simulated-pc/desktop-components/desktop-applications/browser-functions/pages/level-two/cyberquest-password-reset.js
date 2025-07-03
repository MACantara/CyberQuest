import { BasePage } from '../base-page.js';

export class CyberQuestPasswordResetPageClass extends BasePage {
    constructor() {
        super({
            url: 'https://app.cyberquest.com/auth/reset-password?token=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
            title: 'CyberQuest - Reset Password',
            ipAddress: '198.51.100.50',
            securityLevel: 'secure',
            security: {
                isHttps: true,
                hasValidCertificate: true,
                certificate: {
                    valid: true,
                    issuer: 'CyberQuest Academy',
                    expires: BasePage.generateCertExpiration(12),
                    algorithm: 'RSA-2048',
                    trusted: true,
                    extendedValidation: true
                },
                securityFeatures: [
                    'Secure connection',
                    'Password reset service',
                    'Token-based authentication'
                ]
            }
        });
    }

    createContent() {
        return `
            <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
                <div style="max-width: 400px; margin: 50px auto; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow: hidden;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                        <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #667eea; font-weight: bold; font-size: 24px;">CQ</span>
                        </div>
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Reset Your Password</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Enter your new password below</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 30px;">
                        <form id="resetForm">
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px; font-size: 14px;">New Password</label>
                                <input type="password" id="password" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; transition: border-color 0.3s;" placeholder="Enter your new password" required>
                            </div>
                            
                            <div style="margin-bottom: 25px;">
                                <label style="display: block; color: #374151; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Confirm Password</label>
                                <input type="password" id="confirmPassword" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; transition: border-color 0.3s;" placeholder="Confirm your new password" required>
                            </div>
                            
                            <button type="submit" style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; transition: transform 0.2s;">
                                Reset Password
                            </button>
                        </form>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                            <h4 style="color: #1e40af; margin: 0 0 8px 0; font-size: 14px;">🔒 Security Requirements</h4>
                            <ul style="color: #1e40af; font-size: 12px; margin: 0; padding-left: 15px;">
                                <li>At least 8 characters long</li>
                                <li>Include uppercase and lowercase letters</li>
                                <li>Include at least one number</li>
                                <li>Include at least one special character</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="#" style="color: #667eea; text-decoration: none; font-size: 14px;">← Back to Login</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents(contentElement) {
        const form = contentElement.querySelector('#resetForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = contentElement.querySelector('#password').value;
                const confirmPassword = contentElement.querySelector('#confirmPassword').value;
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match. Please try again.');
                    return;
                }
                
                if (password.length < 8) {
                    alert('Password must be at least 8 characters long.');
                    return;
                }
                
                alert('Password reset successful! You can now log in with your new password.');
            });
        }
    }
}

// Export as page object for compatibility
export const CyberQuestPasswordResetPage = new CyberQuestPasswordResetPageClass().toPageObject();