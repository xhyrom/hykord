declare global {
    export var HykordNative: typeof import('./preload/api/HykordNative').default;
    export var Hykord: typeof import('./renderer/index');
    export var appSettings: {
        set(setting: string, v: any): void;
    };

    interface Window {
        webpackChunkdiscord_app: {
            push(chunk: any): any;
            pop(): any;
        };
        [k: PropertyKey]: any;
        require<T>(mod: string): T;
    }
}

export enum HykordIpcEvents {
    'GET_SETTING_SYNC' = 'HYKORD_GET_SETTING_SYNC',
    'GET_SETTING' = 'HYKORD_GET_SETTING',
    'SET_SETTING_SYNC' = 'HYKORD_SET_SETTING_SYNC',
    'SET_SETTING' = 'HYKORD_SET_SETTING',
    'SAVE_SETTINGS' = 'HYKORD_SAVE_SETTINGS',
}

export type Exports = Record<string, unknown> | ((...args: unknown[]) => unknown) | string;
export type RawModule = Record<string, unknown> & {
    id: number;
    loaded: boolean;
    exports: Exports
};

export {};