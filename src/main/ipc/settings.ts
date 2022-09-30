import { HykordIpcEvents } from '@common';
import { ipcMain } from 'electron';
import { join } from 'path';
import { SettingsManager } from '../api/SettingsManager';

const Settings = new SettingsManager(join(`${process.env.HOME || process.env.USERPROFILE}`, '.hykord'));

ipcMain.on(HykordIpcEvents.GET_SETTING, (_, settingName) => {
    return Settings.getSetting(settingName);
})