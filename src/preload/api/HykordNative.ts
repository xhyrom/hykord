import * as polyfill from '../polyfill';
import { join } from 'path';
import { ipcRenderer } from 'electron';
import { HykordIpcEvents, KnownSettings } from '@hypes';
import { PreloadLogger as Logger } from '@common';

const getDirectory = () =>
  join(`${process.env.HOME || process.env.USERPROFILE}`, '.hykord');

export default {
  getDirectory: getDirectory,
  getManagers: () => ({
    getSettings: () => ({
      getSync: <T>(name: KnownSettings, defaultValue?: T): T =>
        ipcRenderer.sendSync(
          HykordIpcEvents.GET_SETTING_SYNC,
          name,
          defaultValue
        ),
      get: <T>(name: KnownSettings, defaultValue?: T): Promise<T> =>
        ipcRenderer.invoke(HykordIpcEvents.GET_SETTING, name, defaultValue),
      /**
       * Doesn't save the settings, just adds to the cache
       *
       * @deprecated Use SET_SETTING instead
       */
      setSync: (name: KnownSettings, value: any) =>
        ipcRenderer.sendSync(HykordIpcEvents.SET_SETTING_SYNC, name, value),
      set: (name: KnownSettings, value: any) =>
        ipcRenderer.invoke(HykordIpcEvents.SET_SETTING, name, value),
      delete: (name: KnownSettings) =>
        ipcRenderer.sendSync(HykordIpcEvents.DELETE_SETTING, name),
      addValueSync: (name: KnownSettings, value: any) =>
        ipcRenderer.sendSync(HykordIpcEvents.ADD_VALUE_TO_SETTING_SYNC, name, value),
      addValue: (name: KnownSettings, value: any) =>
        ipcRenderer.invoke(HykordIpcEvents.ADD_VALUE_TO_SETTING, name, value),
      removeValueSync: (name: KnownSettings, value: any) =>
        ipcRenderer.invoke(HykordIpcEvents.REMOVE_VALUE_FROM_SETTING_SYNC, name, value),
      removeValue: (name: KnownSettings, value: any) =>
        ipcRenderer.invoke(HykordIpcEvents.REMOVE_VALUE_FROM_SETTING, name, value),
      save: () => ipcRenderer.invoke(HykordIpcEvents.SAVE_SETTINGS),
    }),
    getGit: () => ({
      getRepository: () => ipcRenderer.invoke(HykordIpcEvents.GET_REPOSITORY),
      getLatestCommitHash: () =>
        ipcRenderer.invoke(HykordIpcEvents.GET_LATEST_COMMIT_HASH),
      checkForUpdates: () =>
        ipcRenderer.invoke(HykordIpcEvents.CHECK_FOR_UPDATES),
      downloadUpdate: () => ipcRenderer.invoke(HykordIpcEvents.DOWNLOAD_UPDATE),
    }),
  }),
  getDirname: () => __dirname,
  getVersions: () => process.versions,
  getPolyfillRemote: () => polyfill,
  relaunchApp: () => ipcRenderer.send(HykordIpcEvents.RELAUNCH_APP),
  require: (mod: string) => {
    const allowed = ipcRenderer.sendSync(
      HykordIpcEvents.GET_SETTING_SYNC,
      'hykord.unsafe-require',
      false
    );
    if (!allowed) {
      Logger.err(`Unsafe require is disabled, cannot require ${mod}`);
      return null;
    }

    return require(mod);
  },
};
