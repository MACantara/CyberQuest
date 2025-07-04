export class ProcessEventHandler {
    constructor(app, dataManager, sorter, renderer) {
        this.app = app;
        this.dataManager = dataManager;
        this.sorter = sorter;
        this.renderer = renderer;
        this.refreshInterval = null;
    }

    bindEvents(windowElement) {
        if (!windowElement) return;

        // Refresh button
        const refreshBtn = windowElement.querySelector('#refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.handleRefresh();
            });
        }

        // Toggle real-time button
        const toggleBtn = windowElement.querySelector('#toggle-realtime-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.handleToggleRealTime();
            });
        }

        // Kill process button
        const killBtn = windowElement.querySelector('#kill-process-btn');
        if (killBtn) {
            killBtn.addEventListener('click', () => {
                this.handleKillProcess();
            });
        }

        // Sortable headers
        const sortableHeaders = windowElement.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                this.handleSort(column);
            });
        });

        this.bindProcessRowEvents(windowElement);
    }

    bindProcessRowEvents(windowElement) {
        if (!windowElement) return;

        const processRows = windowElement.querySelectorAll('.process-row');
        processRows.forEach(row => {
            row.addEventListener('click', () => {
                const pid = parseInt(row.getAttribute('data-pid'));
                this.handleSelectProcess(pid);
            });
        });
    }

    handleRefresh() {
        this.dataManager.refreshProcessData();
        this.app.updateContent();
        
        // Emit refresh activity
        if (this.app.activityEmitter) {
            this.app.activityEmitter.emitProcessRefresh(this.dataManager.getProcessCount());
        }
    }

    handleToggleRealTime() {
        this.app.isRealTime = !this.app.isRealTime;
        
        if (this.app.isRealTime) {
            this.startRealTimeUpdates();
        } else {
            this.stopRealTimeUpdates();
        }
        
        // Emit real-time toggle activity
        if (this.app.activityEmitter) {
            this.app.activityEmitter.emitRealTimeToggle(this.app.isRealTime);
        }
        
        this.app.updateContent();
    }

    handleSort(column) {
        this.sorter.setSortColumn(column);
        this.sorter.sortProcesses(this.dataManager.getProcesses());
        
        // Emit sort activity
        if (this.app.activityEmitter) {
            this.app.activityEmitter.emitProcessSorted(
                this.sorter.getSortColumn(), 
                this.sorter.getSortDirection()
            );
        }
        
        this.app.updateContent();
    }

    handleSelectProcess(pid) {
        this.app.selectedProcess = this.dataManager.getProcessByPid(pid);
        
        // Emit process selection activity
        if (this.app.activityEmitter && this.app.selectedProcess) {
            this.app.activityEmitter.emitProcessSelected(this.app.selectedProcess);
        }
        
        this.app.updateContent();
        
        const detailsPanel = this.app.windowElement?.querySelector('#process-details');
        const detailsContent = this.app.windowElement?.querySelector('#process-details-content');
        const killBtn = this.app.windowElement?.querySelector('#kill-process-btn');
        
        if (detailsPanel && detailsContent) {
            detailsPanel.classList.remove('hidden');
            detailsContent.innerHTML = this.renderer.renderProcessDetails(this.app.selectedProcess);
        }
        
        if (killBtn) {
            killBtn.disabled = false;
        }
    }

    handleKillProcess() {
        if (!this.app.selectedProcess) return;

        // Show confirmation
        const confirmed = confirm(`Are you sure you want to end process "${this.app.selectedProcess.name}" (PID: ${this.app.selectedProcess.pid})?`);
        if (!confirmed) return;

        // Emit termination activity before removing
        if (this.app.activityEmitter) {
            this.app.activityEmitter.emitProcessTerminated(this.app.selectedProcess, 'user');
        }

        // Remove process from data manager
        this.dataManager.removeProcess(this.app.selectedProcess.pid);
        this.app.selectedProcess = null;
        
        // Hide details panel
        const detailsPanel = this.app.windowElement?.querySelector('#process-details');
        if (detailsPanel) {
            detailsPanel.classList.add('hidden');
        }
        
        this.app.updateContent();
        
        // Show success message
        this.app.showNotification('Process terminated successfully', 'success');
    }

    startRealTimeUpdates() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            if (this.app.isRealTime) {
                this.dataManager.refreshProcessData();
                this.sorter.sortProcesses(this.dataManager.getProcesses());
                this.app.updateContent();
            }
        }, 3000); // Update every 3 seconds
    }

    stopRealTimeUpdates() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    cleanup() {
        this.stopRealTimeUpdates();
    }
}
