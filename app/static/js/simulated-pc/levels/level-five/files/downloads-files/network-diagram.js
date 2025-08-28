import { BaseIndividualFile } from '../base-file.js';

export class NetworkDiagramFile extends BaseIndividualFile {
    constructor() {
        super({
            name: 'network_diagram.png',
            directoryPath: '/home/trainee/Downloads',
            size: '1.2 MB',
            modified: '2024-12-18 16:45',
            suspicious: false,
            icon: 'bi-file-image',
            color: 'text-green-400'
        });
    }

    getContent() {
        return this.createTrainingContent(
            'network_diagram.png',
            'This would be a technical diagram showing network infrastructure.\n\nDiagram Details:\n- Shows network architecture\n- Includes routers, switches, and endpoints\n- Color-coded by security zones\n- Contains IP address ranges\n\nThis is a simulated technical diagram for training purposes.',
            'technical'
        );
    }
}
