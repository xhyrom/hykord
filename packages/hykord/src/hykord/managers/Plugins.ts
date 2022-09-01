import { Plugin } from "@module/structures/Plugin";
import { mkdirIfNotExists } from "@module/fs/promises";
import { readdir } from "fs/promises";
import { join } from "path";
import Logger from "@module/logger";

export class PluginsManager {
    location: string;
    plugins: Map<string, Plugin>

    constructor() {
        this.location = null;
        this.plugins = new Map();
    }

    public async register(plugin: Plugin) {
        this.plugins.set(plugin.name, plugin);
    }

    public async init() {
        this.location = `${process.env.HOME || process.env.USERPROFILE}/.hykord/${window.GLOBAL_ENV.RELEASE_CHANNEL}/plugins`;

        await mkdirIfNotExists(this.location);
        await this.loadPlugins();
    }

    public async togglePlugin(plugin: Plugin): Promise<boolean> {
        if (plugin.enabled) {
            await this.disablePlugin(plugin);
            return false;
        } else {
            await this.enablePlugin(plugin);
            return true;
        }
    }

    public async enablePlugin(plugin: Plugin) {
        plugin.loading = true;
        await plugin.onEnable();
        plugin.enabled = true;
        plugin.loading = false;
    }

    public async disablePlugin(plugin: Plugin) {
        await plugin.onDisable();
        plugin.enabled = false;
    }

    public async loadPlugins() {
        for (const pluginDirectory of await readdir(this.location, { withFileTypes: true })) {
            if (!pluginDirectory.isDirectory()) continue;

            Logger.info(`Initializing plugin ${pluginDirectory.name}.`);
            await Promise.resolve(import(`${join(this.location, pluginDirectory.name, 'dist', 'index.js')}`))
                .catch(error => {
                    Logger.err(`Failed to initialize plugin ${pluginDirectory.name} - ${error.code ?? ''} ${error.message}`)
                })
                .then(() => {
                    Logger.info(`Plugin ${pluginDirectory.name} has been initialized.`);
                })
        }

        for (const plugin of Array.from(this.plugins.values())) {
            Logger.info(`Loading plugin ${plugin.name}.`);

            await Promise.resolve(this.enablePlugin(plugin))
                .catch(error => {
                    Logger.err(`Failed to load plugin ${plugin.name} - ${error.code ?? ''} ${error.message}`);
                })
                .then(() => {
                    Logger.info(`Plugin ${plugin.name} has been loaded.`);

                    plugin.enabled = true;
                    plugin.loading = false;
                })
        }
    }

    public getPlugin(name: string) {
        return this.plugins.get(name);
    }

    public getAllPlugins() {
        return Array.from(this.plugins.values());
    }
}