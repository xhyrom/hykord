export type ModuleExports = Record<string, unknown> | ((...args: unknown[]) => unknown) | string | boolean | symbol;
export type WebpackRequireCache = Record<string | number, RawModule>;
export type WebpackRequire = ((e: number) => ModuleExports) & {
  c: WebpackRequireCache;
};

export type WebpackChunk = [
  (symbol | number)[],
  Record<number, (
    wpModule: RawModule,
    wpExports: typeof wpModule.exports,
    wpRequire: WebpackRequire
  ) => void>,
  ((r: WebpackRequire) => unknown)?
];
export type WebpackChunkGlobal = {
  push: (chunk: WebpackChunk) => unknown;
} & WebpackChunk[];

export type RawModule = Record<string, unknown> & {
  id: number;
  loaded: boolean;
  exports: ModuleExports
};

export type Filter = (module: ModuleExports) => boolean | ModuleExports;

export type LazyCallback = (module: ModuleExports) => void;