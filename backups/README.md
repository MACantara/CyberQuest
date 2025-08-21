# CyberQuest System Backup Documentation

## Overview
The CyberQuest admin panel includes a comprehensive backup and restore system for database management and disaster recovery.

## Features

### 🔄 Database Backup
- **Full Database Backup**: Creates complete snapshots of all system data
- **ZIP Compression**: Backups are compressed for efficient storage
- **Metadata Tracking**: Each backup includes creation timestamp, user info, and record counts
- **Multiple Tables**: Backs up users, login attempts, email verifications, contact submissions, and password reset tokens

### 📁 Backup Management
- **Download Backups**: Download backup files for external storage
- **Delete Old Backups**: Remove unnecessary backup files to save space
- **Backup Listing**: View all available backups with size and creation date
- **Secure Access**: Only admin users can access backup functionality

### ⚡ Restore Options
- **Merge Mode**: Combine backup data with existing database (recommended)
- **Replace Mode**: Replace all existing data with backup (DANGEROUS - use with caution)
- **Upload Support**: Upload and restore from external backup files

### 🕒 Scheduling (Production)
- **Automated Backups**: Configure daily/weekly/monthly backup schedules
- **Retention Policies**: Automatically clean up old backups
- **Email Notifications**: Get notified of backup success/failure
- **Background Processing**: Backups run in background without affecting users

## How to Use

### Creating a Backup
1. Go to Admin Panel → System Backup
2. Click "Create Backup" button
3. Wait for backup completion
4. Download or manage through the backup list

### Restoring from Backup
1. Go to Admin Panel → System Backup
2. Upload a backup file or select existing backup
3. Choose restore type (Merge or Replace)
4. Confirm restoration (irreversible operation)

### Scheduling Backups
1. Go to Admin Panel → System Backup → Schedule
2. Enable automatic backups
3. Configure frequency and retention
4. Set up email notifications

## File Structure

```
backups/
├── cyberquest_backup_20250822_001234.zip
├── cyberquest_backup_20250821_020000.zip
└── ...

Each ZIP contains:
├── database_backup.json       # All table data
├── backup_metadata.json      # Backup information
└── app_info.json            # Application details
```

## Security Considerations

⚠️ **Important Security Notes:**
- Backup files contain sensitive data including encrypted passwords
- Store backups in secure locations with restricted access
- Use HTTPS when downloading/uploading backups
- Regularly test restore procedures
- Implement off-site backup storage for disaster recovery

## Production Setup

For production environments, consider:
1. **Automated Scheduling**: Set up Celery or cron jobs for automatic backups
2. **Cloud Storage**: Integrate with AWS S3, Google Cloud, or Azure for backup storage
3. **Monitoring**: Set up alerts for backup failures
4. **Testing**: Regularly test restore procedures
5. **Compliance**: Ensure backups meet your data retention requirements

## Troubleshooting

### Common Issues
- **Large Database**: For databases >100MB, consider implementing streaming backups
- **Timeout Errors**: Increase server timeout limits for large backups
- **Storage Space**: Monitor backup directory size and implement cleanup
- **Permission Errors**: Ensure backup directory has proper write permissions

### Error Recovery
- Check server logs for detailed error messages
- Verify database connection and permissions
- Ensure sufficient disk space for backup creation
- Test with smaller datasets first

## API Endpoints

- `GET /admin/system-backup` - Backup management page
- `POST /admin/create-backup` - Create new backup
- `GET /admin/download-backup/<filename>` - Download backup
- `POST /admin/delete-backup/<filename>` - Delete backup
- `POST /admin/restore-backup` - Restore from backup
- `GET /admin/backup-schedule` - Backup scheduling page

## Configuration

Key configuration options:
- `BACKUP_DIRECTORY`: Location for backup files (default: ./backups)
- `MAX_BACKUP_SIZE`: Maximum backup file size
- `BACKUP_RETENTION_DAYS`: Default retention period
- `ENABLE_AUTO_BACKUP`: Enable/disable automatic backups

## Support

For backup-related issues:
1. Check the admin panel logs
2. Verify system permissions
3. Test with manual backup creation
4. Contact system administrator if issues persist
