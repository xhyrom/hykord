import { HykordIpcEvents } from '@common';
import { app, ipcMain, desktopCapturer } from 'electron';

import './settings';
import './updater';

// Custom event because DiscordNative.app.relaunch will throw exception
ipcMain.on(HykordIpcEvents.RELAUNCH_APP, () => {
  app.quit();
  app.relaunch();
});

ipcMain.handle(HykordIpcEvents.DESKTOP_CAPTURER_GET_SOURCES, (_, opts) => desktopCapturer.getSources(opts));
