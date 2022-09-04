import electron from 'electron';
import path from 'path';

class BrowserWindow extends electron.BrowserWindow {
  constructor(options) {
    if (
      !options ||
      !options.webPreferences ||
      !options.webPreferences.preload ||
      !options.title
    ) {
      // @ts-expect-error It works so???
      return super(options);
    }

    const originalPreload = options.webPreferences.preload;
    options.webPreferences.preload = path.join(__dirname, 'preload.js');

    super(options);

    // @ts-expect-error Inject _Hykord_discordPreload for ipc
    this.webContents._Hykord_discordPreload = originalPreload;
  }
}

Object.assign(BrowserWindow, electron.BrowserWindow);

export const patchBrowserWindow = () => {
  const electronPath = require.resolve('electron');
  delete require.cache[electronPath].exports;
  require.cache[electronPath].exports = { ...electron, BrowserWindow };
};

export default {
  patchBrowserWindow,
};
