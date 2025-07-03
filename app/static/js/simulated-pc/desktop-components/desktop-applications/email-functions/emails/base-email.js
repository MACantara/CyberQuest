export class BaseEmail {
    constructor(config) {
        this.id = config.id;
        this.folder = config.folder || 'inbox';
        this.sender = config.sender;
        this.subject = config.subject;
        this.time = config.time;
        this.suspicious = config.suspicious || false;
        this.priority = config.priority || 'normal'; // low, normal, high
        this.attachments = config.attachments || [];
    }

    // Abstract method - must be implemented by subclasses
    createBody() {
        throw new Error('createBody() must be implemented by subclasses');
    }

    // Get the email body (calls createBody internally)
    get body() {
        return this.createBody();
    }

    // Helper method to extract domain from sender
    getSenderDomain() {
        return this.sender.split('@')[1];
    }

    // Helper method to check if email is from a trusted domain
    isFromTrustedDomain() {
        const trustedDomains = ['cyberquest.com', 'securebank.com'];
        return trustedDomains.includes(this.getSenderDomain());
    }

    // Helper method to get email server
    getEmailServer() {
        const domain = this.getSenderDomain();
        return domain.includes('cyberquest.com') ? 'mail.cyberquest.com' : domain;
    }

    // Helper method to format time consistently
    static formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days === 1) return 'yesterday';
        if (days < 7) return `${days} days ago`;
        return 'last week';
    }

    // Create styled container for email content
    createStyledContainer(content, containerClass = '', headerInfo = null) {
        const header = headerInfo ? `
            <div class="flex items-center space-x-3 border-b border-gray-200 pb-3 mb-4">
                <div class="w-10 h-10 ${headerInfo.bgColor} rounded flex items-center justify-center">
                    <i class="bi bi-${headerInfo.icon} text-white text-lg"></i>
                </div>
                <div>
                    <span class="block text-base font-bold ${headerInfo.titleColor}">${headerInfo.title}</span>
                    <span class="block text-xs ${headerInfo.subtitleColor}">${headerInfo.subtitle}</span>
                </div>
            </div>
        ` : '';

        return `
            <div class="${containerClass} p-4 rounded-lg border">
                ${header}
                ${content}
            </div>
        `;
    }

    // Create email object compatible with existing system
    toEmailObject() {
        return {
            id: this.id,
            folder: this.folder,
            sender: this.sender,
            subject: this.subject,
            time: this.time,
            body: this.body,
            suspicious: this.suspicious,
            priority: this.priority,
            attachments: this.attachments
        };
    }
}
