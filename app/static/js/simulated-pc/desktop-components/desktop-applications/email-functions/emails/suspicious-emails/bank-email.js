export const BankEmail = {
    id: 'bank-email',
    folder: 'inbox',
    sender: 'noreply@bank.com',
    subject: 'Your account has been suspended',
    time: '3 hours ago',
    body: `
        <p>Dear Customer,</p>
        <p>
            We have detected unusual activity on your bank account and, as a precaution, your online access has been temporarily suspended.
            To restore access, please log in to your account and verify your recent transactions.
        </p>
        <p>
            If you did not attempt to access your account recently, please contact our customer support immediately at <a href="https://example-bank.com/support" target="_blank">https://example-bank.com/support</a> or call 1-800-BANK-123.
        </p>
        <p>
            Thank you for helping us keep your account secure.<br>
            <strong>Example Bank Security Team</strong>
        </p>
    `,
    suspicious: true
};
