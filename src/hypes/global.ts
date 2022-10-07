/* eslint-disable no-var */

declare global {
  export var HykordNative: typeof import("../preload/api/HykordNative").default;
  export var Hykord: typeof import("../renderer/index");
  export var appSettings:
    | {
        set(setting: string, v: any): void;
      }
    | undefined;

  interface Window {
    webpackChunkdiscord_app: {
      push(chunk: any): any;
      pop(): any;
    };
    [k: PropertyKey]: any;
    require<T>(mod: string): T;
  }
}

export {};
