import { SuspiciousEmail } from './emails/suspicious-email.js';
import { LegitimateEmail } from './emails/legitimate-email.js';
import { BankEmail } from './emails/bank-email.js';

export const EMAIL_FOLDERS = [
    { id: 'inbox', name: 'Inbox' }
];

export const EMAILS = {
    inbox: [
        SuspiciousEmail,
        LegitimateEmail,
        BankEmail
    ]
};