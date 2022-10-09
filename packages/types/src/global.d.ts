declare var HykordNative: {
    getDirectory: () => string;
    getManagers: () => {
        getSettings: () => {
            getSync: <T>(name: string, defaultValue?: T | undefined) => T;
            get: <T_1>(name: string, defaultValue?: T_1 | undefined) => Promise<T_1>;
            /**
             * Doesn't save the settings, just adds to the cache
             *
             * @deprecated Use SET_SETTING instead
             */
            setSync: (name: string, value: any) => any;
            set: (name: string, value: any) => Promise<any>;
            delete: (name: string) => any;
            addValueSync: (name: string, value: any) => any;
            addValue: (name: string, value: any) => Promise<any>;
            removeValueSync: (name: string, value: any) => Promise<any>;
            removeValue: (name: string, value: any) => Promise<any>;
            save: () => Promise<any>;
        };
        getGit: () => {
            getRepository: () => Promise<any>;
            getLatestCommitHash: () => Promise<any>;
            checkForUpdates: () => Promise<any>;
            downloadUpdate: () => Promise<any>;
        };
    };
    getDirname: () => string;
    getVersions: () => Record<string, string>;
    getPolyfillRemote: () => any;
    relaunchApp: () => void;
    require: (mod: string) => any;
}

declare var Hykord: {
    version: string;
    gitHash: string;
    directory: string;
    Webpack: typeof import('@hykord/webpack')
    Structures: typeof import('@hykord/structures')
    Apis: typeof import('@hykord/apis')
}