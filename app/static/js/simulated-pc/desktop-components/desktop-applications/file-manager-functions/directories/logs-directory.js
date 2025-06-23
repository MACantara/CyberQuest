export const LogsDirectory = {
    path: '/home/trainee/Logs',
    type: 'directory',
    name: 'Logs',
    items: [
        { 
            name: 'system_access.log', 
            type: 'file', 
            icon: 'bi-journal-text', 
            color: 'text-yellow-400',
            size: '128 KB',
            modified: '2024-12-20 14:30'
        },
        { 
            name: 'security_events.log', 
            type: 'file', 
            icon: 'bi-journal-text', 
            color: 'text-red-400',
            suspicious: true,
            size: '89 KB',
            modified: '2024-12-20 13:22'
        },
        { 
            name: 'firewall_blocks.log', 
            type: 'file', 
            icon: 'bi-journal-text', 
            color: 'text-orange-400',
            size: '256 KB',
            modified: '2024-12-20 12:45'
        },
        { 
            name: 'auth_failures.log', 
            type: 'file', 
            icon: 'bi-journal-text', 
            color: 'text-red-400',
            suspicious: true,
            size: '67 KB',
            modified: '2024-12-20 11:15'
        },
        { 
            name: 'application_debug.log', 
            type: 'file', 
            icon: 'bi-journal-text', 
            color: 'text-blue-400',
            size: '512 KB',
            modified: '2024-12-20 10:30'
        },
        { 
            name: 'network_traffic.log', 
            type: 'file', 
            icon: 'bi-journal-text', 
            color: 'text-green-400',
            size: '1.2 MB',
            modified: '2024-12-20 09:45'
        }
    ]
};
