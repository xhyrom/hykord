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

    sort(fn: (a: T, b: T) => number): void {
        const arr = this.map((v) => v);

        arr.sort(fn);

        this.clear();

        for (const value of arr) {
            this.add(value);
        }
    }
}