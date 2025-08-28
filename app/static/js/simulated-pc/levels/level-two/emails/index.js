// Level 2 Email Registry Index
// Email templates and configurations for Shadow in the Inbox

export { ALL_EMAILS } from './email-registry.js';
export { BaseEmail } from './base-email.js';

// Legitimate emails (for training comparison)
export { CyberQuestWelcomeEmail } from './cyberquest-welcome-email.js';
export { CompanyUpdateEmail } from './company-update-email.js';
export { NewsletterSubscription } from './newsletter-subscription.js';
export { PasswordResetLegitimate } from './password-reset-legitimate.js';

// Phishing/malicious emails (training targets)
export { BankEmail } from './bank-email.js';
export { FakeMicrosoftEmail } from './fake-microsoft-email.js';
export { FakePayPalEmail } from './fake-paypal-email.js';
export { NigerianPrinceEmail } from './nigerian-prince-email.js';
export { SophisticatedSpearPhish } from './sophisticated-spear-phish.js';

// Email categories for Level 2
export const LEVEL_2_EMAILS = {
    LEGITIMATE: {
        welcome: 'CyberQuest Academy welcome email',
        company_update: 'Internal company announcement',
        newsletter: 'Newsletter subscription confirmation',
        password_reset: 'Legitimate password reset'
    },
    PHISHING: {
        bank_phish: 'Fake banking email',
        microsoft_phish: 'Fake Microsoft account email',
        paypal_phish: 'Fake PayPal email',
        nigerian_prince: 'Classic advance fee scam',
        spear_phish: 'Sophisticated targeted attack'
    }
};

console.log('Level 2 Emails loaded: Email registry with phishing detection training');
