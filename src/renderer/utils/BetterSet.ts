export class BetterSet<T> extends Set<T> {
    find(fn: (value: any) => boolean): any {
        for (const value of this.values()) {
            if (fn(value)) return value;
        }
    }

    map<U>(fn: (value: T) => U): U[] {
        const arr: U[] = [];

        for (const value of this.values()) {
            arr.push(fn(value));
        }

        return arr;
    }
}