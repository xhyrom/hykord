import { Theme } from "@hykord/structures/Theme";
import { mkdirIfNotExists } from "@hykord/fs/promises";
import { readdir, readFile } from "fs/promises";
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

    public async initializeTheme(name: string) {
        Logger.info(`Initializing theme ${name}.`);

        await Promise.resolve(import(join(this.location, name, 'dist', 'index.js')))
            .catch(error => {
                Logger.err(`Failed to initialize theme ${name} - ${error.code ?? ''} ${error.message}`);
            })
            .then(() => {
                Logger.info(`Theme ${name} has been initialized.`);
            })
    }

    public async loadTheme(theme: Theme) {
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

    public async loadThemes() {
        for (const themeDirectory of await readdir(this.location, { withFileTypes: true })) {
            if (!themeDirectory.isDirectory()) {
                await ThemeManagerBDCompat.initializeTheme(this, themeDirectory.name);
                continue;
            };

            await this.initializeTheme(themeDirectory.name);
        }

        for (const theme of Array.from(this.themes.values())) {
            await this.loadTheme(theme);
        }
    }

    public getTheme(name: string) {
        return this.themes.get(name);
    }

    public getAllThemes() {
        return Array.from(this.themes.values());
    }
}

class ThemeManagerBDCompat {
    // FULLY GRABBED FROM BETTERDISCORD - dont want waste time lol
    static get splitRegex() {
        return /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
    }
    static get escapedAtRegex() {
        return /^\\@/;
    }

    static parseNewMeta(fileContent): { name?: string; description?: string; author?: string; } {
        const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
        const out: { name?: string; description?: string; author?: string; } = {};
        let field = "";
        let accum = "";
        for (const line of block.split(ThemeManagerBDCompat.splitRegex)) {
            if (line.length === 0) continue;
            if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
                out[field] = accum.trim();
                const l = line.indexOf(" ");
                field = line.substring(1, l);
                accum = line.substring(l + 1);
            }
            else {
                accum += " " + line.replace("\\n", "\n").replace(ThemeManagerBDCompat.escapedAtRegex, "@");
            }
        }
        out[field] = accum.trim();
        delete out[""];
        return out;
    }

    static async initializeTheme(manager: ThemesManager, name: string) {
        const content = (await readFile(join(manager.location, name), {
            encoding: 'utf-8'
        })).toString();

        const data = ThemeManagerBDCompat.parseNewMeta(content);
        if (!data.name) return;

        new Theme({
            name: data.name,
            author: data?.author,
            description: data?.description,
            onEnable: () => {
                return join(manager.location, name);
            }
        })
    }
}