import { EmailServerAPI } from './email-server-api.js';

export class EmailReadTracker {
    constructor() {
        this.readEmails = new Set();
        this.isLoaded = false;
        this.emailServerAPI = new EmailServerAPI();
        this.loadFromServer();
    }

    // Mark an email as read
    async markAsRead(emailId) {
        if (!emailId) return false;
        
        await this.ensureLoaded();
        this.readEmails.add(emailId);
        await this.saveToServer();
        
        // Emit event for any listeners
        document.dispatchEvent(new CustomEvent('email-marked-read', {
            detail: { 
                emailId, 
                timestamp: new Date().toISOString(),
                totalRead: this.readEmails.size
            }
        }));
        
        return true;
    }

    // Mark multiple emails as read
    async markMultipleAsRead(emailIds) {
        if (!Array.isArray(emailIds)) return false;
        
        await this.ensureLoaded();
        let changed = false;
        emailIds.forEach(emailId => {
            if (emailId && !this.readEmails.has(emailId)) {
                this.readEmails.add(emailId);
                changed = true;
            }
        });
        
        if (changed) {
            await this.saveToServer();
            
            // Emit bulk event
            document.dispatchEvent(new CustomEvent('emails-marked-read', {
                detail: { 
                    emailIds, 
                    timestamp: new Date().toISOString(),
                    totalRead: this.readEmails.size
                }
            }));
        }
        
        return changed;
    }

    // Check if an email is read
    isRead(emailId) {
        return this.readEmails.has(emailId);
    }

    // Mark an email as unread
    async markAsUnread(emailId) {
        if (!emailId || !this.readEmails.has(emailId)) return false;
        
        await this.ensureLoaded();
        this.readEmails.delete(emailId);
        await this.saveToServer();
        
        // Emit event
        document.dispatchEvent(new CustomEvent('email-marked-unread', {
            detail: { 
                emailId, 
                timestamp: new Date().toISOString(),
                totalRead: this.readEmails.size
            }
        }));
        
        return true;
    }

    // Get all read email IDs
    getReadEmails() {
        return Array.from(this.readEmails);
    }

    // Get unread emails from a list
    getUnreadEmails(allEmails) {
        return allEmails.filter(email => !this.isRead(email.id));
    }

    // Get read emails from a list
    getReadEmailsFromList(allEmails) {
        return allEmails.filter(email => this.isRead(email.id));
    }

    // Get read count
    getReadCount() {
        return this.readEmails.size;
    }

    // Get unread count from a list of emails
    getUnreadCount(allEmails) {
        return allEmails.filter(email => !this.isRead(email.id)).length;
    }

    // Check if all emails are read
    areAllRead(allEmails) {
        return allEmails.every(email => this.isRead(email.id));
    }

    // Get reading statistics
    getReadingStats(allEmails) {
        const total = allEmails.length;
        const read = allEmails.filter(email => this.isRead(email.id)).length;
        const unread = total - read;
        const readPercentage = total > 0 ? Math.round((read / total) * 100) : 0;
        
        return {
            total,
            read,
            unread,
            readPercentage,
            allRead: read === total
        };
    }

    // Filter emails by read status
    filterByReadStatus(allEmails, readStatus) {
        switch (readStatus) {
            case 'read':
                return this.getReadEmailsFromList(allEmails);
            case 'unread':
                return this.getUnreadEmails(allEmails);
            default:
                return allEmails;
        }
    }

    // Mark all emails as read
    async markAllAsRead(allEmails) {
        await this.ensureLoaded();
        let changed = false;
        
        allEmails.forEach(email => {
            if (!this.readEmails.has(email.id)) {
                this.readEmails.add(email.id);
                changed = true;
            }
        });
        
        if (changed) {
            await this.saveToServer();
            
            // Emit event
            document.dispatchEvent(new CustomEvent('all-emails-marked-read', {
                detail: { 
                    emailIds: allEmails.map(e => e.id),
                    timestamp: new Date().toISOString(),
                    totalRead: this.readEmails.size
                }
            }));
        }
        
        return changed;
    }

    // Mark all emails as unread
    async markAllAsUnread(allEmails) {
        await this.ensureLoaded();
        let changed = false;
        
        allEmails.forEach(email => {
            if (this.readEmails.has(email.id)) {
                this.readEmails.delete(email.id);
                changed = true;
            }
        });
        
        if (changed) {
            await this.saveToServer();
            
            // Emit event
            document.dispatchEvent(new CustomEvent('all-emails-marked-unread', {
                detail: { 
                    emailIds: allEmails.map(e => e.id),
                    timestamp: new Date().toISOString(),
                    totalRead: this.readEmails.size
                }
            }));
        }
        
        return changed;
    }

    /**
     * Clear all read states and update the server
     */
    async clearReadStates() {
        this.readEmails.clear();
        await this.saveToServer();
        this.isLoaded = true; // Mark as loaded to prevent race conditions
        console.log('Email read states cleared');
        
        // Emit event to update UI
        document.dispatchEvent(new CustomEvent('read-states-cleared', {
            detail: {
                timestamp: new Date().toISOString()
            }
        }));
        
        return true;
    }

