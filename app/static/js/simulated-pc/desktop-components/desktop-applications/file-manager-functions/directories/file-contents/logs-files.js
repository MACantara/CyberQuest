export const LogsFileContents = {
    'system_access.log': `2024-12-20 14:30:01 [INFO] User login: trainee from 192.168.1.50
2024-12-20 14:29:45 [INFO] User logout: admin
2024-12-20 14:29:30 [WARN] Failed login attempt: root from 10.0.0.15
2024-12-20 14:29:15 [INFO] File accessed: /home/trainee/documents/report.pdf
2024-12-20 14:29:00 [ERROR] Privilege escalation attempt blocked for user: guest
2024-12-20 14:28:45 [INFO] System backup completed successfully
2024-12-20 14:28:30 [WARN] Disk space low on /var partition (85% full)
2024-12-20 14:28:15 [INFO] SSH connection established from 192.168.1.25`,

    'security_events.log': `2024-12-20 13:22:01 [CRITICAL] Malware detected: suspicious_file.exe quarantined
2024-12-20 13:21:45 [HIGH] Phishing email blocked from sender: fake@malicious-site.com
2024-12-20 13:21:30 [MEDIUM] Brute force attack detected on SSH service
2024-12-20 13:21:15 [HIGH] Suspicious network traffic to known botnet C&C server
2024-12-20 13:21:00 [LOW] Password policy violation: weak password detected
2024-12-20 13:20:45 [CRITICAL] Unauthorized admin access attempt
2024-12-20 13:20:30 [MEDIUM] Failed virus signature update
2024-12-20 13:20:15 [HIGH] Suspicious file download blocked: trojan.exe`,

    'firewall_blocks.log': `2024-12-20 12:45:01 BLOCK TCP 203.0.113.5:443 -> 192.168.1.10:80 [Malicious IP]
2024-12-20 12:44:55 BLOCK UDP 198.51.100.20:53 -> 192.168.1.5:53 [DNS Poisoning]
2024-12-20 12:44:50 ALLOW TCP 192.168.1.50:443 -> 8.8.8.8:443 [HTTPS Traffic]
2024-12-20 12:44:45 BLOCK TCP 172.16.0.100:22 -> 192.168.1.1:22 [Unauthorized SSH]
2024-12-20 12:44:40 BLOCK ICMP 10.0.0.50 -> 192.168.1.255 [Ping Flood]
2024-12-20 12:44:35 ALLOW TCP 192.168.1.25:80 -> 203.0.113.10:80 [Web Traffic]
2024-12-20 12:44:30 BLOCK TCP 192.168.1.100:25 -> 198.51.100.5:25 [Spam Relay]`,

    'auth_failures.log': `2024-12-20 11:15:01 [FAILED] Login attempt for user 'admin' from 203.0.113.15 - Invalid password
2024-12-20 11:14:58 [FAILED] Login attempt for user 'root' from 203.0.113.15 - Account locked
2024-12-20 11:14:55 [FAILED] Login attempt for user 'guest' from 192.168.1.200 - Invalid password
2024-12-20 11:14:52 [FAILED] SSH key authentication failed for user 'backup' from 10.0.0.25
2024-12-20 11:14:49 [FAILED] Login attempt for user 'admin' from 203.0.113.15 - Invalid password
2024-12-20 11:14:46 [FAILED] Login attempt for user 'test' from 172.16.0.50 - User not found
2024-12-20 11:14:43 [FAILED] Login attempt for user 'admin' from 203.0.113.15 - Invalid password
2024-12-20 11:14:40 [SUCCESS] Login successful for user 'trainee' from 192.168.1.50`,

    'application_debug.log': `2024-12-20 10:30:01 [DEBUG] Application startup sequence initiated
2024-12-20 10:30:02 [DEBUG] Loading configuration from /etc/app/config.xml
2024-12-20 10:30:03 [DEBUG] Database connection established: localhost:5432
2024-12-20 10:30:04 [DEBUG] User authentication module loaded
2024-12-20 10:30:05 [DEBUG] Security middleware initialized
2024-12-20 10:30:06 [INFO] Application ready to accept connections
2024-12-20 10:30:07 [DEBUG] First user request received
2024-12-20 10:30:08 [DEBUG] Processing login request for user: trainee
2024-12-20 10:30:09 [DEBUG] Session created successfully`,

    'network_traffic.log': `2024-12-20 09:45:01 TCP 192.168.1.50:443 -> 8.8.8.8:443 [HTTPS - Google DNS]
2024-12-20 09:45:02 UDP 192.168.1.50:53 -> 192.168.1.1:53 [DNS Query - cyberquest.com]
2024-12-20 09:45:03 TCP 192.168.1.50:80 -> 203.0.113.10:80 [HTTP - Web browsing]
2024-12-20 09:45:04 TCP 192.168.1.25:22 -> 192.168.1.50:22 [SSH Connection]
2024-12-20 09:45:05 UDP 192.168.1.50:123 -> 129.6.15.28:123 [NTP Time sync]
2024-12-20 09:45:06 TCP 192.168.1.50:993 -> 203.0.113.20:993 [IMAPS - Email]
2024-12-20 09:45:07 TCP 192.168.1.50:443 -> 198.51.100.5:443 [HTTPS - Secure web]`
};
