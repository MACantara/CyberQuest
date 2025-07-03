export class EmailReadTracker {
    constructor() {
        this.readEmails = new Set();
        this.storageKey = 'cyberquest_read_emails';
        this.loadFromLocalStorage();
    }

    // Mark an email as read
    markAsRead(emailId) {
        if (!emailId) return false;
        
        this.readEmails.add(emailId);
        this.saveToLocalStorage();
        
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
    markMultipleAsRead(emailIds) {
        if (!Array.isArray(emailIds)) return false;
        
        let changed = false;
        emailIds.forEach(emailId => {
            if (emailId && !this.readEmails.has(emailId)) {
                this.readEmails.add(emailId);
                changed = true;
            }
        });
        
        if (changed) {
            this.saveToLocalStorage();
            
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
    markAsUnread(emailId) {
        if (!emailId || !this.readEmails.has(emailId)) return false;
        
        this.readEmails.delete(emailId);
        this.saveToLocalStorage();
        
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
    markAllAsRead(allEmails) {
        let changed = false;
        
        allEmails.forEach(email => {
            if (!this.readEmails.has(email.id)) {
                this.readEmails.add(email.id);
                changed = true;
            }
        });
        
        if (changed) {
            this.saveToLocalStorage();
            
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
    markAllAsUnread(allEmails) {
        let changed = false;
        
        allEmails.forEach(email => {
            if (this.readEmails.has(email.id)) {
                this.readEmails.delete(email.id);
                changed = true;
            }
        });
        
        if (changed) {
            this.saveToLocalStorage();
            
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

    // Persistence methods
    saveToLocalStorage() {
        try {
            const readEmailsArray = Array.from(this.readEmails);
            localStorage.setItem(this.storageKey, JSON.stringify(readEmailsArray));
            
            // Also save timestamp of last update
            localStorage.setItem(`${this.storageKey}_updated`, new Date().toISOString());
            
            return true;
        } catch (error) {
            console.error('Failed to save read emails to localStorage:', error);
            return false;
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const readEmailsArray = JSON.parse(stored);
                if (Array.isArray(readEmailsArray)) {
                    this.readEmails = new Set(readEmailsArray);
                }
            }
            
            return true;
        } catch (error) {
            console.error('Failed to load read emails from localStorage:', error);
            this.readEmails = new Set(); // Reset to empty set on error
            return false;
        }
    }

    // Get last update timestamp
    getLastUpdateTimestamp() {
        return localStorage.getItem(`${this.storageKey}_updated`);
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
    importData(data) {
        try {
            if (data && Array.isArray(data.readEmails)) {
                this.readEmails = new Set(data.readEmails);
                this.saveToLocalStorage();
                
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
    clearAllReadStatus() {
        const hadEmails = this.readEmails.size > 0;
        this.readEmails.clear();
        this.saveToLocalStorage();
        
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

    // Cleanup old read status for emails that no longer exist
    cleanupOldReadStatus(currentEmailIds) {
        const currentSet = new Set(currentEmailIds);
        let removed = 0;
        
        for (const emailId of this.readEmails) {
            if (!currentSet.has(emailId)) {
                this.readEmails.delete(emailId);
                removed++;
            }
        }
        
        if (removed > 0) {
            this.saveToLocalStorage();
            
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
    batchOperation(operations) {
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
            this.saveToLocalStorage();
        }
        
        return changed;
    }
}
