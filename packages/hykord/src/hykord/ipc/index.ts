import { ipcMain, type IpcMainInvokeEvent } from "electron";

if (!ipcMain) throw new Error('ipcMain is undefined ¯\\_(ツ)_/¯');

const openDevTools = (e: IpcMainInvokeEvent, opts) => {
    e.sender.openDevTools(opts);
}

const closeDevTools = (e: IpcMainInvokeEvent) => {
    e.sender.closeDevTools();
}

// @ts-expect-error _Hykord_discordPreload is injected in BrowserWindow
ipcMain.on('HYKORD_GET_DISCORD_PRELOAD', (e) => e.returnValue = e.sender._Hykord_discordPreload);
ipcMain.handle('HYKORD_OPEN_DEVTOOLS', openDevTools);
ipcMain.handle('HYKORD_CLOSE_DEVTOOLS', closeDevTools);
