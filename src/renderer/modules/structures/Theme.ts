export interface ITheme {
    readonly name: string;
    readonly version: string;
    readonly author: string;
    start(): string;

    description?: string;
    license?: string;
    toggleable?: boolean;
    cssId?: string;
}

export abstract class Theme implements ITheme {
    // Required properties
    public abstract readonly name: string;
    public abstract readonly version: string;
    public abstract readonly author: string;
    public abstract start(): string;

    // Optional properties
    public description?: string | undefined = undefined;
    public license?: string | undefined = undefined;
    public toggleable?: boolean = true;
    public cssId?: string | undefined = undefined;
}