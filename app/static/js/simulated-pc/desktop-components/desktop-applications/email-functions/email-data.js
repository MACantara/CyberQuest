import { SuspiciousEmail } from './emails/suspicious-email.js';
import { LegitimateEmail } from './emails/legitimate-email.js';
import { BankEmail } from './emails/bank-email.js';
import { Sent1Email } from './emails/sent-1.js';
import { Trash1Email } from './emails/trash-1.js';

export const EMAIL_FOLDERS = [
    { id: 'inbox', name: 'Inbox' },
    { id: 'sent', name: 'Sent' },
    { id: 'trash', name: 'Trash' }
];

export const EMAILS = {
    inbox: [
        SuspiciousEmail,
        LegitimateEmail,
        BankEmail
    ],
    sent: [
        Sent1Email
    ],
    trash: [
        Trash1Email
    ]
};