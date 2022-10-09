import { Plugin } from '@hykord/structures';
export declare class MessageAPI extends Plugin {
    unpatchSendMessage: any;
    unpatchEditMessage: any;
    unpatchReceiveMessage: any;
    name: string;
    author: string;
    version: string;
    description: string;
    settings: {
        type: string;
        name: string;
        description: string;
        defaultValue: boolean;
    }[];
    $internal: boolean;
    start(): void;
    fullStart(): Promise<void>;
    stop(): void;
    private getMessages;
}
