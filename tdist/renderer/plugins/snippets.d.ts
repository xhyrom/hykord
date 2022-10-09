import { Plugin } from '@hykord/structures';
export declare class Snippets extends Plugin {
    monaco: any;
    editor: any;
    name: string;
    author: string;
    version: string;
    description: string;
    dependsOn: string[];
    $internal: boolean;
    start(): void;
    fullStart(): Promise<void>;
}
