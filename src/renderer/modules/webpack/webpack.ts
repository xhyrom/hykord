// Used from https://github.com/replugged-org/replugged/blob/c64881991b30ee05517af8f7ac1e29369b9acd2c/src/renderer/modules/webpack.ts
// Thanks, Replugged!
// Temporary solution

import { byCode, byProps, byProtos } from './filters';
import { ModuleExports, WebpackRequire, WebpackChunkGlobal, RawModule, Filter, LazyCallback } from '@common';

export const subscriptions = new Map<Filter, LazyCallback>();

let instance: WebpackRequire;

export function _initWebpack(webpackChunk: WebpackChunkGlobal) {
  if (instance !== void 0) throw 'no.';

  instance = webpackChunk.push([
    [ Symbol('hykord') ],
    {},
    (r: WebpackRequire) => r
  ]) as WebpackRequire;
  webpackChunk.pop();
}

export const getRawModules = (): RawModule[] => instance ? Object.values(instance.c) as RawModule[] : [];

export const getAllModules = (filter?: Filter | undefined): ModuleExports[] => {
  return getRawModules()
    .map(m => {
      const isMatch = filter ? filter : () => true;

      if (m.exports && isMatch(m.exports)) return m.exports;
      if (typeof m.exports !== 'object') return;

      if (m.exports?.default && isMatch(m.exports?.default as ModuleExports)) return m.exports.default;

      for (const key in m.exports) {
        const nested = m.exports[key] as ModuleExports;
        if (nested && isMatch(nested)) return nested;
      }

      return;
    })
    .filter(Boolean) as unknown as ModuleExports[];
};

export const getModule = (filter?: Filter | undefined): ModuleExports | null => getAllModules(filter)[0] ?? null;

// By properties
export const findAllByProps = (...props: string[]): ModuleExports[] => getAllModules(byProps(...props));
export const findByProps = (...props: string[]): ModuleExports | null => findAllByProps(...props)[0] ?? null;

// By prototype fields/properties
export const findAllByPrototypeFields = (...protos: string[]): ModuleExports[] => getAllModules(byProtos(...protos));
export const findByPrototypeFields = (...protos: string[]): ModuleExports | null => findAllByPrototypeFields(...protos)[0] ?? null;

// By code
export const findAllByCode = (...code: string[]): ModuleExports[] => getAllModules(byCode(...code));
export const findByCode = (...code: string[]): ModuleExports | null => findAllByCode(...code)[0] ?? null;

export function waitFor(filter: string | string[] | Filter, callback: LazyCallback): void {
  if (typeof filter === 'string') filter = byProps(filter);
  else if (Array.isArray(filter)) filter = byProps(...filter);
  else if (typeof filter !== 'function') filter = byProps(filter);

  const existing = getModule(filter!);
  if (existing) return void callback(existing);

  subscriptions.set(filter, callback);
}