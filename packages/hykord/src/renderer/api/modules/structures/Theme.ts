interface PluginOptions {
    name: string;
    author: string;
    description: string;
    onEnable: () => string;
    onDisable?: () => void;
}

export class Theme {
    public name: string;
    public author: string;
    public description: string;
    public enabled = false;
    public loading = false;
    public broken = false;
    public onEnable: () => string;
    public onDisable?: () => void;

    constructor(options: PluginOptions) {
        this.name = options.name;
        this.author = options.author;
        this.description = options.description;
        this.onEnable = options.onEnable;
        this.onDisable = options.onDisable;

        window.hykord.themes.register(this);
    }
}