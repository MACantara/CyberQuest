export const LegitimateEmail = {
    id: 'cyberquest-welcome',
    folder: 'inbox',
    sender: 'welcome@cyberquest.com',
    subject: 'Welcome to CyberQuest Training',
    time: '1 day ago',
    body: `
        <div class="bg-green-50 p-4 rounded-lg border border-green-200">
            <div class="flex items-center space-x-3 border-b border-green-200 pb-3 mb-4">
                <div class="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                    <i class="bi bi-shield-check text-white text-lg"></i>
                </div>
                <div>
                    <span class="block text-base font-bold text-green-900">CyberQuest Training Platform</span>
                    <span class="block text-xs text-green-700">Professional Cybersecurity Education</span>
                </div>
            </div>
            <div class="bg-white border border-green-200 rounded-lg p-4">
                <h2 class="text-base font-semibold text-green-900 mb-3">Welcome to Your Cybersecurity Journey!</h2>
                <p class="text-gray-800 text-sm mb-3">
                    Dear Trainee,
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    Thank you for joining CyberQuest Training Platform. You're now enrolled in our comprehensive cybersecurity education program.
                </p>
                <p class="text-gray-800 text-sm mb-3">
                    During this simulation, you'll learn to identify and respond to various cyber threats including:
                </p>
                <ul class="text-gray-800 text-sm mb-3 list-disc list-inside">
                    <li>Phishing emails and suspicious links</li>
                    <li>Fraudulent websites and scam pages</li>
                    <li>Network security monitoring</li>
                    <li>Safe browsing practices</li>
                </ul>
                <p class="text-gray-800 text-sm mb-3">
                    Remember: Always verify the authenticity of emails and websites before sharing personal information.
                </p>
                <p class="text-gray-800 text-sm mt-4">
                    Stay safe and happy learning!<br>
                    <span class="font-bold text-green-900">The CyberQuest Team</span>
                </p>
            </div>
            <div class="bg-green-100 border border-green-300 rounded p-3 mt-4">
                <p class="text-green-800 text-xs">
                    <i class="bi bi-info-circle mr-1"></i>
                    This is a legitimate training email from CyberQuest. Notice the professional formatting, clear sender, and educational content.
                </p>
            </div>
        </div>
    `,
    suspicious: false
};
