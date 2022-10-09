import * as polyfill from '../polyfill';
import { KnownSettings } from '@common';
declare const _default: {
    getDirectory: () => string;
    getManagers: () => {
        getSettings: () => {
            getSync: <T>(name: KnownSettings, defaultValue?: T | undefined) => T;
            get: <T_1>(name: KnownSettings, defaultValue?: T_1 | undefined) => Promise<T_1>;
            /**
             * Doesn't save the settings, just adds to the cache
             *
             * @deprecated Use SET_SETTING instead
             */
            setSync: (name: KnownSettings, value: any) => any;
            set: (name: KnownSettings, value: any) => Promise<any>;
            delete: (name: KnownSettings) => any;
            addValueSync: (name: KnownSettings, value: any) => any;
            addValue: (name: KnownSettings, value: any) => Promise<any>;
            removeValueSync: (name: KnownSettings, value: any) => Promise<any>;
            removeValue: (name: KnownSettings, value: any) => Promise<any>;
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
    getVersions: () => NodeJS.ProcessVersions;
    getPolyfillRemote: () => typeof polyfill;
    relaunchApp: () => void;
    require: (mod: string) => any;
};
export default _default;
