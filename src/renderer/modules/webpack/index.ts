// Used from https://github.com/replugged-org/replugged/blob/c64881991b30ee05517af8f7ac1e29369b9acd2c/src/renderer/modules/webpack.ts
// Thanks, Replugged!
// Temporary solution

import { WebpackInstance } from 'discord-types/other';

type Exports = Record<string, unknown> | ((...args: unknown[]) => unknown) | string;

export type RawModule = Record<string, unknown> & {
  id: number;
  loaded: boolean;
  exports: Exports
};

class Module {
  public id: number;
  public exports: Exports;
  public loaded: boolean;

  constructor (module: RawModule) {
    this.id = module.id;
    this.exports = module.exports;
    this.loaded = module.loaded;
  }

  public findExportForProps (...props: string[]): Record<string, unknown> | null {
    if (!this.exports || typeof this.exports !== 'object') {
      return null;
    }

    const objectExports = Object.values(this.exports).filter(x => typeof x === 'object') as Record<string, unknown>[];

    return objectExports.find(x => props.every(prop => Object.keys(x).includes(prop))) ?? null;
  }
}

let instance: WebpackInstance;
let ready = false;

function patchPush (webpackChunk: typeof window.webpackChunkdiscord_app) {
  let original = webpackChunk.push;

  function handlePush (chunk: [unknown, Record<number, RawModule>]) {
    return original.call(webpackChunk, chunk);
  }

  Object.defineProperty(webpackChunk, 'push', {
    get: () => handlePush,
    set: (v) => (original = v),
    configurable: true
  });
}

function loadWebpackModules (webpackChunk: typeof window.webpackChunkdiscord_app) {
  instance = webpackChunk.push([
    // eslint-disable-next-line symbol-description
    [ Symbol() ],
    {},
    (r: WebpackInstance) => r
  ]);

  patchPush(webpackChunk);

  ready = true;
}

let webpackChunk: typeof window.webpackChunkdiscord_app | undefined;

Object.defineProperty(window, 'webpackChunkdiscord_app', {
  get: () => webpackChunk,
  set: (v) => {
    if (v?.push !== Array.prototype.push && !ready) {
      loadWebpackModules(v);
    }
    webpackChunk = v;
  },
  configurable: true
});

export function getRawModules () {
  return Object.values(instance.c) as RawModule[];
}

type Filter = (module: Exports) => boolean | Exports;

export function getAllModules (filter?: Filter | undefined): Module[] {
  return getRawModules()
    .map(m => {
      const isMatch = filter ? filter : () => true;

      if (m.exports && isMatch(m.exports)) return new Module(m);
      if (typeof m.exports !== 'object') return;

      if (m.exports?.default && isMatch(m.exports?.default as Exports)) return new Module({
        id: m.id,
        exports: m.exports.default as Exports,
        loaded: m.loaded
      });

      for (const key in m.exports) {
        const nested = m.exports[key];
        // @ts-expect-error prototype is everywhere!!!!!
        if (nested && isMatch(nested)) return new Module({
          id :m.id,
          exports: nested as Exports,
          loaded: m.loaded
        });
      }

      return;
    })
    .filter(Boolean) as unknown as Module[];
}

export const getModule = (filter: Filter): Module | null => getAllModules(filter)[0] ?? null;

export function getAllByProps (...props: string[]): Module[] {
  return getRawModules()
    .map(m => {
      if (!m.exports || typeof m.exports !== 'object') {
        return;
      }

      const result = [ m.exports, ...Object.values(m.exports) ].find(x => x && props.every(prop => Object.keys(x).includes(prop)));
      if (!result) {
        return;
      }

      m.props = result;

      return new Module(m);
    })
    .filter(Boolean) as unknown as Module[];
}

export const getByProps = (...props: string[]): Module | null => getAllByProps(...props)[0] ?? null;

export function getAllByPrototypeFields (...protos: string[]): Module[] {
  return getRawModules()
    .map(m => {
      if (!m.exports) {
        return;
      }

      // @ts-expect-error prototype is everywhere!!!!!
      if (m.exports?.prototype && protos.every((p) => p in m.exports.prototype)) return new Module(m);
      if (typeof m.exports !== 'object') return;

      // @ts-expect-error prototype is everywhere!!!!!
      if (m.exports.default?.prototype && protos.every((p) => p in m.exports.default.prototype)) return new Module({
        id: m.id,
        exports: m.exports.default as Exports,
        loaded: m.loaded
      });

      for (const key in m.exports) {
        const nested = m.exports[key];
        // @ts-expect-error prototype is everywhere!!!!!
        if (nested?.prototype && protos.every((p) => p in nested?.prototype)) return new Module({
          id :m.id,
          exports: nested as Exports,
          loaded: m.loaded
        });
      }

      return;
    })
    .filter(Boolean) as unknown as Module[];
}

export const getByPrototypeFields = (...protos: string[]): Module | null => getAllByPrototypeFields(...protos)[0] ?? null;