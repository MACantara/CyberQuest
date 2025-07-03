// Centralized registry for all emails

import { CyberquestWelcomeEmail } from './cyberquest-welcome-email.js';
import { BankEmail } from './bank-email.js';
import { NigerianPrinceEmail } from './nigerian-prince-email.js';
import { CompanyUpdateEmail } from './company-update-email.js';
import { FakePaypalEmail } from './fake-paypal-email.js';
import { SophisticatedSpearPhish } from './sophisticated-spear-phish.js';
import { NewsletterSubscription } from './newsletter-subscription.js';
import { FakeMicrosoftEmail } from './fake-microsoft-email.js';
import { PasswordResetLegitimate } from './password-reset-legitimate.js';

// All emails in progressive difficulty order
export const ALL_EMAILS = [
    // Easy - Clearly legitimate
    CyberquestWelcomeEmail,
    CompanyUpdateEmail,
    PasswordResetLegitimate,
    NewsletterSubscription,
    
    // Easy-Medium - Obviously suspicious
    NigerianPrinceEmail,

    // Medium - More convincing phishing
    FakePaypalEmail,
    BankEmail,
    
    // Medium-Hard - Sophisticated attempts
    FakeMicrosoftEmail,
    
    // Hard - Very sophisticated spear phishing
    SophisticatedSpearPhish
];
