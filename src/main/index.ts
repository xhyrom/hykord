import { dirname, join } from 'path';
import electron from 'electron';
import BrowserWindow from './patches/BrowserWindow';
import installExt, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { CoreLogger as Logger } from '@common';
import SettingsManager from './api/SettingsManager';
import { settings } from 'cluster';

Logger.info('Patching...');

const electronPath = require.resolve('electron');
const discordPath = join(dirname(require.main!.filename), '..', 'app.asar');

process.env.DISCORD_APP_PATH = discordPath;

// Replace browserwindow
BrowserWindow(electronPath);

// Patch settings
Object.defineProperty(global, 'appSettings', {
  set: (settings: typeof global.appSettings) => {
    settings!.set(
      'DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING',
      true,
    );

    delete global.appSettings;
    global.appSettings = settings;
  },
  configurable: true,
});

electron.app.whenReady().then(() => {
  electron.session.defaultSession.webRequest.onHeadersReceived(
    ({ responseHeaders, url }, cb) => {
      if (responseHeaders) {
        delete responseHeaders['content-security-policy-report-only'];
        delete responseHeaders['content-security-policy'];

        // Fix hosts that don't properly set the content type, such as
        // raw.githubusercontent.com
        if (url.endsWith('.css'))
          responseHeaders['content-type'] = ['text/css'];
      }
      cb({ cancel: false, responseHeaders });
    },
  );

  if (SettingsManager.getSetting('hykord.react-devtools', false)) {
    Logger.info('Installing React Developer Tools...');

    installExt(REACT_DEVELOPER_TOOLS)
      .then((name) => Logger.info(`Added Extension:  ${name}`))
      .catch((err) =>
        Logger.err('An error occurred while installing React Dev Tools: ', err),
      );
  }

  if (SettingsManager.getSetting('hykord.disable-science-requests', false)) {
    electron.session.defaultSession.webRequest.onBeforeRequest(
      { urls: ['https://*/api/v*/science'] },
      (_, callback) => callback({ cancel: true }),
    );
  }
});

require('./ipc');