    // Auto-mark as read when email is opened (with delay)
    autoMarkAsRead(emailId, delay = 0) {
        if (delay > 0) {
            setTimeout(() => {
                this.markAsRead(emailId);
            }, delay);
        } else {
            this.markAsRead(emailId);
        }
    }

    // Server-side persistence methods
    async saveToServer() {
        try {
            await this.emailServerAPI.saveEmailAction('batch_read_update', null, {
                read_emails: Array.from(this.readEmails),
                timestamp: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Failed to save read emails to server:', error);
            return false;
        }
    }

    async loadFromServer() {
        try {
            const emailStates = await this.emailServerAPI.loadEmailActions();
            if (emailStates.read_emails && Array.isArray(emailStates.read_emails)) {
                this.readEmails = new Set(emailStates.read_emails);
            }
            this.isLoaded = true;
            return true;
        } catch (error) {
            console.error('Failed to load read emails from server:', error);
            this.isLoaded = true; // Mark as loaded even on error
            return false;
        }
    }

    // Ensure data is loaded before operations
    async ensureLoaded() {
        if (!this.isLoaded) {
            await this.loadFromServer();
        }
    }

    // Get last update timestamp
    getLastUpdateTimestamp() {
        // Since we're now using server-side storage, this method can return the loaded timestamp
        return this.loadedTimestamp || null;
    }

    // Export data for backup/migration
    exportData() {
        return {
            readEmails: Array.from(this.readEmails),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
    }

    // Import data from backup
    async importData(data) {
        try {
            if (data && Array.isArray(data.readEmails)) {
                this.readEmails = new Set(data.readEmails);
                await this.saveToServer();
                
                // Emit import event
                document.dispatchEvent(new CustomEvent('read-emails-imported', {
                    detail: { 
                        count: this.readEmails.size,
                        timestamp: new Date().toISOString()
                    }
                }));
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to import read emails data:', error);
            return false;
        }
    }

    // Clear all read status
    async clearAllReadStatus() {
        const hadEmails = this.readEmails.size > 0;
        this.readEmails.clear();
        await this.saveToServer();
        
        if (hadEmails) {
            // Emit clear event
            document.dispatchEvent(new CustomEvent('read-emails-cleared', {
                detail: { 
                    timestamp: new Date().toISOString()
                }
            }));
        }
        
        return hadEmails;
    }

    // Clear CLIENT-SIDE read status only (preserve server analytics)
    clearClientState() {
        console.log('Clearing client-side read status (preserving server analytics)...');
        this.readEmails.clear();
        console.log('Client-side read status cleared');
    }

    // Force reload from server (for debugging/testing)
    async forceReload() {
        this.isLoaded = false;
        this.readEmails.clear();
        await this.loadFromServer();
        console.log('Forced reload completed. Read emails:', Array.from(this.readEmails));
        return this.readEmails.size;
    }

    // Debug method to check current state
    debugCurrentState() {
        console.log('EmailReadTracker Debug Info:');
        console.log('  isLoaded:', this.isLoaded);
        console.log('  readEmails count:', this.readEmails.size);
        console.log('  readEmails:', Array.from(this.readEmails));
        return {
            isLoaded: this.isLoaded,
            readEmailsCount: this.readEmails.size,
            readEmails: Array.from(this.readEmails)
        };
    }

    // Cleanup old read status for emails that no longer exist
    async cleanupOldReadStatus(currentEmailIds) {
        const currentSet = new Set(currentEmailIds);
        let removed = 0;
        
        for (const emailId of this.readEmails) {
            if (!currentSet.has(emailId)) {
                this.readEmails.delete(emailId);
                removed++;
            }
        }
        
        if (removed > 0) {
            await this.saveToServer();
            
            // Emit cleanup event
            document.dispatchEvent(new CustomEvent('read-emails-cleaned', {
                detail: { 
                    removedCount: removed,
                    timestamp: new Date().toISOString()
                }
            }));
        }
        
        return removed;
    }

    // Get read status summary for debugging
    getSummary(allEmails = []) {
        const stats = this.getReadingStats(allEmails);
        const lastUpdate = this.getLastUpdateTimestamp();
        
        return {
            ...stats,
            lastUpdate,
            storageKey: this.storageKey,
            readEmailIds: Array.from(this.readEmails)
        };
    }

    // Create visual indicator for read/unread status
    createReadStatusIndicator(emailId, options = {}) {
        const isRead = this.isRead(emailId);
        const {
            readClass = 'bg-gray-400',
            unreadClass = 'bg-blue-500',
            size = 'w-2 h-2',
            shape = 'rounded-full',
            title = isRead ? 'Read' : 'Unread'
        } = options;
        
        const statusClass = isRead ? readClass : unreadClass;
        
        return `<span class="inline-block ${size} ${shape} ${statusClass} mr-3" title="${title}"></span>`;
    }

    // Batch operations for performance
    async batchOperation(operations) {
        let changed = false;
        
        operations.forEach(({ action, emailId }) => {
            switch (action) {
                case 'read':
                    if (!this.readEmails.has(emailId)) {
                        this.readEmails.add(emailId);
                        changed = true;
                    }
                    break;
                case 'unread':
                    if (this.readEmails.has(emailId)) {
                        this.readEmails.delete(emailId);
                        changed = true;
                    }
                    break;
            }
        });
        
        if (changed) {
            await this.saveToServer();
        }
        
        return changed;
    }
}
