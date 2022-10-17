export * from './plugin';
export * from './theme';

export interface Addon {
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
    $internal?: boolean;
    $cleanName?: string;
    $fileName?: string;
}