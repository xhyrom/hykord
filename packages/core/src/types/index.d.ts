/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hykord } from '../renderer/index';

export {};

declare global {
  interface Window {
    GLOBAL_ENV: any;
    DiscordSentry: any;
    __SENTRY__: any;
    _: any;
    platform: any;
    webpackChunkdiscord_app: any;
    hykord: Hykord;
  }
}
