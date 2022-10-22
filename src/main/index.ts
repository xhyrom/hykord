import { dirname, join } from 'path';
import electron from 'electron';
import BrowserWindow from './patches/BrowserWindow';
import { CoreLogger as Logger } from '@common';
import SettingsManager from './api/SettingsManager';
import getDirectory from './utils/getDirectory';

Logger.info('Patching...');

const electronPath = require.resolve('electron');
const discordPath = join(dirname(require.main!.filename), '..', 'app.asar');
const dotHykordPath = getDirectory();

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

electron.app.whenReady().then(async () => {
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

  electron.protocol.registerFileProtocol('hykord', (request, cb) => {
    const reqUrl = new URL(request.url);
    switch (reqUrl.hostname) {
      case 'plugin':
        cb(join(dotHykordPath, 'plugins', reqUrl.pathname));
        break;
    }
  });

  if (SettingsManager.getSetting('hykord.react-devtools', false)) {
    Logger.info('Installing React Developer Tools...');

    try {
      const electronDevToolsInstaller = await await import(
        'electron-devtools-installer'
      );
      electronDevToolsInstaller
        // @ts-expect-error heh
        .default.default(electronDevToolsInstaller.REACT_DEVELOPER_TOOLS)
        .then((name: string) => Logger.info(`Added Extension:  ${name}`))
        .catch((err: any) =>
          Logger.err(
            'An error occurred while installing React Dev Tools: ',
            err,
          ),
        );
    } catch (e) {
      Logger.err('Failed to install React Developer Tools: ' + e);
    }
  }

  if (SettingsManager.getSetting('hykord.disable-tracking', false)) {
    electron.session.defaultSession.webRequest.onBeforeRequest(
      { urls: ['https://*/api/v*/science'] },
      (_, callback) => callback({ cancel: true }),
    );
  }
});

require('./ipc');
