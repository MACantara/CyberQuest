import { BaseEmail } from './base-email.js';

class NigerianPrinceEmailClass extends BaseEmail {
    constructor() {
        super({
            id: 'nigerian-001',
            sender: 'prince.mohammed@gmail.com',
            subject: 'URGENT: BUSINESS PARTNERSHIP PROPOSAL - $25,000,000 USD',
            timestamp: BaseEmail.createTimestamp(6, 45), // 6 hours 45 minutes ago
            suspicious: true,
            priority: 'high'
        });
    }

    createBody() {
        return `
            <div style="font-family: Times New Roman, serif; margin: 0 auto; background: #ffffff; color: #000000; line-height: 1.4;">
                <!-- Crude Header -->
                <div style="background: #ffd700; padding: 15px; text-align: center; border: 3px solid #ff4500;">
                    <div style="color: #8b0000; font-size: 22px; font-weight: bold; text-transform: uppercase;">
                        *** CONFIDENTIAL BUSINESS PROPOSAL ***
                    </div>
                    <div style="color: #8b0000; font-size: 14px; margin-top: 5px;">
                        STRICTLY PRIVATE AND CONFIDENTIAL
                    </div>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 20px; background: #fffbf0;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="color: #8b0000; font-size: 18px; font-weight: bold;">
                            FROM THE DESK OF HIS ROYAL HIGHNESS
                        </div>
                        <div style="color: #8b0000; font-size: 16px; font-weight: bold; margin-top: 5px;">
                            PRINCE MOHAMMED AL-RASHID
                        </div>
                        <div style="color: #006400; font-size: 12px; margin-top: 5px;">
                            MINISTER OF PETROLEUM AND NATURAL RESOURCES
                        </div>
                    </div>
                    
                    <div style="color: #000000; font-size: 14px;">
                        <p style="margin-bottom: 15px; text-transform: uppercase; font-weight: bold; color: #8b0000;">
                            GREETINGS IN THE NAME OF ALLAH THE MOST BENEFICENT!!!
                        </p>
                        
                        <p style="margin-bottom: 15px;">
                            Dearest Friend,
                        </p>
                        
                        <p style="margin-bottom: 15px;">
                            I hope this mail meets you in good health and prosperity. I am <strong>Prince Mohammed Al-Rashid</strong>, 
                            the son of late King Abdul Al-Rashid of Nigeria who was murdered by rebels during the recent political 
                            crisis in my country. Before his death, my father deposited the sum of <strong style="color: #8b0000; font-size: 16px;">
                            $25,000,000.00 USD (TWENTY FIVE MILLION UNITED STATES DOLLARS)</strong> in a security company in Europe.
                        </p>
                        
                        <!-- Emotional Appeal Box -->
                        <div style="background: #ffebcd; border: 2px solid #daa520; padding: 15px; margin: 20px 0; text-align: center;">
                            <div style="color: #8b0000; font-weight: bold; font-size: 15px; margin-bottom: 10px;">
                                ⚠️ URGENT SITUATION ⚠️
                            </div>
                            <div style="color: #000000; font-size: 13px;">
                                My life is in GREAT DANGER and I must transfer this money IMMEDIATELY before the rebels 
                                discover its location. Time is running out and I need your URGENT assistance!
                            </div>
                        </div>
                        
                        <p style="margin-bottom: 15px;">
                            Due to the political instability in my country, I am currently hiding in a refugee camp in neighboring Chad. 
                            The only way I can access this fund is through a foreign partner like yourself who can help me transfer 
                            the money to a safe account outside Nigeria.
                        </p>
                        
                        <p style="margin-bottom: 15px;">
                            I have chosen to contact you after much prayer and fasting because I believe Allah has guided me to you. 
                            I need someone with a good heart and fear of God to assist me in this transaction. I promise that you will 
                            be greatly rewarded for your kindness.
                        </p>
                        
                        <!-- Reward Details -->
                        <div style="background: #98fb98; border: 2px solid #228b22; padding: 15px; margin: 20px 0;">
                            <div style="color: #006400; font-weight: bold; font-size: 16px; margin-bottom: 10px; text-align: center;">
                                💰 YOUR REWARD FOR HELPING 💰
                            </div>
                            <div style="color: #000000; font-size: 14px;">
                                For your assistance in this matter, I am prepared to offer you:
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li><strong>40% of the total sum ($10,000,000 USD)</strong> as your compensation</li>
                                    <li><strong>5% ($1,250,000 USD)</strong> for any expenses incurred during the transfer</li>
                                    <li><strong>55% ($13,750,000 USD)</strong> for myself and future investments</li>
                                </ul>
                                <div style="text-align: center; color: #8b0000; font-weight: bold; margin-top: 10px;">
                                    TOTAL GUARANTEED PAYMENT TO YOU: $11,250,000 USD!!!
                                </div>
                            </div>
                        </div>
                        
                        <p style="margin-bottom: 15px;">
                            This transaction is 100% RISK FREE and LEGAL. I have all the necessary documents from the 
                            security company including the Certificate of Deposit and the Authorization Letter from my late father. 
                            Everything is authentic and genuine.
                        </p>
                        
                        <p style="margin-bottom: 15px;">
                            All I need from you is your:
                        </p>
                        
                        <!-- Required Information -->
                        <div style="background: #fff8dc; border: 1px solid #daa520; padding: 15px; margin: 15px 0;">
                            <div style="color: #8b0000; font-weight: bold; margin-bottom: 10px;">REQUIRED INFORMATION:</div>
                            <div style="color: #000000; font-size: 13px;">
                                1. Full Name and Address<br>
                                2. Phone and Fax Numbers<br>
                                3. Bank Account Details (for transfer)<br>
                                4. Copy of International Passport or Driver's License<br>
                                5. Profession and Age<br>
                                6. Copy of Utility Bill (for address verification)
                            </div>
                        </div>
                        
                        <p style="margin-bottom: 15px;">
                            Upon receipt of your information, I will send you the original documents and we can proceed 
                            immediately with the transfer. The entire process will take only 3-5 working days and then 
                            we can both enjoy our new wealth!
                        </p>
                        
                        <!-- Urgency Section -->
                        <div style="background: #ffcccb; border: 2px solid #dc143c; padding: 15px; margin: 20px 0; text-align: center;">
                            <div style="color: #8b0000; font-weight: bold; font-size: 15px; margin-bottom: 8px;">
                                ⏰ TIME IS OF THE ESSENCE ⏰
                            </div>
                            <div style="color: #000000; font-size: 13px;">
                                The rebels are getting closer to discovering the money! Please reply IMMEDIATELY 
                                as every minute counts. Do not delay as this opportunity may not come again!
                            </div>
                        </div>
                        
                        <p style="margin-bottom: 15px;">
                            I await your urgent reply so we can proceed without further delay. Please treat this matter 
                            with the utmost confidentiality as my life depends on it. Reply only to this email address 
                            and do not share this information with anyone.
                        </p>
                        
                        <p style="margin-bottom: 15px;">
                            God bless you and your family.
                        </p>
                        
                        <div style="margin-top: 25px;">
                            <div style="color: #000000; font-weight: bold;">Yours faithfully,</div>
                            <div style="color: #8b0000; font-size: 16px; font-weight: bold; margin-top: 5px;">
                                Prince Mohammed Al-Rashid
                            </div>
                            <div style="color: #006400; font-size: 12px; margin-top: 3px;">
                                Son of Late King Abdul Al-Rashid<br>
                                Minister of Petroleum and Natural Resources<br>
                                Federal Republic of Nigeria
                            </div>
                        </div>
                        
                        <!-- Contact Information -->
                        <div style="background: #f0f0f0; border: 1px solid #ccc; padding: 15px; margin: 20px 0;">
                            <div style="color: #8b0000; font-weight: bold; margin-bottom: 8px;">PRIVATE CONTACT INFORMATION:</div>
                            <div style="color: #000000; font-size: 12px;">
                                Email: prince.mohammed@gmail.com<br>
                                Mobile: +234-8034-567-890 (Chad Refugee Camp)<br>
                                Skype: prince_mohammed_official<br>
                                <strong>Reply ONLY to this email for security reasons!</strong>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #8b0000; color: #ffd700; padding: 10px; text-align: center; font-size: 10px;">
                    *** CONFIDENTIAL *** DO NOT FORWARD *** FOR YOUR EYES ONLY ***
                </div>
            </div>
        `;
    }
}

export const NigerianPrinceEmail = new NigerianPrinceEmailClass().toEmailObject();
