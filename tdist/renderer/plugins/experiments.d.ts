import { Plugin } from '@hykord/structures';
export declare class Experiments extends Plugin {
    unpatch: any;
    name: string;
    author: string;
    version: string;
    description: string;
    $internal: boolean;
    start(): void;
    fullStart(): Promise<void>;
    stop(): void;
    private getCurrentUser;
    private getDispatcher;
    private getConnectionOpen;
}
