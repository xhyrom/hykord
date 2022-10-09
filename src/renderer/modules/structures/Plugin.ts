export interface PluginSetting {
    type: string;
    name: string;
    description: string;
    defaultValue: any;
}

export abstract class Plugin {
    // Required properties
    public abstract readonly name: string;
    public abstract readonly version: string;
    public abstract readonly author: string;
    public abstract start(): void;

    // Optional properties
    public description?: string;
    public license?: string;
    public settings?: PluginSetting[];
    public dependsOn?: string[] = [];
    public stop?(): void;

    // DONT TOUCH
    public $enabled?: boolean = false;
    public $toggleable?: boolean = true;
    public $cleanName?: string;
    public getSetting = <T>(name: string, defaultValue?: any): Promise<T> => HykordNative.getManagers().getSettings().get<T>(`plugins.${this.$cleanName}.${name}`, defaultValue);
    public getSettingSync = <T>(name: string, defaultValue?: any): T => HykordNative.getManagers().getSettings().getSync<T>(`plugins.${this.$cleanName}.${name}`, defaultValue);
}