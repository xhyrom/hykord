import type { ModuleExports } from '@common';
export declare const byProps: (...props: string[]) => (m: ModuleExports) => boolean | "";
export declare const byProtos: (...protos: string[]) => (m: ModuleExports | any) => any;
export declare const byCode: (...code: string[]) => (m: ModuleExports) => boolean;
