// Called from preload.ts, exported as Hykord

import { CoreLogger as Logger } from '@common';
import './modules/webpack/patch';
import './polyfill';
import './loaders';

Logger.info('In renderer');

export const directory = HykordNative.getDirectory();
export const test = 'a';

export * as Utils from './utils';
export * as Webpack from '@hykord/webpack';
export * as Loaders from './loaders';