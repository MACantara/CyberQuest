export const EMAIL_FOLDERS = [
    { id: 'inbox', name: 'Inbox' },
    { id: 'sent', name: 'Sent' },
    { id: 'trash', name: 'Trash' }
];

export const EMAILS = {
    inbox: [
        {
            id: 'suspicious-email',
            sender: 'prince.nigeria@totally-real.com',
            subject: 'URGENT: Claim Your Inheritance!',
            time: '2 min ago',
            body: `<p>Dear User,</p>
                   <p>You have inherited $10,000,000! Please send your bank details to claim your prize.</p>
                   <p><strong>Warning:</strong> This is a classic phishing email for training purposes.</p>`,
            suspicious: true
        },
        {
            id: 'legitimate-email',
            sender: 'admin@cyberquest.com',
            subject: 'Welcome to CyberQuest Training',
            time: '1 hour ago',
            body: `<p>Welcome to CyberQuest Training Platform!</p>
                   <p>We are excited to have you onboard. Please review the attached training materials.</p>`,
            suspicious: false
        },
        {
            id: 'bank-email',
            sender: 'noreply@bank.com',
            subject: 'Your account has been suspended',
            time: '3 hours ago',
            body: `<p>Dear Customer,</p>
                   <p>Your bank account has been suspended due to suspicious activity. Please <a href="#">verify your account</a> to restore access.</p>
                   <p><strong>Warning:</strong> This is a simulated phishing attempt for training.</p>`,
            suspicious: true
        }
    ],
    sent: [
        {
            id: 'sent-1',
            sender: 'trainee@cyberquest.com',
            subject: 'Training Completion Confirmation',
            time: 'Yesterday',
            body: `<p>Hello,</p>
                   <p>I have completed the cybersecurity training modules.</p>
                   <p>Regards,<br>Trainee</p>`,
            suspicious: false
        }
    ],
    trash: [
        {
            id: 'trash-1',
            sender: 'newsletter@randomsite.com',
            subject: 'Weekly Deals',
            time: 'Last week',
            body: `<p>Check out our latest deals!</p>`,
            suspicious: false
        }
    ]
};
