import { HykordIpcEvents } from '@hypes';
import { ipcMain } from 'electron';
import SettingManager from '../api/SettingsManager';

// Get setting
// Asynchronous is better, but synchronous is fine too
// If you can, use asynchronous instead of synchronous

ipcMain.handle(HykordIpcEvents.GET_SETTING, (_, settingName, defaultValue) => {
  return SettingManager.getSetting(settingName, defaultValue);
});

ipcMain.on(HykordIpcEvents.GET_SETTING_SYNC, (e, settingName, defaultValue) => {
  e.returnValue = SettingManager.getSetting(settingName, defaultValue);
});

// Set setting
ipcMain.handle(HykordIpcEvents.SET_SETTING, async (_, settingName, value) => {
  SettingManager.setSetting(settingName, value);
  await SettingManager.save();
  return value;
});

/**
 * Doesn't save the settings, just adds to the cache
 *
 * @deprecated Use SET_SETTING instead
 */
ipcMain.on(HykordIpcEvents.SET_SETTING_SYNC, (e, settingName, value) => {
  SettingManager.setSetting(settingName, value);
  e.returnValue = value;
});

// ADD VALUE TO SETTING
// USED FOR ARRAY

/**
 * Doesn't save the settings, just adds to the cache
 *
 * @deprecated Use ADD_VALUE_TO_SETTING instead
 */
ipcMain.on(HykordIpcEvents.ADD_VALUE_TO_SETTING_SYNC, (e, settingName, value) => {
  SettingManager.addToSetting(settingName, value);
  e.returnValue = value;
});

ipcMain.handle(HykordIpcEvents.ADD_VALUE_TO_SETTING, async (_, settingName, value) => {
  SettingManager.addToSetting(settingName, value);
  await SettingManager.save();
  return value;
});

// Save settings
ipcMain.handle(HykordIpcEvents.SAVE_SETTINGS, async () => {
  return await SettingManager.save();
});
