import { Addon } from './Addon';

// https://github.com/Vendicated/Vencord/blob/main/src/utils/types.ts#L8-L18
export interface PatchReplacement {
    match: string | RegExp;
    replace: string | ((match: string, ...groups: string[]) => string);
}

export interface Patch {
    plugin?: string;
    find: string;
    replacement: PatchReplacement | PatchReplacement[];
    all?: boolean;
}

export interface PluginSetting {
    type: string;
    name: string;
    description: string;
    defaultValue: any;
}

export abstract class Plugin extends Addon {
    // Required properties
    public abstract start(): void;

    // Optional properties
    public patches?: Patch[];
    public settings?: PluginSetting[];
    public dependsOn?: string[] = [];
    public stop?(): void;

    // DONT TOUCH
    public getSetting = <T>(name: string, defaultValue?: any): Promise<T> => HykordNative.getManagers().getSettings().get<T>(`plugins.${this.$cleanName}.${name}`, defaultValue);
    public getSettingSync = <T>(name: string, defaultValue?: any): T => HykordNative.getManagers().getSettings().getSync<T>(`plugins.${this.$cleanName}.${name}`, defaultValue);
}