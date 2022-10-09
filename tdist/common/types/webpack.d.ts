export declare type ModuleExports = Record<string, unknown> | ((...args: unknown[]) => unknown) | string | boolean | symbol;
export declare type WebpackRequireCache = Record<string | number, RawModule>;
export declare type WebpackRequire = ((e: number) => ModuleExports) & {
    c: WebpackRequireCache;
};
export declare type WebpackChunk = [
    (symbol | number)[],
    Record<number, (wpModule: RawModule, wpExports: typeof wpModule.exports, wpRequire: WebpackRequire) => void>,
    ((r: WebpackRequire) => unknown)?
];
export declare type WebpackChunkGlobal = {
    push: (chunk: WebpackChunk) => unknown;
} & WebpackChunk[];
export declare type RawModule = Record<string, unknown> & {
    id: number;
    loaded: boolean;
    exports: ModuleExports;
};
export declare type Filter = (module: ModuleExports) => boolean | ModuleExports;
export declare type LazyCallback = (module: ModuleExports) => void;
