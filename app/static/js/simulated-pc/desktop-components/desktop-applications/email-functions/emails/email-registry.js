// Centralized registry for all legitimate and suspicious emails

import { LegitimateEmail } from './legitimate-emails/legitimate-email.js';
import { BankEmail } from './legitimate-emails/bank-email.js';
import { SuspiciousEmail } from './suspicious-emails/suspicious-email.js';

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
