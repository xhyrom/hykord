import { Plugin } from '@hykord/structures';
export declare class Settings extends Plugin {
    unpatch: any;
    sections: {
        section: string;
        label: string;
        element: any;
    }[];
    name: string;
    author: string;
    version: string;
    description: string;
    dependsOn: string[];
    $toggleable: boolean;
    $internal: boolean;
    start(): void;
    fullStart(): Promise<void>;
    stop(): void;
    private getSettings;
}
