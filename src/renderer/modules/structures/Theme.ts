import { IAddon } from './Addon';

export interface Theme extends IAddon {
    // Required properties
    start(): string;

    // Optional properties
    description?: string;
    license?: string;
    cssId?: string;
}