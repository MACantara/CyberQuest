// Centralized registry for all emails

import { CyberquestWelcomeEmail } from './cyberquest-welcome-email.js';
import { BankEmail } from './bank-email.js';
import { NigerianPrinceEmail } from './nigerian-prince-email.js';

// All emails in one collection for unified inbox
export const ALL_EMAILS = [
    CyberquestWelcomeEmail,
    BankEmail,
    NigerianPrinceEmail
];

