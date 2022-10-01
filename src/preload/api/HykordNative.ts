import * as polyfill from '../polyfill';
import { join } from 'path';
import { ipcRenderer } from 'electron';
import { HykordIpcEvents } from '@types';

const getDirectory = () => join(`${process.env.HOME || process.env.USERPROFILE}`, '.hykord');

export default {
    getDirectory: getDirectory,
    getManagers: () => ({
        getSettings: () => ({
            getSync: (name: string, defaultValue?: string) => ipcRenderer.sendSync(HykordIpcEvents.GET_SETTING_SYNC, name, defaultValue),
            get: (name: string, defaultValue?: string) => ipcRenderer.invoke(HykordIpcEvents.GET_SETTING, name, defaultValue),
            /**
             * Doesn't save the settings, just adds to the cache
             * 
             * @deprecated Use SET_SETTING instead
             */
            setSync: (name: string, value: string) => ipcRenderer.sendSync(HykordIpcEvents.SET_SETTING_SYNC, name, value),
            set: (name: string, value: string) => ipcRenderer.invoke(HykordIpcEvents.SET_SETTING, name, value),
            save: () => ipcRenderer.invoke(HykordIpcEvents.SAVE_SETTINGS)
        })
    }),
    getVersions: () => process.versions,
    getPolyfillRemote: () => polyfill,
}