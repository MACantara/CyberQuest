export const DownloadsDirectory = {
    path: '/home/trainee/Downloads',
    type: 'directory',
    name: 'Downloads',
    items: [
        { 
            name: 'malware_sample.exe', 
            type: 'file', 
            icon: 'bi-file-binary', 
            color: 'text-red-500',
            suspicious: true,
            size: '2.0 KB',
            modified: '2024-12-20 08:22'
        },
        { 
            name: 'installer.deb', 
            type: 'file', 
            icon: 'bi-file-zip', 
            color: 'text-orange-400',
            size: '15.7 MB',
            modified: '2024-12-18 13:10'
        },
        { 
            name: 'profile_photo.jpg', 
            type: 'file', 
            icon: 'bi-file-image', 
            color: 'text-green-400',
            size: '850 KB',
            modified: '2024-12-19 14:20'
        },
        { 
            name: 'network_diagram.png', 
            type: 'file', 
            icon: 'bi-file-image', 
            color: 'text-green-400',
            size: '1.2 MB',
            modified: '2024-12-18 16:45'
        }
    ]
};
