export interface IAddon {
    readonly name: string;
    readonly version: string;
    readonly author: string;
    description?: string;
    license?: string;
    $enabled?: boolean;
    $toggleable?: boolean;
    $internal?: boolean;
    $cleanName?: string;
    $fileName?: string;
}
export declare abstract class Addon {
    abstract readonly name: string;
    abstract readonly version: string;
    abstract readonly author: string;
    description?: string;
    license?: string;
    $enabled?: boolean;
    $toggleable?: boolean;
    $internal?: boolean;
    $cleanName?: string;
    $fileName?: string;
}
