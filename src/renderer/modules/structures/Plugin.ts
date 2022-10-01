export abstract class Plugin {
    // Required properties
    public abstract readonly name: string;
    public abstract readonly version: string;
    public abstract readonly author: string;
    public abstract start(): void;

    // Optional properties
    public description: string | null = null;
    public license: string | null = null;
    public toggleable: boolean = true;
    public internal: boolean = false;
    public stop?(): void;
}