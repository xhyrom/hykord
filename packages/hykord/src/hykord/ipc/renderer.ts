import { ipcRenderer } from 'electron';

if (!ipcRenderer) throw new Error('ipcRenderer is undefined ¯\\_(ツ)_/¯');

window.HykordNative = {
    loadExtension: async(path: string) => {
        return await ipcRenderer.invoke('HYKORD_LOAD_EXTENSION', path);
    },

    removeExtension: (path: string) => {
        return ipcRenderer.invoke('HYKORD_REMOVE_EXTENSION', path);
    },

    relaunchApp: () => {
        ipcRenderer.send('HYKORD_RELAUNCH_APP');
    }
}