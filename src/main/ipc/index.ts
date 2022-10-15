import { HykordIpcEvents } from '@common';
import { app, ipcMain } from 'electron';

import './settings';
import './updater';

// Custom event because DiscordNative.app.relaunch will throw exception
ipcMain.on(HykordIpcEvents.RELAUNCH_APP, () => {
  app.quit();
  app.relaunch();
});
