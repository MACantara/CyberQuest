// Evidence file contents for Level 5: The Hunt for The Null
export const EvidenceFileContents = {
    'bot_logs.txt': `=== Bot Network Activity Log ===
Date: 2024-08-01
Investigation: Level 1 Misinformation Campaign

[02:00:15] Bot deployment initiated from IP: 192.168.1.100
[02:00:22] Connection established to command server
[02:00:45] Misinformation payload downloaded
[02:01:12] Bot network activated: 1,247 nodes
[02:01:30] Content distribution started
[02:02:15] Network traffic spike detected
[02:15:32] Administrator attempted to trace connection
[02:16:01] Source IP masked successfully
[02:30:45] Mission completed, bots entering dormant mode

Network Analysis:
- Origin IP: 192.168.1.100 (recurring attacker signature)
- Command server: botnet.darkweb.onion
- Payload size: 2.4 MB
- Distribution method: P2P mesh network
- Affected accounts: 50,000+ social media profiles

Security Notes:
- Attacker shows advanced knowledge of network topology
- Timing suggests automated deployment (Tuesday 2:00 AM pattern)
- Bot code contains comment: "// Null protocol v1.0"

Evidence Status: CRITICAL - Links to IP 192.168.1.100`,

    'email_headers.txt': `=== Phishing Email Header Analysis ===
Date: 2024-08-02  
Investigation: Level 2 Shadow Inbox Campaign

Message-ID: <null.2024080200@darkmail.onion>
From: security-team@payp4l-security.com
X-Mailer: NullSender v1.0
X-Originating-IP: 192.168.1.100
Date: Tue, 02 Aug 2024 02:00:32 -0400
Subject: Urgent: Account Security Alert
Content-Type: text/html; charset=UTF-8
X-Priority: 1 (Highest)

Custom Headers:
X-Null-Signature: N4LL_W4S_H3R3
X-Campaign-ID: shadow_inbox_2024
X-Bot-Network: dormant_activation_ready

DKIM Analysis:
- Domain spoofing detected: payp4l-security.com vs paypal.com
- Invalid DKIM signature (deliberately forged)
- SPF record: FAIL (sender IP not authorized)

Forensic Analysis:
- Source IP: 192.168.1.100 (SAME as bot network!)
- Mail server: smtp.nullsender.onion
- Timestamp: Tuesday 2:00 AM (PATTERN DETECTED)
- Custom mailer signature: "NullSender v1.0"
- Hidden signature in headers: "N4LL_W4S_H3R3"

Threat Assessment:
- Professional phishing toolkit usage
- Advanced email spoofing techniques  
- Coordinated with previous bot network attack
- Same IP address confirms single threat actor

Evidence Status: CRITICAL - Confirms pattern with 192.168.1.100`,

    'malware_code.txt': `=== Malware Source Code Analysis ===
Date: 2024-08-03
Investigation: Level 3 Malware Mayhem

File: suspicious_update.exe
Language: C++ with obfuscation
Compiler: MinGW 8.1.0 (Windows)

// Decompiled source code excerpt:
#include <windows.h>
#include <wininet.h>

// N4LL was here - you'll never catch me! 
class MalwarePayload {
private:
    char* command_server = "192.168.1.100:8080";
    char* backdoor_port = "31337";
    
public:
    void null_exploit() {
        // Persistence mechanism
        establish_backdoor();
        steal_credentials();
        cleanup_traces();
    }
    
    void establish_backdoor() {
        // Create hidden service on port 31337
        // Contact: 192.168.1.100 for instructions
        create_service("NullService", "System Update Service");
    }
    
    void steal_credentials() {
        // Keylogger for passwords
        // Browser credential extraction
        // Email credential theft
        send_data_to("192.168.1.100:8080");
    }
    
    void cleanup_traces() {
        // Delete installation files
        // Clear event logs
        // Remove registry entries
        // Leave signature: echo "N4LL" > evidence_cleanup.log
    }
};

// Network Configuration
char* null_servers[] = {
    "192.168.1.100",    // Primary C&C server
    "null.darkweb.onion", 
    "backup.nullhq.tor"
};

// Deployment timestamp: 2024-08-03 02:15:45
// Attack vector: Fake software update
// Persistence: Windows service + startup registry
// Communication: HTTPS to 192.168.1.100

Compilation Info:
- Built: Tuesday, August 3rd, 2024 at 2:15:45 AM
- Compiler flags: -O2 -s (optimized and stripped)
- Digital signature: FORGED (stolen certificate)
- File hash: SHA256:a1b2c3d4e5f6...

Behavioral Analysis:
- Contacts same IP as previous attacks: 192.168.1.100
- Author signature clearly visible: "N4LL was here"
- Function name: null_exploit() 
- Tuesday 2:00 AM deployment pattern continues
- Professional malware development skills

Evidence Status: CRITICAL - Same attacker signature and IP`,

    'login_logs.txt': `=== System Login Attempt Analysis ===
Date: 2024-08-04
Investigation: Level 4 Vulnerability Exploitation

System: Corporate Web Server (vulnerability-test.company.com)
Authentication: Failed Login Analysis

[02:00:15] FAILED LOGIN: admin from 192.168.1.100
[02:00:18] FAILED LOGIN: administrator from 192.168.1.100  
[02:00:21] FAILED LOGIN: root from 192.168.1.100
[02:00:24] FAILED LOGIN: guest from 192.168.1.100
[02:00:27] FAILED LOGIN: test from 192.168.1.100
[02:00:30] FAILED LOGIN: user from 192.168.1.100
[02:00:32] SUCCESS LOGIN: admin from 192.168.1.100

Session Activity (admin user):
[02:00:35] Privilege escalation attempt detected
[02:00:38] Vulnerability scanner launched: Nmap 7.91
[02:00:45] Target scan: internal network 10.0.0.0/24
[02:01:12] Exploit framework initialized  
[02:01:30] Payload deployment: reverse shell
[02:01:45] Backdoor installed: /tmp/null_backdoor
[02:02:00] File download: sensitive_data.zip (45 MB)
[02:02:30] Log tampering attempt detected
[02:02:45] Connection terminated

User Agent Analysis:
Mozilla/5.0 (X11; Linux x86_64) NullBrowser/1.0
Custom Headers:
X-Hacker-Tag: N4LL_0WN5_Y0U
X-Exploit-Kit: NullHack-Pro-2024

Attack Pattern Summary:
- Source IP: 192.168.1.100 (CONSISTENT ACROSS ALL LEVELS)
- Attack time: Tuesday 2:00 AM (EXACT PATTERN MATCH)
- Username enumeration followed by successful breach
- Professional penetration testing tools
- Signature: "N4LL" in custom headers and file names
- Advanced persistence and data exfiltration

Geolocation (IP 192.168.1.100):
- ISP: Local Network (Internal)
- Location: Same network as previous attacks
- VPN: Not detected (internal threat)
- MAC Address: 00:1B:63:84:45:E6

Evidence Status: CRITICAL - Confirms internal threat actor "N4LL"`,

    'hidden_message.txt': `=== CONFIDENTIAL: The Null's Final Message ===
Date: 2024-08-05 02:30:12
Location: /home/trainee/Evidence/.hidden/

Base64 Encoded Message:
VGhlTnVsbElzSGVyZQ==

Decoded Message: "TheNullIsHere"

Full Message from The Null:
"Congratulations, detective. You've followed my digital breadcrumbs perfectly. 
I am The Null - the ghost in your machines, the shadow in your networks.

You've traced my signature across four different attack vectors:
✓ Bot network deployment (Level 1)
✓ Phishing campaign execution (Level 2)  
✓ Malware distribution (Level 3)
✓ Vulnerability exploitation (Level 4)

My Identity: Dr. Marcus Cipher
Former Role: IT Security Consultant (contract terminated)
Motivation: Revenge against the company that betrayed me

I left clues because I wanted to be caught by someone worthy.
My attacks followed a pattern because patterns create predictability,
and predictability leads to capture by a skilled investigator.

IP Address: 192.168.1.100 (my personal workstation)
Signature: N4LL (NULL in l33t speak - representing nothing, void)
Attack Schedule: Every Tuesday 2:00 AM (when security monitoring is minimal)
Tools: Custom-built NullSender, NullBrowser, and Null protocol

You found me. Game over.

- The Null (Dr. Marcus Cipher)
  Former Security Consultant, Current Digital Ghost"

File Properties:
- Created: 2024-08-05 02:30:12 (final attack)  
- Hidden: Yes (requires ls -la or show hidden files)
- Encrypted: Base64 (basic encoding for training purposes)
- Digital Signature: Verified authentic message from attacker

Evidence Analysis:
- Confirms attacker identity: Dr. Marcus Cipher
- Reveals motive: Revenge for contract termination
- Shows methodical planning and intentional discovery
- Demonstrates advanced cybersecurity knowledge
- Provides complete case closure evidence

Final Case Status: SOLVED
Perpetrator: Dr. Marcus Cipher (The Null)
Evidence Quality: Complete digital forensics chain established`,

    'case_summary.txt': `=== Level 5 Investigation Case Summary ===
Case: The Hunt for The Null
Lead Investigator: Cybersecurity Trainee
Date: 2024-08-05

CASE OVERVIEW:
A sophisticated cyberthreat actor known as "The Null" has conducted a series of coordinated attacks across multiple systems. Through digital forensics analysis, we must piece together evidence from previous security incidents to identify the perpetrator.

EVIDENCE COLLECTED:
□ bot_logs.txt - Bot network deployment evidence
□ email_headers.txt - Phishing campaign analysis  
□ malware_code.txt - Malware source code review
□ login_logs.txt - Unauthorized access logs
□ hidden_message.txt - Final confession message

KEY PATTERNS IDENTIFIED:
- Consistent IP address: 192.168.1.100
- Attack timing: Tuesday 2:00 AM EST  
- Signature: "N4LL" in various forms
- Professional toolkit usage
- Internal network origin (insider threat)

INVESTIGATION OBJECTIVES:
1. Collect all available evidence files
2. Identify common patterns across incidents
3. Correlate attack methods and signatures
4. Determine attacker identity and motive
5. Build complete forensics timeline

SUCCESS CRITERIA:
- Find 4+ evidence files (80% minimum)
- Identify IP address pattern (192.168.1.100)
- Recognize attacker signature (N4LL)
- Determine identity: Dr. Marcus Cipher

This case tests fundamental digital forensics skills including evidence collection, pattern recognition, timeline reconstruction, and critical analysis.`,

    'timeline.txt': `=== Attack Timeline Reconstruction ===
Investigation: The Hunt for The Null

CHRONOLOGICAL ORDER OF ATTACKS:

Week 1 - Level 1 Incident:
Date: 2024-08-01 02:00:15
Event: Bot network deployment
Source: 192.168.1.100
Method: Misinformation campaign
Evidence: bot_logs.txt
Signature: "Null protocol v1.0" in code

Week 2 - Level 2 Incident:  
Date: 2024-08-02 02:00:32
Event: Phishing campaign launch
Source: 192.168.1.100  
Method: Email spoofing with NullSender
Evidence: email_headers.txt
Signature: "N4LL_W4S_H3R3" in headers

Week 3 - Level 3 Incident:
Date: 2024-08-03 02:15:45
Event: Malware distribution
Source: 192.168.1.100
Method: Fake software update
Evidence: malware_code.txt  
Signature: "N4LL was here" in source code

Week 4 - Level 4 Incident:
Date: 2024-08-04 02:00:15  
Event: Vulnerability exploitation
Source: 192.168.1.100
Method: Credential brute force + privilege escalation
Evidence: login_logs.txt
Signature: "N4LL_0WN5_Y0U" in headers

Week 5 - Investigation Complete:
Date: 2024-08-05 02:30:12
Event: Final message discovered
Source: 192.168.1.100
Method: Hidden confession file
Evidence: hidden_message.txt
Result: Identity revealed - Dr. Marcus Cipher

PATTERN ANALYSIS:
- Attack window: Tuesday 2:00 AM (minimal monitoring)
- Source consistency: Same IP across all incidents  
- Escalation: Each attack more sophisticated than previous
- Signature evolution: N4LL variations throughout
- Tool development: Custom hacking toolkit creation

CONCLUSION:
Timeline confirms systematic campaign by single threat actor operating from internal network position with increasing sophistication and clear revenge motivation.`
};
