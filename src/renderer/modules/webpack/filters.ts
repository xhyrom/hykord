import type { Exports } from './webpack';
export type Filter = (module: Exports) => boolean | Exports;

export const byProps = (...props: string[]) => (m: Exports) => {
    return m && props.every(p => Object.keys(m).includes(p));
}

export const byProtos = (...protos: string[]) => (m: Exports | any) => {
    return m.prototype && protos.every(p => Object.keys(m.prototype).includes(p));
}