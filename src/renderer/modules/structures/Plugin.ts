export abstract class Plugin {
    // Required properties
    public abstract readonly name: string;
    public abstract readonly version: string;
    public abstract readonly author: string;
    public abstract start(): void;

    // Optional properties
    public description?: string;
    public license?: string;
    public toggleable?: boolean = true;
    public dependsOn?: string[] = [];
    public stop?(): void;

    // DONT TOUCH
    public $enabled?: boolean = false;
}