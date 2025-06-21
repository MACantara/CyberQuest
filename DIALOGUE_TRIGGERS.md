# Dialogue Trigger Documentation

## Dialogue Flow Throughout CyberQuest Interface

### 1. **Welcome Dialogue** (`welcome-dialogue.js`)

#### **When Triggered:**
- **First Launch**: Automatically when user opens CyberQuest for the first time
- **Condition**: `!localStorage.getItem('cyberquest_welcome_dialogue_completed')`
- **Location**: Desktop initialization / Main app startup

#### **Trigger Points:**
```javascript
// In desktop initialization
if (await dialogueManager.shouldAutoStartWelcome()) {
    await dialogueManager.startWelcomeDialogue();
}
```

#### **What Happens After:**
- Sets: `cyberquest_welcome_dialogue_completed = 'true'`
- **Auto-triggers**: Initial Tutorial (`startInitialTutorial()`)
- **Character**: Agent Phoenix
- **Purpose**: Welcome new users, set context for cybersecurity training

---

### 2. **Tutorial Intro Dialogue** (`tutorial-intro-dialogue.js`)

#### **When Triggered:**
- **After Welcome**: When welcome is completed but tutorial intro hasn't been shown
- **Condition**: `welcomeDone && !tutorialIntroDone`
- **Location**: Between welcome completion and tutorial start

#### **Trigger Logic:**
```javascript
static shouldAutoStart() {
    const welcomeDone = localStorage.getItem('cyberquest_welcome_dialogue_completed');
    const tutorialIntroDone = localStorage.getItem('cyberquest_tutorial_intro_completed');
    return welcomeDone && !tutorialIntroDone;
}
```

#### **What Happens After:**
- Sets: `cyberquest_tutorial_intro_completed = 'true'`
- **Auto-triggers**: Initial Tutorial (`startInitialTutorial()`)
- **Character**: Dr. Cipher (Instructor)
- **Purpose**: Bridge between welcome and hands-on tutorials

---

### 3. **Mission Briefing Dialogue** (`mission-briefing-dialogue.js`)

#### **When Triggered:**
- **All Tutorials Complete**: After user finishes all 8 tutorials
- **Condition**: All tutorial completion flags are `true`
- **Location**: Post-tutorial completion check

#### **Trigger Conditions:**
```javascript
const allTutorialsCompleted = [
    'cyberquest_tutorial_completed',           // Initial tutorial
    'cyberquest_email_tutorial_completed',     // Email security
    'cyberquest_browser_tutorial_completed',   // Web security  
    'cyberquest_filemanager_tutorial_completed', // File security
    'cyberquest_networkmonitor_tutorial_completed', // Network analysis
    'cyberquest_securitytools_tutorial_completed',  // Security tools
    'cyberquest_systemlogs_tutorial_completed',     // Log analysis
    'cyberquest_terminal_tutorial_completed'        // Command line
].every(key => localStorage.getItem(key));
```

#### **What Happens After:**
- Sets: `cyberquest_mission_briefing_completed = 'true'`
- **Ready for**: Live mission scenarios
- **Character**: Commander Steel
- **Purpose**: Transition from training to real scenarios

---

## **Integration Flow Summary:**

### **First Time User Journey:**
1. **Desktop Loads** → Check dialogue flow
2. **Welcome Dialogue** → Introduction and context setting
3. **Tutorial Intro** → Educational bridge
4. **Initial Tutorial** → Desktop navigation training
5. **App Tutorials** → Individual application training (8 tutorials)
6. **Mission Briefing** → Ready for real scenarios
7. **Live Missions** → Actual cybersecurity challenges

### **Returning User Scenarios:**
- **Partial Progress**: Continues from where they left off
- **All Complete**: No auto-dialogues, ready for missions
- **Reset Training**: Manual restart triggers welcome again

### **Manual Triggers Available:**
- Emergency briefing for urgent scenarios
- Welcome back messages for returning users  
- Training reminders for skill refreshers
- Application-specific introductions

### **Event-Based Triggers:**
- Application opening (could trigger app-specific dialogues)
- Tutorial completion (progress acknowledgment)
- Error scenarios (help and guidance)
- Achievement milestones (celebration and next steps)

This creates a **guided, narrative-driven learning experience** that seamlessly integrates story elements with hands-on cybersecurity training!