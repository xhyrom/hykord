import { Hykord } from "@hykord/index";
import { HykordSettings } from "@hykord/managers/Settings";

export {};

interface HykordNative {
    loadExtension: (path: string) => {},
    removeExtension: (path: string) => {},
}

declare global {
    interface Window {
        GLOBAL_ENV: any,
        DiscordSentry: any,
        __SENTRY__: any,
        _: any,
        platform: any,
        webpackChunkdiscord_app: any;
        hykord: Hykord;
        HykordNative: HykordNative;
    }
}