import Logger from '@hykord/logger';
import { ipcRenderer } from 'electron';

let platform: 'powercord' | 'betterdiscord' = null;
// @ts-expect-error It exist
if (!ipcRenderer || global.__hykord__platform__loader) {
    Logger.warn('__hykord__platform__loader is defined, probably loading from other client mod (i.e powercord/bd)');
    // @ts-expect-error Test for powercord
    platform = global.__hykord__platform__loader;
}

export class IPCRenderer {
    static async loadExtension(path: string) {
        if (platform) return Logger.err(`loadExtension is not supported with ${platform}`);
        return await ipcRenderer.invoke('HYKORD_LOAD_EXTENSION', path);
    }

    static removeExtension(path: string) {
        if (platform) return Logger.err(`removeExtension is not supported with ${platform}`);
        return ipcRenderer.invoke('HYKORD_REMOVE_EXTENSION', path);
    }

    static relaunchApp() {
        if (platform) {
            switch(platform) {
                case 'powercord': {
                    // @ts-expect-error It exist
                    return DiscordNative.app.relaunch();
                }
                default:
                    return Logger.err(`loadExtension is not supported with ${platform}`);
            }
        }

        ipcRenderer.send('HYKORD_RELAUNCH_APP');
    }
}
