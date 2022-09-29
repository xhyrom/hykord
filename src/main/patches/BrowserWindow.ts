import electron, { BrowserWindowConstructorOptions } from 'electron';
import { join } from 'path';

class BrowserWindow extends electron.BrowserWindow {
    constructor(options: BrowserWindowConstructorOptions) {
      if (options.webPreferences?.preload && options.title) {
        const originalPreload = options.webPreferences.preload;
  
        options.webPreferences.preload = join(__dirname, 'preload.js');
  
        process.env.ORIGINAL_DISCORD_PRELOAD_FOR_HYKORD = originalPreload;
      }
  
      super(options);
    }
}

// Patch browser window
export default (electronPath: string) => {
    Object.assign(BrowserWindow, electron.BrowserWindow);
    Object.defineProperty(BrowserWindow, 'name', { value: 'BrowserWindow', configurable: true });

    delete require.cache[electronPath]!.exports;
    require.cache[electronPath]!.exports = {
        ...electron,
        BrowserWindow
    };
}