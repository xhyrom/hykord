export declare class Logger {
    name: string;
    constructor(name: string);
    info(...message: string[]): void;
    warn(...message: string[]): void;
    err(...message: string[]): void;
    debug(...message: string[]): void;
    private log;
}
