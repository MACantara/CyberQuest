import { BaseEmail } from './base-email.js';

class NewsletterSubscriptionClass extends BaseEmail {
    constructor() {
        super({
            id: 'newsletter-001',
            sender: 'newsletter@techinsights.com',
            subject: 'Welcome to TechInsights Weekly - Your Cybersecurity Newsletter',
            timestamp: BaseEmail.createTimestamp(4, 0), // 4 hours ago
            suspicious: false,
            priority: 'normal'
        });
    }

    createBody() {
        return `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 20px 30px; text-align: center;">
                    <div style="color: white; font-size: 28px; font-weight: bold; margin-bottom: 5px;">TechInsights</div>
                    <div style="color: #bfdbfe; font-size: 14px; font-weight: 500; letter-spacing: 2px;">WEEKLY CYBERSECURITY DIGEST</div>
                </div>
                
                <!-- Welcome Section -->
                <div style="padding: 30px;">
                    <h1 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome to TechInsights Weekly!</h1>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Thank you for subscribing to our cybersecurity newsletter. You'll receive weekly updates on the latest threats, security best practices, and industry insights.
                    </p>
                    
                    <!-- Subscription Details -->
                    <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                        <h3 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">
                            📬 Your Subscription Details
                        </h3>
                        <div style="color: #1e40af; font-size: 14px; line-height: 1.5;">
                            <div style="margin-bottom: 5px;"><strong>Newsletter:</strong> TechInsights Weekly</div>
                            <div style="margin-bottom: 5px;"><strong>Frequency:</strong> Every Tuesday at 8:00 AM</div>
                            <div style="margin-bottom: 5px;"><strong>Content:</strong> Cybersecurity trends, threat analysis, and educational content</div>
                            <div><strong>Subscription Date:</strong> November 18, 2024</div>
                        </div>
                    </div>
                    
                    <!-- What to Expect -->
                    <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 30px 0 15px 0;">What You'll Receive</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr; gap: 15px; margin-bottom: 25px;">
                        <div style="display: flex; align-items: flex-start; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; font-size: 14px;">🛡️</div>
                            <div>
                                <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Threat Intelligence</h4>
                                <p style="color: #6b7280; margin: 0; font-size: 13px; line-height: 1.4;">Latest cybersecurity threats and how to protect against them</p>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <div style="background: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; font-size: 14px;">📚</div>
                            <div>
                                <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Educational Content</h4>
                                <p style="color: #6b7280; margin: 0; font-size: 13px; line-height: 1.4;">Best practices, tutorials, and security awareness training</p>
                            </div>
                        </div>
                        
                        <div style="display: flex; align-items: flex-start; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <div style="background: #f59e0b; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; font-size: 14px;">📊</div>
                            <div>
                                <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Industry Insights</h4>
                                <p style="color: #6b7280; margin: 0; font-size: 13px; line-height: 1.4;">Market trends, research findings, and expert analysis</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Featured Article Preview -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 25px 0;">
                        <h3 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                            📖 Featured in This Week's Issue
                        </h3>
                        <div style="background: white; border-radius: 6px; padding: 15px; border-left: 4px solid #3b82f6;">
                            <h4 style="color: #1f2937; margin: 0 0 8px 0; font-size: 15px; font-weight: 600;">"The Rise of AI-Powered Phishing Attacks"</h4>
                            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 13px; line-height: 1.5;">
                                Learn how artificial intelligence is being weaponized by cybercriminals to create more convincing phishing emails and how organizations can defend against these sophisticated attacks.
                            </p>
                            <div style="color: #3b82f6; font-size: 12px;">
                                <strong>Reading time:</strong> 5 minutes | <strong>Author:</strong> Dr. Sarah Chen, Cybersecurity Researcher
                            </div>
                        </div>
                    </div>
                    
                    <!-- Social Links -->
                    <div style="text-align: center; margin: 30px 0;">
                        <h3 style="color: #1f2937; font-size: 16px; font-weight: 600; margin-bottom: 15px;">Follow Us for Daily Updates</h3>
                        <div style="display: flex; justify-content: center; gap: 15px;">
                            <a href="#" style="background: #1da1f2; color: white; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">T</a>
                            <a href="#" style="background: #0077b5; color: white; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">in</a>
                            <a href="#" style="background: #333; color: white; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-size: 16px;">G</a>
                        </div>
                    </div>
                    
                    <!-- Preferences -->
                    <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 25px 0;">
                        <h3 style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">Customize Your Experience</h3>
                        <div style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                            <p style="margin: 0 0 10px 0;">You can customize your newsletter preferences at any time:</p>
                            <div style="margin-left: 15px;">
                                <div style="margin-bottom: 5px;">• Choose content categories that interest you</div>
                                <div style="margin-bottom: 5px;">• Set your preferred delivery time</div>
                                <div style="margin-bottom: 5px;">• Adjust frequency (weekly, bi-weekly, monthly)</div>
                            </div>
                        </div>
                        <div style="text-align: center; margin-top: 15px;">
                            <a href="#" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">
                                Manage Preferences
                            </a>
                        </div>
                    </div>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 25px;">
                        We're committed to providing you with valuable, actionable cybersecurity insights. 
                        If you have any questions or suggestions, please don't hesitate to reach out.
                    </p>
                    
                    <p style="color: #4b5563; font-size: 16px; margin-top: 20px;">
                        Stay secure,<br>
                        <strong>The TechInsights Team</strong>
                    </p>
                </div>
                
                <!-- Footer -->
                <div style="background: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <div style="margin-bottom: 15px;">
                        <div style="color: #3b82f6; font-size: 20px; font-weight: bold;">TechInsights</div>
                        <div style="color: #6b7280; font-size: 12px; margin-top: 5px;">Professional Cybersecurity Intelligence</div>
                    </div>
                    
                    <div style="color: #6b7280; font-size: 12px; line-height: 1.4;">
                        <p style="margin: 0 0 10px 0;">
                            <strong>TechInsights Research Lab</strong><br>
                            1500 Security Boulevard, Cyber City, CC 90210
                        </p>
                        <p style="margin: 0 0 15px 0;">
                            You're receiving this because you subscribed to TechInsights Weekly. 
                            We respect your privacy and will never share your information.
                        </p>
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                            <a href="#" style="color: #3b82f6; font-size: 12px; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                            <a href="#" style="color: #3b82f6; font-size: 12px; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                            <a href="#" style="color: #3b82f6; font-size: 12px; text-decoration: none; margin: 0 8px;">Update Preferences</a>
                            <a href="#" style="color: #6b7280; font-size: 12px; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export const NewsletterSubscription = new NewsletterSubscriptionClass().toEmailObject();
