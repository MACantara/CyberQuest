import { BaseEmail } from './base-email.js';

class NewsletterSubscriptionClass extends BaseEmail {
    constructor() {
        super({
            id: 'newsletter-001',
            sender: 'newsletter@cybersecuritydaily.com',
            subject: 'Your Weekly Cybersecurity Brief - November 2024',
            time: 'yesterday',
            suspicious: false,
            priority: 'normal'
        });
    }

    createBody() {
        const headerInfo = {
            icon: 'newspaper',
            bgColor: 'bg-indigo-500',
            title: 'Cybersecurity Daily',
            titleColor: 'text-indigo-800',
            subtitle: 'Weekly Security Brief',
            subtitleColor: 'text-indigo-600'
        };

        const content = `
            <div class="bg-white border border-indigo-200 rounded-lg p-4">
                <div class="text-center mb-4">
                    <h2 class="text-xl font-bold text-indigo-800">Cybersecurity Weekly</h2>
                    <p class="text-sm text-gray-600">November 18, 2024 | Issue #47</p>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">Hello Security Professional,</p>
                <p class="text-gray-800 text-sm mb-4">
                    Here's your weekly roundup of the most important cybersecurity news and insights.
                </p>
                
                <div class="space-y-4 mb-4">
                    <div class="border-l-4 border-indigo-500 pl-3">
                        <h4 class="font-semibold text-indigo-800 text-sm">🔒 This Week's Top Story</h4>
                        <p class="text-gray-700 text-sm">New ransomware variant targets healthcare systems with improved encryption methods</p>
                    </div>
                    
                    <div class="border-l-4 border-green-500 pl-3">
                        <h4 class="font-semibold text-green-800 text-sm">✅ Security Tip</h4>
                        <p class="text-gray-700 text-sm">Enable MFA on all critical accounts - it stops 99.9% of automated attacks</p>
                    </div>
                    
                    <div class="border-l-4 border-orange-500 pl-3">
                        <h4 class="font-semibold text-orange-800 text-sm">⚠️ Vulnerability Alert</h4>
                        <p class="text-gray-700 text-sm">Critical OpenSSL update available - patch immediately (CVE-2024-5678)</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-3 rounded mb-4">
                    <h4 class="font-semibold text-gray-800 text-sm mb-2">📚 Featured Resources:</h4>
                    <ul class="text-gray-700 text-sm space-y-1">
                        <li>• <a href="#" class="text-indigo-600 hover:underline">NIST Cybersecurity Framework 2.0 - What's New</a></li>
                        <li>• <a href="#" class="text-indigo-600 hover:underline">Zero Trust Architecture Implementation Guide</a></li>
                        <li>• <a href="#" class="text-indigo-600 hover:underline">Incident Response Playbook Template</a></li>
                    </ul>
                </div>
                
                <p class="text-gray-800 text-sm mb-3">
                    Thank you for reading! Forward this newsletter to colleagues who might find it valuable.
                </p>
                
                <p class="text-gray-800 text-sm">
                    Best regards,<br>
                    <span class="font-bold">The Cybersecurity Daily Team</span><br>
                    <span class="text-xs text-gray-600">newsletter@cybersecuritydaily.com</span>
                </p>
                
                <div class="mt-4 pt-3 border-t border-gray-200 text-center">
                    <p class="text-xs text-gray-500 mb-2">
                        You're receiving this because you subscribed to our weekly newsletter.
                    </p>
                    <p class="text-xs text-gray-500">
                        <a href="#" class="text-indigo-600 hover:underline">Update preferences</a> | 
                        <a href="#" class="text-indigo-600 hover:underline">Unsubscribe</a>
                    </p>
                </div>
            </div>
        `;

        return this.createStyledContainer(
            content,
            'bg-indigo-50 border-indigo-200',
            headerInfo
        );
    }
}

export const NewsletterSubscription = new NewsletterSubscriptionClass().toEmailObject();
