import { HykordIpcEvents } from '@common';
import { ipcMain } from 'electron';
import { readdir, readFile, rm } from 'fs/promises';
import { join } from 'path';
import getDirectory from '../../utils/getDirectory';
import validatePath from '../../utils/validatePath';

ipcMain.handle(HykordIpcEvents.LIST_THEMES, () => {
    return readdir(join(getDirectory(), 'themes'));
});

ipcMain.handle(HykordIpcEvents.GET_THEME, async(_, themeName) => {
    return (await readFile(join(getDirectory(), 'themes', themeName), { encoding: 'utf-8' })).toString();
});

ipcMain.handle(HykordIpcEvents.GET_QUICKCSS, async() => {
    return (await readFile(join(getDirectory(), 'quickCss.css'), { encoding: 'utf-8' })).toString();
});

ipcMain.handle(HykordIpcEvents.DELETE_THEME, async(_, name) => {
    await rm(join(getDirectory(), 'themes', validatePath(name)));
});