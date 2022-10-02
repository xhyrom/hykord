// Used from https://github.com/replugged-org/replugged/blob/c64881991b30ee05517af8f7ac1e29369b9acd2c/src/renderer/modules/webpack.ts
// Thanks, Replugged!
// Temporary solution

import { WebpackInstance } from 'discord-types/other';
import { byProps, byProtos, Filter } from './filters';

export type Exports = Record<string, unknown> | ((...args: unknown[]) => unknown) | string;
export type RawModule = Record<string, unknown> & {
  id: number;
  loaded: boolean;
  exports: Exports
};

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
    [ Symbol('hykord') ],
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
    if (!ready && v?.push !== Array.prototype.push) {
      loadWebpackModules(v);
    }
    webpackChunk = v;
  },
  configurable: true
});

export function getRawModules () {
  return Object.values(instance.c) as RawModule[];
}

export function getAllModules (filter?: Filter | undefined): Exports[] {
  return getRawModules()
    .map(m => {
      const isMatch = filter ? filter : () => true;

      if (m.exports && isMatch(m.exports)) return m.exports;
      if (typeof m.exports !== 'object') return;

      if (m.exports?.default && isMatch(m.exports?.default as Exports)) return m.exports.default;

      for (const key in m.exports) {
        const nested = m.exports[key] as Exports;
        if (nested && isMatch(nested)) return nested;
      }

      return;
    })
    .filter(Boolean) as unknown as Exports[];
}

export const getModule = (filter?: Filter | undefined): Exports | null => getAllModules(filter)[0] ?? null;

// By properties
export const getAllByProps = (...props: string[]): Exports[] => getAllModules(byProps(...props));
export const getByProps = (...props: string[]): Exports | null => getAllByProps(...props)[0] ?? null;

// By prototype fields/properties
export const getAllByPrototypeFields = (...protos: string[]): Exports[] => getAllModules(byProtos(...protos));
export const getByPrototypeFields = (...protos: string[]): Exports | null => getAllByPrototypeFields(...protos)[0] ?? null;