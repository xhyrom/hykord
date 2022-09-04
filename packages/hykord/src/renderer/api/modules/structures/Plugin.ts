import { Logger } from '@hykord/logger';

interface PluginOptions {
    name: string;
    author: string;
    description: string;
    onEnable: (plugin: Plugin) => void;
    onDisable?: (plugin: Plugin) => void;
}

export class Plugin {
    public name: string;
    public author: string;
    public description: string;
    public enabled = false;
    public loading = false;
    public broken = false;
    public logger: Logger;
    public onEnable: () => void;
    public onDisable?: () => void;

    constructor(options: PluginOptions) {
        this.name = options.name;
        this.author = options.author;
        this.description = options.description;
        this.logger = new Logger(`plugin/${this.name}`);
        this.onEnable = () => options.onEnable(this);
        this.onDisable = () => options.onDisable(this);

        window.hykord.plugins.register(this);
    }
}