import 'module-alias/register';
import { ipcRenderer, webFrame } from 'electron';
import { join } from 'path';
import Logger from '@module/logger';

import '../hykord/ipc/renderer';

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

Object.defineProperty(window, 'require', {
  get: () => require,
});

require('module').Module.globalPaths.push(
  join(__dirname, '..', 'hykord', 'api', 'modules'),
);

const hykord = new (require('../hykord/index').Hykord)();
Object.defineProperty(window, 'hykord', {
  get: () => hykord,
});

const preload = ipcRenderer.sendSync('HYKORD_GET_DISCORD_PRELOAD');
if (preload) require(preload);
