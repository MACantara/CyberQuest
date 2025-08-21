"""
System backup routes for admin panel.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, send_file
from flask_login import login_required, current_user
from app.models.user import User
from app.models.login_attempt import LoginAttempt
from app.models.email_verification import EmailVerification
from app.models.contact import Contact
from app.database import DatabaseError, get_supabase, Tables
from app.routes.admin.admin_utils import admin_required
from datetime import datetime
from typing import Dict, Any
import json
import os
import tempfile
import zipfile

system_backup_bp = Blueprint('system_backup', __name__, url_prefix='/admin')


def _format_file_size(size_bytes):
    """Format file size in appropriate units."""
    if size_bytes >= 1024 * 1024 * 1024:  # GB
        return f"{size_bytes / (1024 * 1024 * 1024):.1f} GB"
    elif size_bytes >= 1024 * 1024:  # MB
        return f"{size_bytes / (1024 * 1024):.1f} MB"
    elif size_bytes >= 1024:  # KB
        return f"{size_bytes / 1024:.1f} KB"
    else:  # Bytes
        return f"{size_bytes} bytes"


@system_backup_bp.route('/system-backup')
@login_required
@admin_required
def backup_management():
    """System backup and restore management page."""
    try:
        # Get backup directory info
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # List existing backups with enhanced metadata
        backups = []
        if os.path.exists(backup_dir):
            for filename in os.listdir(backup_dir):
                if filename.endswith('.zip'):
                    backup_path = os.path.join(backup_dir, filename)
                    try:
                        stat = os.stat(backup_path)
                        backup_info = {
                            'filename': filename,
                            'size': stat.st_size,
                            'created_at': datetime.fromtimestamp(stat.st_ctime),
                            'size_mb': round(stat.st_size / (1024 * 1024), 2),
                            'size_formatted': _format_file_size(stat.st_size)
                        }
                        
                        # Try to extract metadata from inside the ZIP file
                        try:
                            with zipfile.ZipFile(backup_path, 'r') as zipf:
                                # Check if backup metadata exists
                                if 'backup_metadata.json' in zipf.namelist():
                                    metadata_json = zipf.read('backup_metadata.json')
                                    metadata = json.loads(metadata_json)
                                    
                                    # Use metadata creation time if available (more accurate)
                                    if 'created_at' in metadata:
                                        try:
                                            backup_info['created_at'] = datetime.fromisoformat(metadata['created_at'].replace('Z', '+00:00')).replace(tzinfo=None)
                                        except (ValueError, AttributeError):
                                            pass  # Keep filesystem timestamp as fallback
                                    
                                    # Add additional metadata with backward compatibility
                                    backup_info['metadata'] = {
                                        'tables_backed_up': metadata.get('tables_backed_up', len(metadata.get('tables_included', []))),
                                        'total_records': metadata.get('total_records', 0),
                                        'app_version': metadata.get('app_version', f"Version {metadata.get('version', 'Unknown')}"),
                                        'database_type': metadata.get('database_type', 'Supabase'),
                                        'created_by': metadata.get('created_by', 'Unknown'),
                                        'record_counts': metadata.get('record_counts', {}),
                                        'backup_version': metadata.get('version', '1.0')
                                    }
                                else:
                                    # Legacy backup without metadata
                                    backup_info['metadata'] = {
                                        'tables_backed_up': 'Unknown',
                                        'total_records': 'Unknown',
                                        'app_version': 'Legacy',
                                        'database_type': 'Unknown'
                                    }
                        except (zipfile.BadZipFile, json.JSONDecodeError, KeyError) as e:
                            current_app.logger.warning(f"Could not read metadata from backup {filename}: {e}")
                            backup_info['metadata'] = {
                                'tables_backed_up': 'Error',
                                'total_records': 'Error',
                                'app_version': 'Error',
                                'database_type': 'Error'
                            }
                        
                        backups.append(backup_info)
                        
                    except OSError as e:
                        current_app.logger.error(f"Could not access backup file {filename}: {e}")
                        continue
        
        # Sort backups by creation date (newest first)
        backups.sort(key=lambda x: x['created_at'], reverse=True)
        
        # Get database statistics
        stats = {
            'total_users': User.count_all(),
            'total_login_attempts': LoginAttempt.count_recent_attempts(365 * 10),  # All time
            'total_verifications': EmailVerification.count_verified_emails() + EmailVerification.count_pending_verifications(),
            'total_contacts': Contact.get_unread_count() + 100,  # Approximate total (would need a count_all method)
            'backup_count': len(backups),
            'last_backup': backups[0]['created_at'] if backups else None
        }
        
        return render_template('admin/system-backup/backup.html', 
                             backups=backups, 
                             stats=stats)
    
    except Exception as e:
        current_app.logger.error(f"System backup page error: {e}")
        flash('Error loading backup management page.', 'error')
        return redirect(url_for('admin.dashboard'))


@system_backup_bp.route('/create-backup', methods=['POST'])
@login_required
@admin_required
def create_backup():
    """Create a full system backup."""
    try:
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        # Generate backup filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f'cyberquest_backup_{timestamp}.zip'
        backup_path = os.path.join(backup_dir, backup_filename)
        
        # Create backup data
        backup_data = _create_database_backup()
        
        # Create ZIP file with backup data
        with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            # Add database backup as JSON
            zipf.writestr('database_backup.json', json.dumps(backup_data, indent=2, default=str))
            
            # Add metadata
            total_records = sum(len(table_data) for table_data in backup_data.values())
            metadata = {
                'backup_type': 'full',
                'created_at': datetime.now().isoformat(),
                'created_by': current_user.username,
                'version': '2.0',  # Updated version
                'tables_included': list(backup_data.keys()),
                'tables_backed_up': len(backup_data.keys()),
                'total_records': total_records,
                'record_counts': {table: len(data) for table, data in backup_data.items()},
                'app_version': 'CyberQuest v1.0',
                'database_type': 'Supabase PostgreSQL',
                'backup_size_estimate': 'See file properties'
            }
            zipf.writestr('backup_metadata.json', json.dumps(metadata, indent=2))
            
            # Add application info
            app_info = {
                'app_name': 'CyberQuest',
                'backup_created_at': datetime.now().isoformat(),
                'python_version': '3.12',
                'database_type': 'Supabase PostgreSQL'
            }
            zipf.writestr('app_info.json', json.dumps(app_info, indent=2))
        
        file_size = os.path.getsize(backup_path)
        size_mb = round(file_size / (1024 * 1024), 2)
        
        flash(f'Backup created successfully: {backup_filename} ({size_mb} MB)', 'success')
        current_app.logger.info(f'Database backup created by {current_user.username}: {backup_filename}')
        
    except Exception as e:
        current_app.logger.error(f"Backup creation error: {e}")
        flash('Error creating backup. Please check server logs.', 'error')
    
    return redirect(url_for('system_backup.backup_management'))


@system_backup_bp.route('/download-backup/<filename>')
@login_required
@admin_required
def download_backup(filename):
    """Download a backup file."""
    try:
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        backup_path = os.path.join(backup_dir, filename)
        
        if not os.path.exists(backup_path) or not filename.endswith('.zip'):
            flash('Backup file not found.', 'error')
            return redirect(url_for('system_backup.backup_management'))
        
        current_app.logger.info(f'Backup downloaded by {current_user.username}: {filename}')
        return send_file(backup_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        current_app.logger.error(f"Backup download error: {e}")
        flash('Error downloading backup file.', 'error')
        return redirect(url_for('system_backup.backup_management'))


@system_backup_bp.route('/delete-backup/<filename>', methods=['POST'])
@login_required
@admin_required
def delete_backup(filename):
    """Delete a backup file."""
    try:
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        backup_path = os.path.join(backup_dir, filename)
        
        if not os.path.exists(backup_path) or not filename.endswith('.zip'):
            flash('Backup file not found.', 'error')
            return redirect(url_for('system_backup.backup_management'))
        
        os.remove(backup_path)
        flash(f'Backup {filename} deleted successfully.', 'success')
        current_app.logger.info(f'Backup deleted by {current_user.username}: {filename}')
        
    except Exception as e:
        current_app.logger.error(f"Backup deletion error: {e}")
        flash('Error deleting backup file.', 'error')
    
    return redirect(url_for('system_backup.backup_management'))


@system_backup_bp.route('/restore-backup', methods=['POST'])
@login_required
@admin_required
def restore_backup():
    """Restore system from a backup file."""
    try:
        if 'backup_file' not in request.files:
            flash('No backup file provided.', 'error')
            return redirect(url_for('system_backup.backup_management'))
        
        file = request.files['backup_file']
        if file.filename == '' or not file.filename.endswith('.zip'):
            flash('Please select a valid backup file (.zip).', 'error')
            return redirect(url_for('system_backup.backup_management'))
        
        # Save uploaded file temporarily
        temp_file_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_file:
                temp_file_path = temp_file.name
                file.save(temp_file_path)
            
            # Extract and restore backup
            with zipfile.ZipFile(temp_file_path, 'r') as zipf:
                try:
                    # Read backup metadata
                    metadata = json.loads(zipf.read('backup_metadata.json'))
                    
                    # Read database backup
                    backup_data = json.loads(zipf.read('database_backup.json'))
                    
                    # Perform restore with confirmation
                    restore_type = request.form.get('restore_type', 'merge')
                    
                    # Count records to be restored
                    total_records = sum(len(table_data) for table_data in backup_data.values())
                    
                    current_app.logger.info(f'Starting database restore: {restore_type} mode, {total_records} records')
                    
                    _restore_database_backup(backup_data, restore_type)
                    
                    # Generate detailed success message
                    if restore_type == 'replace':
                        flash(f'Database REPLACED successfully! All existing data was deleted and replaced with {total_records} records from backup created on {metadata.get("created_at", "unknown date")}. Previous data is permanently lost.', 'success')
                    else:
                        flash(f'Database MERGED successfully! {total_records} records from backup created on {metadata.get("created_at", "unknown date")} have been merged with existing data.', 'success')
                    
                    current_app.logger.info(f'Database restored by {current_user.username} using {restore_type} mode from backup: {file.filename}')
                    
                except json.JSONDecodeError as e:
                    current_app.logger.error(f"Invalid backup file format: {e}")
                    flash('Invalid backup file format. Please ensure you are uploading a valid CyberQuest backup.', 'error')
                except KeyError as e:
                    current_app.logger.error(f"Missing backup file components: {e}")
                    flash('Incomplete backup file. Missing required components.', 'error')
                except DatabaseError as e:
                    current_app.logger.error(f"Database restore failed: {e}")
                    flash(f'Database restore failed: {str(e)}', 'error')
            
        finally:
            # Clean up temp file
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.unlink(temp_file_path)
                except OSError as e:
                    current_app.logger.warning(f"Could not delete temp file {temp_file_path}: {e}")
        
    except zipfile.BadZipFile:
        current_app.logger.error("Invalid ZIP file uploaded for restore")
        flash('Invalid ZIP file. Please upload a valid backup file.', 'error')
    except Exception as e:
        current_app.logger.error(f"Backup restore error: {e}")
        flash('Error restoring backup. Please check server logs for details.', 'error')
    
    return redirect(url_for('system_backup.backup_management'))


@system_backup_bp.route('/restore-from-server', methods=['POST'])
@login_required
@admin_required
def restore_from_server():
    """Restore system from a backup file already on the server."""
    try:
        backup_filename = request.form.get('backup_filename')
        restore_type = request.form.get('restore_type', 'merge')
        
        if not backup_filename:
            flash('No backup file specified.', 'error')
            return redirect(url_for('system_backup.backup_management'))
        
        # Validate backup file exists on server
        backup_dir = os.path.join(current_app.root_path, '..', 'backups')
        backup_path = os.path.join(backup_dir, backup_filename)
        
        if not os.path.exists(backup_path) or not backup_filename.endswith('.zip'):
            flash(f'Backup file "{backup_filename}" not found on server.', 'error')
            return redirect(url_for('system_backup.backup_management'))
        
        # Extract and restore backup
        with zipfile.ZipFile(backup_path, 'r') as zipf:
            try:
                # Read backup metadata
                metadata = json.loads(zipf.read('backup_metadata.json'))
                
                # Read database backup
                backup_data = json.loads(zipf.read('database_backup.json'))
                
                # Count records to be restored
                total_records = sum(len(table_data) for table_data in backup_data.values())
                
                current_app.logger.info(f'Starting server backup restore: {restore_type} mode, {total_records} records from {backup_filename}')
                
                _restore_database_backup(backup_data, restore_type)
                
                # Generate detailed success message
                if restore_type == 'replace':
                    flash(f'Database REPLACED successfully! All existing data was deleted and replaced with {total_records} records from {backup_filename} (created {metadata.get("created_at", "unknown date")}). Previous data is permanently lost.', 'success')
                else:
                    flash(f'Database MERGED successfully! {total_records} records from {backup_filename} (created {metadata.get("created_at", "unknown date")}) have been merged with existing data.', 'success')
                
                current_app.logger.info(f'Server backup restored by {current_user.username} using {restore_type} mode from {backup_filename}')
                
            except json.JSONDecodeError as e:
                current_app.logger.error(f"Invalid backup file format: {e}")
                flash('Invalid backup file format. Please ensure the file is a valid CyberQuest backup.', 'error')
            except KeyError as e:
                current_app.logger.error(f"Missing backup file components: {e}")
                flash('Incomplete backup file. Missing required components.', 'error')
            except DatabaseError as e:
                current_app.logger.error(f"Server backup restore failed: {e}")
                flash(f'Database restore failed: {str(e)}', 'error')
        
    except zipfile.BadZipFile:
        current_app.logger.error(f"Invalid ZIP file: {backup_filename}")
        flash('Invalid backup file. File appears to be corrupted.', 'error')
    except Exception as e:
        current_app.logger.error(f"Server backup restore error: {e}")
        flash('Error restoring backup. Please check server logs for details.', 'error')
    
    return redirect(url_for('system_backup.backup_management'))


@system_backup_bp.route('/backup-schedule')
@login_required
@admin_required
def backup_schedule():
    """Backup scheduling configuration page."""
    # This would integrate with a task scheduler like Celery in production
    # For now, provide manual backup options and information
    
    schedule_info = {
        'auto_backup_enabled': False,  # Would be configurable
        'backup_frequency': 'daily',   # daily, weekly, monthly
        'backup_retention': 30,        # days to keep backups
        'next_scheduled_backup': None,
        'last_auto_backup': None
    }
    
    return render_template('admin/system-backup/schedule.html', 
                         schedule_info=schedule_info)


def _create_database_backup() -> Dict[str, Any]:
    """Create a complete database backup."""
    supabase = get_supabase()
    backup_data = {}
    
    try:
        # Backup Users table
        response = supabase.table(Tables.USERS).select("*").execute()
        backup_data['users'] = response.data if response.data else []
        
        # Backup Login Attempts table
        response = supabase.table(Tables.LOGIN_ATTEMPTS).select("*").execute()
        backup_data['login_attempts'] = response.data if response.data else []
        
        # Backup Email Verifications table
        response = supabase.table(Tables.EMAIL_VERIFICATIONS).select("*").execute()
        backup_data['email_verifications'] = response.data if response.data else []
        
        # Backup Contact Submissions table
        response = supabase.table(Tables.CONTACT_SUBMISSIONS).select("*").execute()
        backup_data['contact_submissions'] = response.data if response.data else []
        
        # Backup Password Reset Tokens table
        response = supabase.table(Tables.PASSWORD_RESET_TOKENS).select("*").execute()
        backup_data['password_reset_tokens'] = response.data if response.data else []
        
        return backup_data
        
    except Exception as e:
        current_app.logger.error(f"Database backup creation error: {e}")
        raise DatabaseError(f"Failed to create database backup: {e}")


def _restore_database_backup(backup_data: Dict[str, Any], restore_type: str = 'merge'):
    """Restore database from backup data."""
    supabase = get_supabase()
    
    try:
        if restore_type == 'replace':
            # WARNING: This will delete all existing data
            current_app.logger.warning(f"Full database replacement initiated by {current_user.username}")
            
            # Delete existing data (in reverse dependency order)
            supabase.table(Tables.PASSWORD_RESET_TOKENS).delete().neq('id', 0).execute()
            supabase.table(Tables.EMAIL_VERIFICATIONS).delete().neq('id', 0).execute()
            supabase.table(Tables.CONTACT_SUBMISSIONS).delete().neq('id', 0).execute()
            supabase.table(Tables.LOGIN_ATTEMPTS).delete().neq('id', 0).execute()
            
            # For users table in replace mode, we need to be careful about the current session
            # Delete all users first - the session will be handled by re-inserting the current user if they exist in backup
            supabase.table(Tables.USERS).delete().neq('id', 0).execute()
        
        # Restore data
        for table_name, table_data in backup_data.items():
            if not table_data:
                continue
                
            table_mapping = {
                'users': Tables.USERS,
                'login_attempts': Tables.LOGIN_ATTEMPTS,
                'email_verifications': Tables.EMAIL_VERIFICATIONS,
                'contact_submissions': Tables.CONTACT_SUBMISSIONS,
                'password_reset_tokens': Tables.PASSWORD_RESET_TOKENS
            }
            
            if table_name in table_mapping:
                current_app.logger.info(f"Restoring {len(table_data)} records to {table_name} table")
                
                # Insert data in batches to avoid timeout
                batch_size = 50  # Reduced batch size for better reliability
                for i in range(0, len(table_data), batch_size):
                    batch = table_data[i:i + batch_size]
                    
                    if restore_type == 'merge':
                        # Use upsert to merge data - this handles duplicate keys gracefully
                        try:
                            supabase.table(table_mapping[table_name]).upsert(
                                batch, 
                                on_conflict='id'  # Specify the conflict column
                            ).execute()
                        except Exception as e:
                            # If upsert fails, try individual record insertion with conflict handling
                            current_app.logger.warning(f"Batch upsert failed for {table_name}, trying individual records: {e}")
                            for record in batch:
                                try:
                                    # Try to update first, then insert if not exists
                                    existing = supabase.table(table_mapping[table_name]).select("id").eq('id', record['id']).execute()
                                    if existing.data:
                                        # Update existing record
                                        supabase.table(table_mapping[table_name]).update(record).eq('id', record['id']).execute()
                                    else:
                                        # Insert new record
                                        supabase.table(table_mapping[table_name]).insert(record).execute()
                                except Exception as record_error:
                                    current_app.logger.error(f"Failed to restore individual record in {table_name}: {record_error}")
                                    continue
                    else:
                        # Replace mode: Direct insert since we deleted all data
                        try:
                            supabase.table(table_mapping[table_name]).insert(batch).execute()
                        except Exception as e:
                            current_app.logger.error(f"Failed to insert batch in {table_name} (replace mode): {e}")
                            # If there are still conflicts in replace mode, log details and continue
                            current_app.logger.error(f"Possible incomplete deletion or backup data issues in {table_name}")
                            # Try individual inserts to identify problematic records
                            for record in batch:
                                try:
                                    supabase.table(table_mapping[table_name]).insert(record).execute()
                                except Exception as record_error:
                                    current_app.logger.error(f"Failed to insert record ID {record.get('id', 'unknown')} in {table_name}: {record_error}")
                                    continue
        
        current_app.logger.info(f"Database restore completed: {restore_type} mode")
        
    except Exception as e:
        current_app.logger.error(f"Database restore error: {e}")
        raise DatabaseError(f"Failed to restore database: {e}")
