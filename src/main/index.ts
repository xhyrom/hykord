import { dirname, join } from 'path';
import electron from 'electron';
import BrowserWindow from './patches/BrowserWindow';
import { Logger } from '@common';
import './ipc';

Logger.info('Patching...');

const electronPath = require.resolve('electron');
const discordPath = join(dirname(require.main!.filename), '..', 'app.asar');
//const discordPackage = require(join(discordPath, 'package.json'));
//const discordMain = join(discordPath, discordPackage.main);
//require.main!.filename = discordMain;

process.env.DISCORD_APP_PATH = discordPath;

// Replace browserwindow
BrowserWindow(electronPath);

// Patch settings
Object.defineProperty(global, 'appSettings', {
  set: (settings: typeof global.appSettings) => {
    settings.set('DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING', true);

    // @ts-ignore ????
    delete global.appSettings;
    global.appSettings = settings;
  },
  configurable: true,
});

electron.app.whenReady().then(() => {
  electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders, url }, cb) => {
    if (responseHeaders) {
        delete responseHeaders["content-security-policy-report-only"];
        delete responseHeaders["content-security-policy"];

        // Fix hosts that don't properly set the content type, such as
        // raw.githubusercontent.com
        if (url.endsWith(".css"))
            responseHeaders["content-type"] = ["text/css"];
    }
    cb({ cancel: false, responseHeaders });
  });
})

//require('module')._load(discordMain);