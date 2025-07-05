import { ActivityEmitterBase } from '../../activity-emitter-base.js';

export class RansomwareDecryptorActivityEmitter extends ActivityEmitterBase {
    constructor(appId, appName) {
        super(appId, appName);
    }

    initializeCustomEvents() {
        console.log(`[${this.appName}] Ransomware decryptor activity events initialized`);
    }

    emitScanStarted() {
        this.emitActivity('ransomware_scan_started', {
            action: 'scan_initiated',
            target: 'encrypted_files'
        }, {
            message: 'Scanning for encrypted files...',
            level: 'info',
            category: 'recovery'
        });
    }

    emitFilesFound(fileCount) {
        this.emitActivity('encrypted_files_found', {
            action: 'scan_completed',
            filesFound: fileCount
        }, {
            message: `Found ${fileCount} encrypted files that can be recovered`,
            level: fileCount > 0 ? 'warn' : 'info',
            category: 'recovery'
        });
    }

    emitFileDecryptionStarted(file) {
        this.emitActivity('file_decryption_started', {
            fileName: file.originalName,
            fileId: file.id,
            priority: file.priority,
            action: 'decryption_initiated'
        }, {
            message: `Starting decryption of ${file.originalName}`,
            level: 'info',
            category: 'recovery'
        });
    }

    emitFileDecrypted(file) {
        this.emitActivity('file_decrypted', {
            fileName: file.originalName,
            fileId: file.id,
            size: file.size,
            priority: file.priority,
            action: 'file_recovered'
        }, {
            message: `Successfully decrypted ${file.originalName}`,
            level: 'info',
            category: 'recovery'
        });
    }

    emitMassDecryptionStarted(fileCount) {
        this.emitActivity('mass_decryption_started', {
            action: 'bulk_decryption_initiated',
            fileCount
        }, {
            message: `Starting mass decryption of ${fileCount} files`,
            level: 'info',
            category: 'recovery'
        });
    }

    emitMassDecryptionCompleted(decryptedCount) {
        this.emitActivity('mass_decryption_completed', {
            action: 'bulk_decryption_finished',
            filesDecrypted: decryptedCount
        }, {
            message: `Mass decryption completed - ${decryptedCount} files recovered`,
            level: 'info',
            category: 'recovery'
        });
    }

    emitDecryptionKeyUsed(keyType) {
        this.emitActivity('decryption_key_used', {
            action: 'key_applied',
            keyType
        }, {
            message: `Applied ${keyType} decryption key`,
            level: 'info',
            category: 'recovery'
        });
    }

    emitRecoveryCompleted(totalFiles) {
        this.emitActivity('recovery_completed', {
            action: 'recovery_finished',
            totalFilesRecovered: totalFiles
        }, {
            message: `Recovery operation completed successfully - ${totalFiles} files restored`,
            level: 'info',
            category: 'recovery'
        });
    }
}
