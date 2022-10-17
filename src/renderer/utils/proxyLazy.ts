// From https://github.com/Vendicated/Vencord/blob/main/src/utils/proxyLazy.ts

import { lazy as makeLazy } from '.';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ProxyDummy = function () {};
export function proxyLazy<T>(factory: () => T): T {
    const lazy: any = makeLazy(factory);

    return new Proxy(ProxyDummy, {
        get: (_, prop) => lazy()[prop],
        set: (_, prop, value) => lazy()[prop] = value,
        has: (_, prop) => prop in lazy(),
        // eslint-disable-next-line @typescript-eslint/ban-types
        apply: (_, $this, args) => (lazy() as Function).apply($this, args),
        ownKeys: () => Reflect.ownKeys(lazy() as object),
        // eslint-disable-next-line @typescript-eslint/ban-types
        construct: (_, args) => Reflect.construct(lazy() as Function, args),
        deleteProperty: (_, prop) => delete lazy()[prop],
        defineProperty: (_, property, attributes) => !!Object.defineProperty(lazy(), property, attributes),
        getPrototypeOf: () => Object.getPrototypeOf(lazy())
    }) as any as T;
}