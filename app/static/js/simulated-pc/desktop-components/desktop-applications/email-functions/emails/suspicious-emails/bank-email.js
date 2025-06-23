export const BankEmail = {
    id: 'bank-email',
    folder: 'inbox',
    sender: 'account-security@verifysystem-alerts.net',
    subject: 'Immediate Action Required: Account Verification Needed',
    time: '3 hours ago',
    body: `
        <p>Dear Customer,</p>
        <p>
            We have detected suspicious activity on your bank account. For your protection, your online access has been <strong>immediately suspended</strong>.
        </p>
        <p>
            To restore access and avoid permanent account closure, please 
            <a href="#" 
               class="text-blue-600 underline open-browser-link" 
               data-url="https://phishing-bank.com">
               verify your account now
            </a> 
            by confirming your personal and banking information.
        </p>
        <p>
            Failure to act within 24 hours will result in your account being permanently locked.
        </p>
        <p>
            Thank you for your prompt attention.<br>
            <strong>SecureBank Security Team</strong>
        </p>
    `,
    suspicious: true
};
