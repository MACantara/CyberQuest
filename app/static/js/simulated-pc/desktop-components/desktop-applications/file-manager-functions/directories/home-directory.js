export const HomeDirectory = {
    path: '/home/trainee',
    type: 'directory',
    name: 'trainee',
    items: [
        { name: 'Documents', type: 'directory', icon: 'bi-folder', color: 'text-blue-400' },
        { name: 'Downloads', type: 'directory', icon: 'bi-folder', color: 'text-blue-400' },
        { name: 'Desktop', type: 'directory', icon: 'bi-folder', color: 'text-blue-400' },
        { name: 'Pictures', type: 'directory', icon: 'bi-folder', color: 'text-blue-400' },
        { name: 'Logs', type: 'directory', icon: 'bi-folder', color: 'text-yellow-400' },
        { 
            name: 'suspicious_file.txt', 
            type: 'file', 
            icon: 'bi-file-text', 
            color: 'text-red-400',
            suspicious: true,
            size: '1.3 KB',
            modified: '2024-12-20 10:31'
        },
        { 
            name: 'readme.txt', 
            type: 'file', 
            icon: 'bi-file-text', 
            color: 'text-gray-400',
            size: '256 B',
            modified: '2024-12-20 09:15'
        },
        { 
            name: '.bashrc', 
            type: 'file', 
            icon: 'bi-file-code', 
            color: 'text-green-400',
            hidden: true,
            size: '128 B',
            modified: '2024-12-19 14:22'
        },
        { 
            name: 'security_audit.log', 
            type: 'file', 
            icon: 'bi-journal-text', 
            color: 'text-yellow-400',
            size: '45.2 KB',
            modified: '2024-12-20 12:15'
        },
        { 
            name: 'system_screenshot.png', 
            type: 'file', 
            icon: 'bi-file-image', 
            color: 'text-green-400',
            size: '2.1 MB',
            modified: '2024-12-20 11:30'
        }
    ]
};
