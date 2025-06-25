export class EmailState {
    constructor() {
        this.currentFolder = 'inbox';
        this.selectedEmailId = null;
    }

    setFolder(folderId) {
        this.currentFolder = folderId;
        this.selectedEmailId = null;
    }

    selectEmail(emailId) {
        this.selectedEmailId = emailId;
    }

    getCurrentFolder() {
        return this.currentFolder;
    }

    getSelectedEmailId() {
        return this.selectedEmailId;
    }
}
