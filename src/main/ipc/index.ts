import { HykordIpcEvents } from '@hypes';
import { app, ipcMain } from 'electron';

import './settings';

// Custom event because DiscordNative.app.relaunch will throw exception
ipcMain.on(HykordIpcEvents.RELAUNCH_APP, () => {
    app.quit();
    app.relaunch();
})