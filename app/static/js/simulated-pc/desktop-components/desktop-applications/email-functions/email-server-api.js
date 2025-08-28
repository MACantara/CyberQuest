/**
 * Email Server API - Handles server-side communication for Level 2 email tracking
 * Replaces localStorage usage with server-side persistence
 */
export class EmailServerAPI {
    constructor() {
        this.baseUrl = '/levels/api/level/2';
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    /**
     * Save email actions to server
     */
    async saveEmailActions(emailStates) {
        try {
            const response = await fetch(`${this.baseUrl}/email-actions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailStates)
            });

            if (response.ok) {
                const result = await response.json();
                return result.success;
            } else {
                console.error('Failed to save email actions:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error saving email actions:', error);
            return false;
        }
    }

    /**
     * Load email actions from server
     */
    async loadEmailActions() {
        try {
            // Check cache first
            if (this.cache.has('email_actions')) {
                return this.cache.get('email_actions');
            }

            // Check if request is already pending
            if (this.pendingRequests.has('email_actions')) {
                return await this.pendingRequests.get('email_actions');
            }

            // Make the request
            const requestPromise = fetch(`${this.baseUrl}/email-actions`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.cache.set('email_actions', data.email_states);
                        return data.email_states;
                    } else {
                        console.error('Failed to load email actions:', data.error);
                        return {
                            reported_phishing: [],
                            marked_legitimate: [],
                            spam_emails: [],
                            read_emails: []
                        };
                    }
                })
                .catch(error => {
                    console.error('Error loading email actions:', error);
                    return {
                        reported_phishing: [],
                        marked_legitimate: [],
                        spam_emails: [],
                        read_emails: []
                    };
                })
                .finally(() => {
                    this.pendingRequests.delete('email_actions');
                });

            this.pendingRequests.set('email_actions', requestPromise);
            return await requestPromise;

        } catch (error) {
            console.error('Error loading email actions:', error);
            return {
                reported_phishing: [],
                marked_legitimate: [],
                spam_emails: [],
                read_emails: []
            };
        }
    }

    /**
     * Save session data to server
     */
    async saveSessionData(sessionData) {
        try {
            const response = await fetch(`${this.baseUrl}/session-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sessionData)
            });

            if (response.ok) {
                const result = await response.json();
                return result.success;
            } else {
                console.error('Failed to save session data:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error saving session data:', error);
            return false;
        }
    }

    /**
     * Load session data from server
     */
    async loadSessionData() {
        try {
            // Check cache first
            if (this.cache.has('session_data')) {
                return this.cache.get('session_data');
            }

            const response = await fetch(`${this.baseUrl}/session-data`);
            const data = await response.json();
            
            if (data.success) {
                this.cache.set('session_data', data.session_data);
                return data.session_data;
            } else {
                console.error('Failed to load session data:', data.error);
                return {};
            }
        } catch (error) {
            console.error('Error loading session data:', error);
            return {};
        }
    }

    /**
     * Clear cache - useful when data needs to be refreshed
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Save specific email action with immediate server sync
     */
    async saveEmailAction(actionType, emailId, additionalData = {}) {
        try {
            const emailStates = await this.loadEmailActions();
            
            // Update the specific action
            switch (actionType) {
                case 'report_phishing':
                    if (!emailStates.reported_phishing.includes(emailId)) {
                        emailStates.reported_phishing.push(emailId);
                    }
                    break;
                case 'mark_legitimate':
                    if (!emailStates.marked_legitimate.includes(emailId)) {
                        emailStates.marked_legitimate.push(emailId);
                    }
                    // Remove from phishing if previously reported
                    emailStates.reported_phishing = emailStates.reported_phishing.filter(id => id !== emailId);
                    break;
                case 'mark_spam':
                    if (!emailStates.spam_emails.includes(emailId)) {
                        emailStates.spam_emails.push(emailId);
                    }
                    break;
                case 'mark_read':
                    if (!emailStates.read_emails.includes(emailId)) {
                        emailStates.read_emails.push(emailId);
                    }
                    break;
            }

            // Include additional metadata
            const actionData = {
                ...emailStates,
                last_action: {
                    type: actionType,
                    emailId: emailId,
                    timestamp: new Date().toISOString(),
                    ...additionalData
                }
            };

            const success = await this.saveEmailActions(actionData);
            if (success) {
                // Update cache
                this.cache.set('email_actions', emailStates);
            }
            return success;

        } catch (error) {
            console.error('Error saving email action:', error);
            return false;
        }
    }

    /**
     * Get current email status for a specific email
     */
    async getEmailStatus(emailId) {
        try {
            const emailStates = await this.loadEmailActions();
            
            if (emailStates.reported_phishing.includes(emailId)) {
                return 'reported_phishing';
            } else if (emailStates.marked_legitimate.includes(emailId)) {
                return 'marked_legitimate';
            } else if (emailStates.spam_emails.includes(emailId)) {
                return 'spam';
            } else if (emailStates.read_emails.includes(emailId)) {
                return 'read';
            } else {
                return 'unread';
            }
        } catch (error) {
            console.error('Error getting email status:', error);
            return 'unread';
        }
    }

    /**
     * Batch update multiple email actions
     */
    async batchUpdateEmailActions(actions) {
        try {
            const emailStates = await this.loadEmailActions();
            
            // Process all actions
            for (const action of actions) {
                const { type, emailId } = action;
                
                switch (type) {
                    case 'report_phishing':
                        if (!emailStates.reported_phishing.includes(emailId)) {
                            emailStates.reported_phishing.push(emailId);
                        }
                        break;
                    case 'mark_legitimate':
                        if (!emailStates.marked_legitimate.includes(emailId)) {
                            emailStates.marked_legitimate.push(emailId);
                        }
                        emailStates.reported_phishing = emailStates.reported_phishing.filter(id => id !== emailId);
                        break;
                    case 'mark_spam':
                        if (!emailStates.spam_emails.includes(emailId)) {
                            emailStates.spam_emails.push(emailId);
                        }
                        break;
                    case 'mark_read':
                        if (!emailStates.read_emails.includes(emailId)) {
                            emailStates.read_emails.push(emailId);
                        }
                        break;
                }
            }

            const success = await this.saveEmailActions({
                ...emailStates,
                batch_update: {
                    actions: actions,
                    timestamp: new Date().toISOString()
                }
            });

            if (success) {
                this.cache.set('email_actions', emailStates);
            }
            
            return success;

        } catch (error) {
            console.error('Error batch updating email actions:', error);
            return false;
        }
    }
}
