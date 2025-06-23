import { EMAILS } from './email-data.js';

export function getEmailsByFolder(folderId) {
    return EMAILS[folderId] || [];
}

export function getEmailById(folderId, emailId) {
    const emails = getEmailsByFolder(folderId);
    return emails.find(email => email.id === emailId) || null;
}
