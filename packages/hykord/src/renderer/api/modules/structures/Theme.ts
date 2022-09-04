import { Logger } from '@hykord/logger';

interface PluginOptions {
    name: string;
    author: string;
    description: string;
    onEnable: (theme: Theme) => string;
    onDisable?: (theme: Theme) => void;
}

export class Theme {
    public name: string;
    public author: string;
    public description: string;
    public enabled = false;
    public loading = false;
    public broken = false;
    public logger: Logger;
    public onEnable: () => string;
    public onDisable?: () => void;

    constructor(options: PluginOptions) {
        this.name = options.name;
        this.author = options.author;
        this.description = options.description;
        this.logger = new Logger(`theme/${this.name}`);
        this.onEnable = () => options.onEnable(this);
        this.onDisable = () => options.onDisable(this);

        window.hykord.themes.register(this);
    }
}