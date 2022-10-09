import { Addon } from './Addon';
export interface PluginSetting {
    type: string;
    name: string;
    description: string;
    defaultValue: any;
}
export declare abstract class Plugin extends Addon {
    abstract start(): void;
    settings?: PluginSetting[];
    dependsOn?: string[];
    stop?(): void;
    getSetting: <T>(name: string, defaultValue?: any) => Promise<T>;
    getSettingSync: <T>(name: string, defaultValue?: any) => T;
}
