import { getModule } from '@hykord/webpack';
import { Filter, ModuleExports } from '@hykord/webpack/types';

import { proxyLazy } from './proxyLazy';
export { proxyLazy };

export * as quickCss from './quickCss';
export * as Updater from './updater';
export * as Discord from './discord';
export { BetterSet } from './BetterSet';
export { getMetadata } from './getMetadata';

export const lazy = <T>(factory: () => T): (() => T) =>  {
    let cache: T;
    return () => cache ?? (cache = factory());
}

export const lazyWebpack = <T = any>(filter: Filter): T => {
    return proxyLazy(() => getModule(filter)) as T;
}

export const mergeDefaults = <T>(obj: T, defaults: T): T => {
    for (const key in defaults) {
        const v = defaults[key];
        if (typeof v === 'object' && !Array.isArray(v)) {
            obj[key] ??= {} as any;
            mergeDefaults(obj[key], v);
        } else {
            obj[key] ??= v;
        }
    }
    return obj;
}