// Called from preload.ts, exported as Hykord

import { CoreLogger as Logger } from '@common';
import './modules/webpack/patch';
import './polyfill';
import './loaders';
import { checkForUpdates } from '@hykord/utils/updater';

Logger.info('In renderer');
checkForUpdates();

// Declared in scripts/build.ts
declare const $HYKORD_VERSION: string;

export const version = $HYKORD_VERSION;
export const gitHash = $HYKORD_GIT_HASH;
export const directory = HykordNative.getDirectory();
export const Settings = HykordNative.getManagers().getSettings();

export * as Loaders from './loaders';

// Modules
export * as Modules from './modules';

// Exported modules top level
export * as Utils from '@hykord/utils';
export * as Webpack from '@hykord/webpack';
export * as Components from '@hykord/components';
export * as Hooks from '@hykord/hooks';
export * as Apis from '@hykord/apis';
export * as Patcher from '@hykord/patcher';