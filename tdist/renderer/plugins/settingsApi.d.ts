import { Plugin } from '@hykord/structures';
export declare class SettingsAPI extends Plugin {
    unpatch: any;
    name: string;
    author: string;
    version: string;
    description: string;
    $toggleable: boolean;
    $internal: boolean;
    start(): void;
    fullStart(): Promise<void>;
    stop(): void;
    private getSettings;
}
