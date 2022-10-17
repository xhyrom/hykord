import type { ModuleExports } from './types';

export const byProps = (...props: string[]) => (m: ModuleExports) => {
    return m && props.every(p => (m as Record<string, unknown>)?.[p] !== undefined);
};

export const byProtos = (...protos: string[]) => (m: ModuleExports | any) => {
    return m.prototype && protos.every(p => m.prototype?.[p] !== undefined);
};

export const byCode = (...code: string[]) => (m: ModuleExports) => {
    if (typeof m !== 'function') return false;

    const functionCode = Function.prototype.toString.call(m);

    return code.every(c => functionCode.includes(c));
};

export const byDisplayName = (name: string) => (m: ModuleExports) => (m as Record<string, unknown>).displayName === name;