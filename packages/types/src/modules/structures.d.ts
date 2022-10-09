declare module '@hykord/structures' {
    export interface IAddon {
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
    
    export abstract class Addon {
        public abstract readonly name: string;
        public abstract readonly version: string;
        public abstract readonly author: string;
    
        // Optional properties
        public description?: string;
        public license?: string;
    
        // DONT TOUCH
        public $enabled?: boolean;
        public $toggleable?: boolean;
        public $internal?: boolean;
        public $cleanName?: string;
        public $fileName?: string;
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
        public settings?: PluginSetting[];
        public dependsOn?: string[];
        public stop?(): void;
    
        // DONT TOUCH
        public getSetting<T>(name: string, defaultValue?: any): Promise<T>;
        public getSettingSync<T>(name: string, defaultValue?: any): T;
    }

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
        public description?: string | undefined;
        public license?: string | undefined;
        public cssId?: string | undefined;
    
        // DONT TOUCH
        public $enabled?: boolean;
        public $toggleable?: boolean;
        public $cleanName?: string;
    }
}