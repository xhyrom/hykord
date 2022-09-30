import * as polyfill from '../polyfill';
import { join } from 'path';
import { ipcRenderer } from 'electron';
import { HykordIpcEvents } from '@common';

const getDirectory = () => join(`${process.env.HOME || process.env.USERPROFILE}`, '.hykord');

export default {
    getDirectory: getDirectory,
    getManagers: () => ({
        getSettings: () => ({
            getSetting: (name: string) => ipcRenderer.emit(HykordIpcEvents.GET_SETTING, name),
        })
    }),
    getVersions: () => process.versions,
    getPolyfillRemote: () => polyfill,
}