declare module '@hykord/structures' {
    interface Setting {
        type: 'text' | 'number' | 'boolean';
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
        public toggleable?: boolean;
        public settings?: Setting[];
        public dependsOn?: string[];
        public stop?(): void;

        // DONT TOUCH
        public $enabled?: boolean;
    }

    export interface Theme {
        // Required properties
        readonly name: string;
        readonly version: string;
        readonly author: string;
        start(): string;

        // Optional properties
        description?: string;
        license?: string;
        toggleable?: boolean;
        cssId?: string;

        // DONT TOUCH
        $enabled?: boolean;
    }
}