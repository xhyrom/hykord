interface PluginOptions {
    name: string;
    onEnable: () => {};
    onDisable: () => {};
}

export class Plugin {
    public name: string;
    public enabled: boolean;
    public loading: boolean;
    public onEnable: () => {};
    public onDisable: () => {};

    constructor(options: PluginOptions) {
        this.name = options.name;
        this.onEnable = options.onEnable;
        this.onDisable = options.onDisable;

        window.hykord.plugins.register(this);
    }
}