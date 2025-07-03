import { BaseEmail } from './base-email.js';

class CyberquestWelcomeEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'cyberquest-welcome',
            sender: 'welcome@cyberquest.com',
            subject: 'Welcome to CyberQuest Training Platform',
            timestamp: BaseEmail.createTimestamp(3, 15), // 3 hours 15 minutes ago
            suspicious: false,
            priority: 'normal'
        });
    }

    createBody() {
        return `
            <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0;">
                <!-- Header with gradient -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
                        <span style="color: #667eea; font-weight: bold; font-size: 36px;">CQ</span>
                    </div>
                    <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">Welcome to CyberQuest!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">Your journey to cybersecurity mastery begins now</p>
                </div>
                
                <!-- Main content -->
                <div style="background: white; padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #374151; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">🎉 Account Successfully Created!</h2>
                        <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">
                            Thank you for joining our cybersecurity training platform. You're now part of a community 
                            dedicated to building digital security awareness.
                        </p>
                    </div>
                    
                    <!-- Getting Started Steps -->
                    <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                        <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px; text-align: center;">🚀 Getting Started</h3>
                        
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <div style="display: flex; align-items: flex-start; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                <div style="background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">1</div>
                                <div>
                                    <h4 style="color: #374151; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Complete Your Profile</h4>
                                    <p style="color: #6b7280; margin: 0; font-size: 13px;">Set up your learning preferences and track your progress</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; align-items: flex-start; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                <div style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">2</div>
                                <div>
                                    <h4 style="color: #374151; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Take the Assessment</h4>
                                    <p style="color: #6b7280; margin: 0; font-size: 13px;">Help us understand your current cybersecurity knowledge level</p>
                                </div>
                            </div>
                            
                            <div style="display: flex; align-items: flex-start; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                <div style="background: #f59e0b; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 15px; flex-shrink: 0;">3</div>
                                <div>
                                    <h4 style="color: #374151; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Start Learning</h4>
                                    <p style="color: #6b7280; margin: 0; font-size: 13px;">Begin with Level 1: Misinformation Maze</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                            🎯 Start Training Now
                        </a>
                    </div>
                    
                    <!-- Features -->
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; margin-top: 30px;">
                        <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; text-align: center;">What You'll Learn</h3>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="text-align: center; padding: 15px;">
                                <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
                                <h4 style="color: #374151; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Email Security</h4>
                                <p style="color: #6b7280; margin: 0; font-size: 12px;">Identify phishing attempts</p>
                            </div>
                            
                            <div style="text-align: center; padding: 15px;">
                                <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
                                <h4 style="color: #374151; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Fact Checking</h4>
                                <p style="color: #6b7280; margin: 0; font-size: 12px;">Verify information sources</p>
                            </div>
                            
                            <div style="text-align: center; padding: 15px;">
                                <div style="font-size: 24px; margin-bottom: 8px;">🌐</div>
                                <h4 style="color: #374151; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Web Safety</h4>
                                <p style="color: #6b7280; margin: 0; font-size: 12px;">Browse securely online</p>
                            </div>
                            
                            <div style="text-align: center; padding: 15px;">
                                <div style="font-size: 24px; margin-bottom: 8px;">🏆</div>
                                <h4 style="color: #374151; margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">Earn Badges</h4>
                                <p style="color: #6b7280; margin: 0; font-size: 12px;">Track your achievements</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Support Info -->
                    <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-top: 25px;">
                        <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">Need Help?</h4>
                        <p style="color: #1e40af; margin: 0 0 15px 0; font-size: 14px; line-height: 1.5;">
                            Our support team is here to help you succeed. Contact us anytime for assistance with your training.
                        </p>
                        <div style="font-size: 13px; color: #3730a3;">
                            📧 <a href="mailto:support@cyberquest.com" style="color: #3730a3;">support@cyberquest.com</a><br>
                            💬 Live chat available 24/7<br>
                            📚 <a href="#" style="color: #3730a3;">Help Center</a>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #374151; margin: 0 0 10px 0; font-weight: 600;">Welcome to the CyberQuest Community!</p>
                    <div style="color: #6b7280; font-size: 12px; line-height: 1.4;">
                        <p style="margin: 0 0 5px 0;">CyberQuest Training Platform | 123 Education Blvd, Tech City, TC 12345</p>
                        <p style="margin: 0;">
                            <a href="#" style="color: #667eea;">Unsubscribe</a> | 
                            <a href="#" style="color: #667eea;">Privacy Policy</a> | 
                            <a href="#" style="color: #667eea;">Terms of Service</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export as email object for compatibility
export const CyberquestWelcomeEmail = new CyberquestWelcomeEmailClass().toEmailObject();
