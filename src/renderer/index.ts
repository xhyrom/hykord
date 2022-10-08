// Called from preload.ts, exported as Hykord

import { CoreLogger as Logger } from '@common';
import './modules/webpack/patch';
import './polyfill';
import './loaders';

Logger.info('In renderer');

export const directory = HykordNative.getDirectory();

export * as Utils from './utils';
export * as Webpack from '@hykord/webpack';
export * as Components from '@hykord/components';
export * as Structures from '@hykord/structures';
export * as Patcher from '@hykord/patcher';
export * as Loaders from './loaders';
