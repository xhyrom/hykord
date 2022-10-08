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
    public toggleable?: boolean = true;
    public settings?: PluginSetting[];
    public dependsOn?: string[] = [];
    public stop?(): void;

    // DONT TOUCH
    public $enabled?: boolean = false;
    public $cleanName?: string;
    public getSetting = (name: string, defaultValue?: any) => HykordNative.getManagers().getSettings().get(`plugins.${this.$cleanName}.${name}`, defaultValue);
    public getSettingSync = (name: string, defaultValue?: any) => HykordNative.getManagers().getSettings().getSync(`plugins.${this.$cleanName}.${name}`, defaultValue);
}