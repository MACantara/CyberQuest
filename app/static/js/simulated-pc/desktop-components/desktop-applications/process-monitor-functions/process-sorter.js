export class ProcessSorter {
    constructor() {
        this.sortColumn = 'name';
        this.sortDirection = 'asc';
    }

    sortProcesses(processes) {
        return processes.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];

            // Handle different data types appropriately
            if (this.sortColumn === 'cpu' || this.sortColumn === 'memory' || this.sortColumn === 'threads' || this.sortColumn === 'pid') {
                // Numeric columns - convert to numbers for proper sorting
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            } else if (typeof aVal === 'string') {
                // String columns - convert to lowercase for case-insensitive sorting
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            // Sort direction logic
            if (this.sortDirection === 'asc') {
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            } else {
                return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            }
        });
    }

    setSortColumn(column) {
        if (this.sortColumn === column) {
            // Toggle direction if same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Set new column and default direction based on column type
            this.sortColumn = column;
            
            // For numeric columns (CPU, Memory, PID, Threads), default to descending (highest first)
            if (column === 'cpu' || column === 'memory' || column === 'threads' || column === 'pid') {
                this.sortDirection = 'desc';
            } else {
                // For text columns (Name, Status), default to ascending (alphabetical)
                this.sortDirection = 'asc';
            }
        }
    }

    getSortColumn() {
        return this.sortColumn;
    }

    getSortDirection() {
        return this.sortDirection;
    }
}
