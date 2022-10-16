import electron, { contextBridge, ipcRenderer, webFrame } from 'electron';
import { readFileSync } from 'fs';
import { join } from 'path';
import HykordNative from './api/HykordNative';
import { HykordIpcEvents, PreloadLogger as Logger } from '@common';

// Patch electron 17+
// see discord_desktop_core/app/discord_native/renderer/desktopCapture.js
if (typeof electron.desktopCapturer === 'undefined') {
  const electronPath = require.resolve('electron');

  delete require.cache[electronPath]!.exports;
  require.cache[electronPath]!.exports = {
    ...electron,
    desktopCapturer: {
      getSources: (opts: any) =>
        ipcRenderer.invoke(HykordIpcEvents.DESKTOP_CAPTURER_GET_SOURCES, opts),
    },
  };
}

// Add HykordNative
Logger.info('Exposing HykordNative');
contextBridge.exposeInMainWorld('HykordNative', HykordNative);

Logger.info('Executing renderer');
webFrame.executeJavaScript(
  readFileSync(join(__dirname, 'renderer.js'), 'utf-8'),
);

const preload = process.env.ORIGINAL_DISCORD_PRELOAD_FOR_HYKORD;
if (preload) {
  Logger.info('Loading original preload');
  require(preload);
}
