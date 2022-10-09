// Called from preload.ts, exported as Hykord

import { CoreLogger as Logger } from '@common';
import './modules/webpack/patch';
import './polyfill';
import './loaders';
import { checkForUpdates } from './utils/updater';

Logger.info('In renderer');
checkForUpdates();

// Declared in scripts/build.ts
declare const $HYKORD_VERSION: string;
declare const $HYKORD_GIT_HASH: string;

export const version = $HYKORD_VERSION;
export const gitHash = $HYKORD_GIT_HASH;
export const directory = HykordNative.getDirectory();

export * as Utils from './utils';
export * as Webpack from '@hykord/webpack';
export * as Components from '@hykord/components';
export * as Structures from '@hykord/structures';
export * as Apis from '@hykord/apis';
export * as Patcher from '@hykord/patcher';
export * as Loaders from './loaders';
