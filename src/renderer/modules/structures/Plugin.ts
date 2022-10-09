import { Addon } from './Addon';

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
    public settings?: PluginSetting[];
    public dependsOn?: string[] = [];
    public stop?(): void;

    // DONT TOUCH
    public getSetting = <T>(name: string, defaultValue?: any): Promise<T> => HykordNative.getManagers().getSettings().get<T>(`plugins.${this.$cleanName}.${name}`, defaultValue);
    public getSettingSync = <T>(name: string, defaultValue?: any): T => HykordNative.getManagers().getSettings().getSync<T>(`plugins.${this.$cleanName}.${name}`, defaultValue);
}