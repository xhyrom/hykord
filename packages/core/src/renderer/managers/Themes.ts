import { Theme } from "@hykord/structures/Theme";
import { mkdirIfNotExists } from "@hykord/fs/promises";
import { readdir } from "fs/promises";
import { join } from "path";
import Logger from "@hykord/logger";

export class ThemesManager {
    public location: string;
    private themes: Map<string, Theme>;
    private modules: {
        utilities: typeof import('@hykord/utilities');
    };

    constructor() {
        this.location = null;
        this.themes = new Map();
    }

    public async register(theme: Theme) {
        this.themes.set(theme.name, theme);
    }

    public async init() {
        this.location = `${process.env.HOME || process.env.USERPROFILE}/.hykord/${window.GLOBAL_ENV.RELEASE_CHANNEL}/themes`;
        this.modules = {
            utilities: require('@hykord/utilities'),
        }

        await mkdirIfNotExists(this.location);
        await this.loadThemes();
    }

    public async toggleTheme(theme: Theme): Promise<boolean> {
        if (theme.enabled) {
            window.hykord.settings.addToSeting('hykord.disabled_themes', this.modules.utilities.nameToId(theme.name));
            await this.disableTheme(theme);

            return false;
        } else {
            window.hykord.settings.removeFromSeting('hykord.disabled_themes', this.modules.utilities.nameToId(theme.name));
            await this.enableTheme(theme);

            return true;
        }
    }

    public async enableTheme(theme: Theme) {
        if ((window.hykord.settings.getSetting('hykord.disabled_themes', []) as string[]).includes(this.modules.utilities.nameToId(theme.name))) return false;

        theme.loading = true;
        this.modules.utilities.loaders.loadCss(theme.name, await theme.onEnable());
        theme.enabled = true;
        theme.loading = false;

        return true;
    }

    public async disableTheme(theme: Theme) {
        await theme.onDisable();
        this.modules.utilities.loaders.unloadCss(theme.name);
        theme.enabled = false;
    }

    public async loadThemes() {
        for (const themeDirectory of await readdir(this.location, { withFileTypes: true })) {
            if (!themeDirectory.isDirectory()) continue;

            Logger.info(`Initializing theme ${themeDirectory.name}.`);
            await Promise.resolve(import(`${join(this.location, themeDirectory.name, 'dist', 'index.js')}`))
                .catch(error => {
                    Logger.err(`Failed to initialize theme ${themeDirectory.name} - ${error.code ?? ''} ${error.message}`);
                })
                .then(() => {
                    Logger.info(`Theme ${themeDirectory.name} has been initialized.`);
                })
        }

        for (const theme of Array.from(this.themes.values())) {
            Logger.info(`Loading theme ${theme.name}.`);

            await Promise.resolve(this.enableTheme(theme))
                .catch(error => {
                    Logger.err(`Failed to load theme ${theme.name} - ${error.code ?? ''} ${error.message}`);

                    theme.broken = true;
                })
                .then((v: boolean) => {
                    if (!v) {
                        Logger.warn(`Skipping theme ${theme.name} because it's disabled.`);

                        return;
                    }

                    Logger.info(`Theme ${theme.name} has been loaded.`);

                    theme.enabled = true;
                    theme.loading = false;
                })
        }
    }

    public getTheme(name: string) {
        return this.themes.get(name);
    }

    public getAllThemes() {
        return Array.from(this.themes.values());
    }
}