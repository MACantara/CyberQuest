# Level 5: The Hunt for The Null - MVP Design Document

## Overview
**Scenario**: Digital Forensics Investigation  
**Story Event**: Track down the elusive hacker "The Null" using digital forensics to piece together evidence from previous cyber incidents.  
**Goal**: Learn basic digital forensics, evidence collection, and investigation techniques to solve a cybersecurity mystery.

---

## 🕵️ The Investigation Story

### The Null's Background
**Previous Level Connections**:
- **Level 1**: Bot network IP addresses found in misinformation campaign
- **Level 2**: Phishing email headers contain unique sender signatures  
- **Level 3**: Malware samples have identical code patterns
- **Level 4**: Vulnerability exploitation shows consistent techniques

**The Null's Profile**:
- **Primary Alias**: The Null (uses "N4LL" in code comments)
- **Signature**: Leaves Base64 encoded messages as calling cards
- **Pattern**: Attacks every Tuesday at 2:00 AM EST
- **Goal**: Student must connect evidence across all previous incidents

### Investigation Phases (MVP)
1. **Evidence Collection** - Find files, logs, and artifacts
2. **Pattern Recognition** - Identify The Null's behavioral patterns  
3. **Timeline Building** - Arrange events in chronological order
4. **Final Analysis** - Present findings and expose The Null's identity

---

## 🔍 Core Forensics Activities (MVP)

### File Manager Investigation
**Evidence Discovery Tasks**:
- **Hidden Files**: Find files with "null" in the name using search
- **Deleted Files**: Recover files from "Recycle Bin" or "Trash"
- **File Analysis**: Examine file properties (creation date, size, type)
- **Directory Patterns**: Notice The Null organizes files in specific folder structures

**Key Evidence Files (Only 5 Files)**:
```
/evidence/bot_logs.txt           (Contains: IP 192.168.1.100)
/evidence/email_headers.txt      (Contains: X-Mailer: NullSender)
/evidence/malware_code.txt       (Contains: // N4LL was here)
/evidence/login_logs.txt         (Contains: Failed login from 192.168.1.100)
/evidence/hidden_message.txt     (Contains: Base64 message)
```

### Terminal Forensics Commands (3 Basic Commands)
```bash
# Only 3 commands students need to learn
find . -name "*null*"         # Find files with "null" in name
grep "N4LL" *.txt             # Search for signature in text files
cat evidence_file.txt         # Read file contents
```

### System Logs Analysis
**Log Investigation Tasks**:
- **Login Patterns**: Find repeated login attempts from same IP
- **Timestamp Correlation**: Notice all attacks happen at 2:00 AM Tuesday
- **Failed Attempts**: Identify unsuccessful login attempts before successful ones
- **Process Analysis**: Find processes with suspicious names

**Sample Log Entries**:
```
2024-08-05 02:00:15 - Failed login: user "admin" from 192.168.1.100
2024-08-05 02:00:32 - Successful login: user "admin" from 192.168.1.100  
2024-08-05 02:15:45 - Process started: "definitely_not_malware.exe"
2024-08-05 02:30:12 - File deleted: "/tmp/evidence_cleanup.sh"
```

---

## 🧩 Evidence Correlation (MVP)

### Pattern Recognition Challenges (3 Simple Patterns)
**Students Must Find**:
1. **Same IP Address**: 192.168.1.100 appears in multiple files
2. **Signature**: "N4LL" appears in code and logs
3. **Email Tool**: "NullSender" used for phishing attacks

### Simple Timeline Building
**Student Task**: Put these 3 events in order
```
1. Bot network deployed (find in bot_logs.txt)
2. Phishing emails sent (find in email_headers.txt)  
3. Malware installed (find in malware_code.txt)
```

### Basic Attribution
**Simple Evidence Matching**:
- Find the same IP address in 3 different files
- Find "N4LL" signature in 2 different files
- Connect "NullSender" to phishing attack

---

## 🎯 Multi-Application Workflow (MVP)

### File Manager (Main Activity)
- **Search for Files**: Look for files with "null" or "N4LL" in name
- **Open Files**: Double-click to read file contents
- **Check Properties**: Right-click to see file details

