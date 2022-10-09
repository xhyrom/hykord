export declare class BetterSet<T> extends Set<T> {
    find(fn: (value: any) => boolean): any;
    map<U>(fn: (value: T) => U): U[];
    sort(fn: (a: T, b: T) => number): void;
}
