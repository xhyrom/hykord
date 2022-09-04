import '@dependency/module-alias/register';
import { ipcRenderer, webFrame } from 'electron';
import { Logger as ILogger } from '@hykord/logger';
const Logger = new ILogger('patcher');

import '../renderer/ipc/renderer';

Logger.info('Loading Hykord');

Object.defineProperty(window, 'webpackChunkdiscord_app', {
  // @ts-expect-error It works
  get: () => webFrame.top.context.window.webpackChunkdiscord_app,
});

Object.defineProperty(window, 'GLOBAL_ENV', {
  // @ts-expect-error It works
  get: () => webFrame.top.context.window.GLOBAL_ENV,
});

Object.defineProperty(window, 'DiscordSentry', {
  // @ts-expect-error It works
  get: () => webFrame.top.context.window.DiscordSentry,
});

Object.defineProperty(window, '__SENTRY__', {
  // @ts-expect-error It works
  get: () => webFrame.top.context.window.__SENTRY__,
});

Object.defineProperty(window, '_', {
  // @ts-expect-error It works
  get: () => webFrame.top.context.window._,
});

Object.defineProperty(window, 'platform', {
  // @ts-expect-error It works
  get: () => webFrame.top.context.window.platform,
});

/**
 * This is only for Electron Content Isolation, not plugins - plugins can access every module
 * We want to avoid "malware" scripts
 */
const WhitelistedModules = [
  '@hykord/components',
  '@hykord/logger',
  '@hykord/patcher',
  '@hykord/structures',
  '@hykord/utilities',
  '@hykord/webpack',
];

Object.defineProperty(window, 'require', {
  get: () => (moduleName: string) => {
    if (
      WhitelistedModules.includes(moduleName) ||
      window.hykord?.settings?.getSetting(
        'hykord.bypass_security_check_require',
        false,
      )
    )
      return require(moduleName);

    Logger.err(
      `Module "${moduleName}" is not whitelisted. If you want to bypass this check, enable Hykord Bypass Security Check Require in settings.`,
    );
  },
});

const hykord = new (require('../renderer/index').Hykord)();
Object.defineProperty(window, 'hykord', {
  get: () => hykord,
});

const preload = ipcRenderer.sendSync('HYKORD_GET_DISCORD_PRELOAD');
if (preload) require(preload);