### Terminal (3 Commands Only)  
- **find**: Search for files by name
- **grep**: Search inside files for text
- **cat**: Display file contents

### System Logs (Simple Review)
- **Login Logs**: Look for failed login attempts
- **Process Logs**: Find suspicious program names

---

## 🎯 The Final Revelation (Simplified)

### Investigation Outcomes
**Based on Evidence Found (70%+ required to pass)**:

**Success (Find 4+ pieces of evidence)**: 
- **Identity Revealed**: The Null is "Dr. Clarice 'Cipher' Kim" / O2ymandi4s
- **Case Closed**: Student successfully uncovered the conspiracy

**Partial Success (Find 2-3 pieces of evidence)**:
- **Some Clues Found**: Student found some patterns
- **Hint Given**: Show them what they missed

**Need More Evidence (Find 0-1 pieces)**:
- **Try Again**: Give specific hints about where to look
- **Tutorial Mode**: Show step-by-step how to find evidence

### Simple Dialogue Options
**Final Confrontation**:
1. **"I found your IP address in all the logs."**
2. **"Your signature 'N4LL' gave you away."**  

**The Null's Response**:
- **Found Everything**: "So you've uncovered the truth about O2ymandi4s..."
- **Found Some Things**: "You got lucky this time, but The Null's vision lives on."

---

## 🏆 Assessment & Scoring (MVP)

### Simple Scoring
**Evidence Found**:
- Find 5 evidence files = 100% (Perfect!)
- Find 4 evidence files = 80% (Great job!)
- Find 3 evidence files = 60% (Good work!)
- Find 2 evidence files = 40% (Try again!)

### Achievement Badges (3 Only)
- **"Evidence Hunter"**: Found all 5 evidence files
- **"Pattern Detective"**: Connected the IP address pattern
- **"Case Solver"**: Successfully identified The Null

---

## 🎓 Learning Objectives (MVP)

### Core Skills (Keep It Simple)
**Students Will Learn**:
- **Find Files**: Use search to locate evidence files
- **Read Logs**: Understand basic log entries and timestamps
- **Spot Patterns**: Notice when same IP/signature appears multiple times
- **Use Terminal**: Run 3-4 basic commands (find, grep, cat, ls)
- **Take Notes**: Document what they find

---

## 🎮 Implementation (MVP)

### Evidence Files (5 Simple Text Files)
```javascript
const evidenceFiles = [
    {
        name: 'bot_logs.txt',
        content: 'Bot network from IP: 192.168.1.100',
        location: '/evidence/'
    },
    {
        name: 'email_headers.txt', 
        content: 'X-Mailer: NullSender\nFrom IP: 192.168.1.100',
        location: '/evidence/'
    },
    {
        name: 'malware_code.txt',
        content: 'function hack() {\n  // N4LL was here\n}',
        location: '/evidence/'
    },
    {
        name: 'login_logs.txt',
        content: 'Failed login from 192.168.1.100',
        location: '/evidence/'
    },
    {
        name: 'hidden_message.txt',
        content: 'Base64: VGhlTnVsbElzSGVyZQ==', // "TheNullIsHere"
        location: '/evidence/.hidden/'
    }
];
```

### Simple Interface
- **Evidence Checklist**: 5 checkboxes for found evidence
- **Progress Bar**: Shows completion percentage
- **Hint Button**: Gives clues when student is stuck
- **Solution**: Reveals The Null's identity when enough evidence found

This ultra-simplified MVP version focuses on the absolute core: finding 5 evidence files to solve a mystery. Perfect foundation for building upon.

---

## 🎯 Success Criteria (MVP)

### Level Completion (Simple)
**To Pass Level 5**:
- Find at least 4 out of 5 evidence files
- Identify that "192.168.1.100" appears in multiple files
- Recognize "N4LL" as The Null's signature
- Successfully name the attacker as "Dr. Clarice 'Cipher' Kim" / O2ymandi4s (Academy Instructor)

### For Excellence
- Find all 5 evidence files
- Use all 3 terminal commands successfully
- Complete investigation in under 10 minutes

This is the perfect MVP foundation - simple, focused, and achievable while still teaching core digital forensics concepts.