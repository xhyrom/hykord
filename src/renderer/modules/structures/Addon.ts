// Base for plugins & themes

export interface IAddon {
    // Required properties
    readonly name: string;
    readonly version: string;
    readonly author: string;

    // Optional properties
    description?: string;
    license?: string;

    // DONT TOUCH
    $enabled?: boolean;
    $toggleable?: boolean;
    $cleanName?: string;
}

export abstract class Addon {
    public abstract readonly name: string;
    public abstract readonly version: string;
    public abstract readonly author: string;

    // Optional properties
    public description?: string;
    public license?: string;

    // DONT TOUCH
    public $enabled?: boolean = false;
    public $toggleable?: boolean = true;
    public $cleanName?: string;
}