import { Addon, IAddon } from './Addon';
export interface ITheme extends IAddon {
    start(): string;
    cssId?: string;
}
export declare abstract class Theme extends Addon implements ITheme {
    abstract start(): string;
    description?: string | undefined;
    license?: string | undefined;
    cssId?: string | undefined;
    $enabled?: boolean;
    $toggleable?: boolean;
    $cleanName?: string;
}
