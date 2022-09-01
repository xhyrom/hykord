interface PluginOptions {
    name: string;
    author: string;
    description: string;
    onEnable: () => {};
    onDisable: () => {};
}

export class Plugin {
    public name: string;
    public author: string;
    public description: string;
    public enabled: boolean;
    public loading: boolean;
    public onEnable: () => {};
    public onDisable: () => {};

    constructor(options: PluginOptions) {
        this.name = options.name;
        this.author = options.author;
        this.description = options.description;
        this.onEnable = options.onEnable;
        this.onDisable = options.onDisable;

        window.hykord.plugins.register(this);
    }
}