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

**Key Evidence Files**:
```
/evidence/level1_bot_logs.txt        (IP: 192.168.1.100 - recurring)
/evidence/level2_email_headers.txt   (X-Mailer: NullSender v1.0)
/evidence/level3_malware_sample.exe  (Code comment: "// N4LL was here")
/evidence/level4_exploit_code.py     (Function name: null_exploit())
/evidence/hidden_message.txt         (Base64: VGhlTnVsbElzSGVyZQ==)
```

### Terminal Forensics Commands (Simplified)
```bash
# Basic commands students learn
find . -name "*null*"                    # Find files with "null" in name
grep -r "N4LL" /var/log/                 # Search for signature in logs
ls -la                                   # Show hidden files and timestamps
cat suspicious_file.txt                  # Read file contents
strings malware.exe | grep password      # Extract readable text from binary
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

### Pattern Recognition Challenges
**Students Must Identify**:
1. **IP Address**: 192.168.1.100 appears in all incident logs
2. **Timing Pattern**: All attacks occur Tuesday 2:00 AM EST
3. **Signature**: "N4LL" appears in code comments and log entries
4. **Tool Preference**: Always uses "NullSender" for email attacks
5. **Cleanup Behavior**: Attempts to delete evidence after each attack

### Simple Timeline Building
**Interactive Timeline Exercise**:
```
Week 1: Level 1 Incident (Misinformation bots deployed)
Week 2: Level 2 Incident (Phishing campaign launched)  
Week 3: Level 3 Incident (Malware distributed)
Week 4: Level 4 Incident (Vulnerability exploited)
Week 5: Current Investigation (Find The Null)
```

### Basic Attribution
**Evidence Correlation Exercise**:
- Match IP addresses across different incident reports
- Connect timestamps to establish attack schedule
- Link code signatures to prove same attacker
- Identify tools used consistently across incidents

---

## 🎯 Multi-Application Workflow (MVP)

### File Manager Tasks
- **Search Function**: Find files containing "null", "N4LL", or specific IP addresses
- **Property Analysis**: Check file creation dates and modification times
- **Hidden Files**: Reveal files with names starting with "." (Unix) or hidden attribute (Windows)
- **File Recovery**: Restore deleted files from trash/recycle bin

### Terminal Activities  
- **Basic Commands**: Learn 5-6 essential forensics commands
- **Log Analysis**: Use grep to search for patterns in log files
- **File Examination**: Use strings, cat, and ls commands
- **Evidence Documentation**: Create investigation notes using echo and redirection

### System Logs Review
- **Login Analysis**: Identify unusual login patterns and failed attempts
- **Process Monitoring**: Find suspicious processes and their execution times
- **Network Activity**: Review basic network connection logs
- **Event Correlation**: Connect events across different log files

---

## 🎯 The Final Revelation (Simplified)

### Investigation Outcomes
**Based on Evidence Found (70%+ required to pass)**:

**Success (70-100% evidence)**: 
- **Identity Revealed**: The Null is actually "Alex Thompson", former IT intern
- **Motive**: Seeking revenge after being fired for poor performance
- **Method**: Using knowledge from internship to access systems
- **Resolution**: Evidence forwarded to authorities for prosecution

**Partial Success (50-69% evidence)**:
- **Pattern Identified**: Recognize attack signatures and timing
- **Prevention**: Can detect future attacks by same actor  
- **Learning**: Understand what evidence was missed

**Insufficient Evidence (<50%)**:
- **Case Review**: Detailed feedback on missed clues
- **Second Chance**: Option to re-examine evidence with hints
- **Learning Focus**: Emphasis on systematic investigation methodology

### Simple Dialogue Options
**Final Confrontation with The Null**:
1. **"We have evidence linking you to all these attacks."**
2. **"Your attack pattern made you easy to track."**  
3. **"Why did you choose to become a cybercriminal?"**

**The Null's Response** (based on evidence quality):
- **High Evidence**: "I underestimated you. How did you find me?"
- **Medium Evidence**: "You got lucky, but you can't prove everything."
- **Low Evidence**: "You have nothing concrete. This won't stick."

---

## 🏆 Assessment & Scoring (MVP)

### Core Skills Assessment
**Evidence Collection (40%)**:
- Found key files across all applications
- Identified hidden and deleted evidence
- Documented findings properly

**Pattern Recognition (30%)**:
- Connected IP addresses across incidents
- Identified timing patterns
- Recognized attacker signatures

**Tool Usage (20%)**:
- Correct use of search functions
- Basic terminal command execution
- Log analysis techniques

**Critical Thinking (10%)**:
- Logical deduction from evidence
- Proper timeline reconstruction
- Sound attribution reasoning

### Achievement Badges (Simplified)
- **"Evidence Hunter"**: Found all hidden files
- **"Pattern Master"**: Identified all behavioral patterns
- **"Timeline Expert"**: Perfect chronological reconstruction  
- **"Digital Detective"**: Successfully identified The Null
- **"Forensics Fundamentals"**: Demonstrated proper investigation methodology

---

## 🎓 Learning Objectives (MVP)

### Digital Forensics Basics
**Essential Skills**:
- **File System Navigation**: Understanding directory structures and file properties
- **Search Techniques**: Using search functions to find relevant evidence
- **Log Analysis**: Reading and interpreting system logs for security events
- **Timeline Construction**: Organizing events chronologically
- **Evidence Documentation**: Proper recording of findings

### Investigation Methodology
**Core Concepts**:
- **Systematic Approach**: Following structured investigation procedures
- **Evidence Preservation**: Understanding chain of custody basics
- **Pattern Recognition**: Identifying behavioral and technical signatures
- **Critical Thinking**: Drawing logical conclusions from evidence
- **Reporting**: Presenting findings clearly and professionally

### Technical Skills
**Practical Abilities**:
- **Command Line Basics**: Essential terminal commands for forensics
- **File Analysis**: Examining file properties and metadata
- **Log Correlation**: Connecting events across multiple sources
- **Tool Familiarity**: Using built-in system tools for investigation
- **Documentation**: Creating clear investigation reports

---

## 🎮 Implementation (MVP)

### Simple Evidence Database
```javascript
const evidenceItems = [
    {
        id: 'level1_logs',
        location: '/evidence/bot_network_logs.txt',
        type: 'log_file',
        clues: ['192.168.1.100', 'Tuesday 02:00:15'],
        points: 20
    },
    {
        id: 'level2_email',  
        location: '/evidence/phishing_headers.txt',
        type: 'email_header',
        clues: ['X-Mailer: NullSender', '192.168.1.100'],
        points: 20
    },
    // Additional evidence items...
];
```

### Basic Investigation Interface
- **Evidence List**: Simple checklist of items to find
- **Timeline View**: Drag-and-drop events into chronological order
- **Pattern Tracker**: Visual correlation of IP addresses, timestamps, signatures
- **Progress Indicator**: Percentage of evidence collected
- **Hint System**: Guided assistance when students get stuck

### Simplified Applications Integration
- **File Manager**: Enhanced search with evidence highlighting
- **Terminal**: Pre-configured commands with helpful output formatting
- **Logs**: Filtered view showing only relevant security events
- **Documentation**: Simple note-taking interface for findings

This MVP version focuses on core digital forensics concepts while maintaining an engaging investigative narrative, providing a solid foundation for future enhancements.

---

## 🎯 Success Criteria & Final Assessment

### Level Completion Requirements
**Minimum Standards**:
- Collect at least 70% of available evidence
- Correctly identify 5+ attack techniques used by The Null
- Successfully correlate evidence across minimum 3 different attack vectors
- Demonstrate proper forensics methodology and documentation
- Present coherent theory of The Null's identity and motivation

### Mastery Indicators
**Excellence Markers**:
- 95%+ evidence collection rate
- Perfect timeline reconstruction
- Successful prediction of The Null's next move
- Innovative investigation techniques
- Flawless chain of custody maintenance

### Capstone Portfolio Project
**Professional Documentation Package**:
1. **Executive Summary**: High-level case overview for management
2. **Technical Report**: Detailed forensics findings and methodology
3. **Legal Brief**: Court-admissible evidence documentation
4. **Threat Intelligence**: IOCs and defensive recommendations
5. **Lessons Learned**: Process improvements and future preparation

### Industry Recognition Simulation
**Realistic Career Outcomes**:
- **Job Offer**: Invitation to join federal cyber investigation unit
- **Conference Speaking**: Opportunity to present case study at cybersecurity conference
- **Media Recognition**: News interview about successful investigation
- **Academic Publication**: Co-author research paper on digital forensics techniques
- **Certification Credit**: CEH, GCFA, or CISSP continuing education units

This comprehensive Level 5 design creates the ultimate cybersecurity education experience, combining advanced technical skills with critical thinking, legal considerations, and professional development to prepare students for real-world digital forensics and cybersecurity investigation careers.