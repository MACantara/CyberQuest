// Centralized registry for all legitimate and suspicious emails

import { LegitimateEmail } from './legitimate-emails/cyberquest-welcome-email.js';
import { BankEmail } from './suspicious-emails/bank-email.js';
import { SuspiciousEmail } from './suspicious-emails/nigerian-prince-email.js';

// Add new emails here as needed
export const LEGITIMATE_EMAILS = [
    LegitimateEmail,
    BankEmail
];

export const SUSPICIOUS_EMAILS = [
    SuspiciousEmail
];

// Optionally, for all emails in one array:
export const ALL_EMAILS = [
    ...LEGITIMATE_EMAILS,
    ...SUSPICIOUS_EMAILS
];
