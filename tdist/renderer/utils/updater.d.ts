export declare let changes: Record<'hash' | 'author' | 'message', string>[];
export declare const checkForUpdates: () => Promise<boolean>;
export declare const downloadUpdate: () => Promise<void>;
export declare const isOutdated: () => boolean;
