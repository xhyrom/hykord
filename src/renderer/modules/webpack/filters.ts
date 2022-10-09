import type { ModuleExports } from '@common';

export const byProps = (...props: string[]) => (m: ModuleExports) => {
    return m && props.every(p => Object.keys(m).includes(p));
};

export const byProtos = (...protos: string[]) => (m: ModuleExports | any) => {
    return m.prototype && protos.every(p => Object.keys(m.prototype).includes(p));
};

export const byCode = (...code: string[]) => (m: ModuleExports) => {
    if (typeof m !== 'function') return false;

    const functionCode = Function.prototype.toString.call(m);

    return code.every(c => functionCode.includes(c));
};