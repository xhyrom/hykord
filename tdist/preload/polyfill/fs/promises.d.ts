export * from 'fs/promises';
export declare const exists: (path: string) => Promise<boolean>;
export declare const readAndIfNotExistsCreate: (path: string, fallback?: string) => Promise<string>;
export declare const mkdirIfNotExists: (base: string, ...paths: string[]) => Promise<void>;
