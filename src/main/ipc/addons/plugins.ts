import { HykordIpcEvents } from '@common';
import { ipcMain } from 'electron';
import { readdir, rm } from 'fs/promises';
import { join } from 'path';
import getDirectory from '../../utils/getDirectory';
import validatePath from '../../utils/validatePath';

ipcMain.handle(HykordIpcEvents.LIST_PLUGINS, () => {
    return readdir(join(getDirectory(), 'plugins'));
});

ipcMain.handle(HykordIpcEvents.DELETE_PLUGIN, async(_, name) => {
    await rm(join(getDirectory(), 'themes', validatePath(name)));
});