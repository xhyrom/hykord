import { Addon, IAddon } from './Addon';

export interface ITheme extends IAddon {
    // Required properties
    start(): string;

    // Optional properties
    cssId?: string;
}

export abstract class Theme extends Addon implements ITheme {
    // Required properties
    public abstract start(): string;

    // Optional properties
    public description?: string | undefined = undefined;
    public license?: string | undefined = undefined;
    public cssId?: string | undefined = undefined;

    // DONT TOUCH
    public $enabled?: boolean = false;
    public $toggleable?: boolean = true;
    public $cleanName?: string;
}