import { Logger as RealLogger } from './Logger';

// Exported
export enum HykordIpcEvents {
    'GET_SETTING' = 'HYKORD_GET_SETTING',
    'SAVE_SETTINGS' = 'HYKORD_SAVE_SETTINGS',
}

export const Logger = new RealLogger('core');
export const PreloadLogger = new RealLogger('preload');
export * from './utils';