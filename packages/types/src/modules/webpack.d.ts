declare module '@hykord/webpack' {
    export type ModuleExports = Record<string, unknown> | ((...args: unknown[]) => unknown) | string | boolean | symbol;
    export type WebpackRequireCache = Record<string | number, RawModule>;
    export type WebpackRequire = ((e: number) => ModuleExports) & {
        c: WebpackRequireCache;
    };
    export type WebpackChunk = [
        (symbol | number)[],
        Record<number, (wpModule: RawModule, wpExports: typeof wpModule.exports, wpRequire: WebpackRequire) => void>,
        ((r: WebpackRequire) => unknown)?
    ];
    export type WebpackChunkGlobal = {
        push: (chunk: WebpackChunk) => unknown;
    } & WebpackChunk[];
    export type RawModule = Record<string, unknown> & {
        id: number;
        loaded: boolean;
        exports: ModuleExports;
    };
    export type Filter = (module: ModuleExports) => boolean | ModuleExports;
    export type LazyCallback = (module: ModuleExports) => void;

    export const subscriptions: Map<Filter, LazyCallback>;
    export function _initWebpack(webpackChunk: WebpackChunkGlobal): void;
    export const getRawModules: () => RawModule[];
    export const getAllModules: (filter?: Filter | undefined) => ModuleExports[];
    export const getModule: (filter?: Filter | undefined) => ModuleExports | null;
    export const findAllByProps: (...props: string[]) => ModuleExports[];
    export const findByProps: (...props: string[]) => ModuleExports | null;
    export const findAllByPrototypeFields: (...protos: string[]) => ModuleExports[];
    export const findByPrototypeFields: (...protos: string[]) => ModuleExports | null;
    export const findAllByCode: (...code: string[]) => ModuleExports[];
    export const findByCode: (...code: string[]) => ModuleExports | null;
    export function waitFor(filter: string | string[] | Filter, callback: LazyCallback): void;

    namespace Filters {
        export const byProps: (...props: string[]) => (m: ModuleExports) => boolean | '';
        export const byProtos: (...protos: string[]) => (m: ModuleExports | any) => any;
        export const byCode: (...code: string[]) => (m: ModuleExports) => boolean;
    }

    namespace Common {
        export let React: typeof import('react');
        export let ReactDOM: import('react').ReactDOM;
    }

    export const React: typeof Common.React;
}