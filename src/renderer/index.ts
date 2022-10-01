// Called from preload.ts, exported as Hykord

import { CoreLogger as Logger } from '@common';
import './modules/webpack';
import './polyfill';
import './loaders';

Logger.info('In renderer');

export const directory = HykordNative.getDirectory();
export const test = 'a';

export * as utils from './utils';