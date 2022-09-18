import { Theme } from "@hykord/structures/Theme";
import { exists, mkdirIfNotExists } from "@hykord/fs/promises";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import Logger from "@hykord/logger";
import { tryRequireOrX, nameToId, loaders } from "@hykord/utilities";

export class ThemesManager {
    public location: string;
    public bdCompat: ThemesManagerBDCompat;
    private themes: Map<string, Theme>;

    constructor() {
        this.location = null;
        this.themes = new Map();
        this.bdCompat = new ThemesManagerBDCompat();
    }

    public async register(theme: Theme) {
        if (Array.from(this.themes.keys()).includes(theme.name)) return;

        this.themes.set(theme.name, theme);
    }

    public async init() {
        this.location = `${process.env.HOME || process.env.USERPROFILE}/.hykord/${window.GLOBAL_ENV.RELEASE_CHANNEL}/themes`;

        await mkdirIfNotExists(this.location);
        await this.loadThemes();
    }

    public async toggleTheme(theme: Theme): Promise<boolean> {
        if (theme.enabled) {
            window.hykord.settings.removeFromSeting('hykord.enabled_themes', nameToId(theme.name));
            await this.disableTheme(theme);

            return false;
        } else {
            window.hykord.settings.addToSeting('hykord.enabled_themes', nameToId(theme.name));
            await this.enableTheme(theme);

            return true;
        }
    }

    public async enableTheme(theme: Theme) {
        if (!(window.hykord.settings.getSetting('hykord.enabled_themes', []) as string[]).includes(nameToId(theme.name))) return false;

        theme.loading = true;
        loaders.loadCss(theme.name, await theme.onEnable());
        theme.enabled = true;
        theme.loading = false;

        return true;
    }

    public async disableTheme(theme: Theme) {
        await theme.onDisable();
        loaders.unloadCss(theme.name);
        theme.enabled = false;
    }

    public async initializeTheme(name: string) {
        Logger.info(`Initializing theme ${name}.`);

        const index = join(this.location, name, 'dist', 'index.js');
        const manifest = await exists(join(this.location, name, 'hykord_manifest.json'))
            ? join(this.location, name, 'hykord_manifest.json')
            : join(this.location, name, 'dist', 'hykord_manifest.json');

        if (await exists(index)) {
            await Promise.resolve(import(join(this.location, name, 'dist', 'index.js')))
                .catch(error => {
                    Logger.err(`Failed to initialize theme ${name} - ${error.code ?? ''} ${error.message}`);
                })
                .then(() => {
                    Logger.info(`Theme ${name} has been initialized.`);
                })
        } else if(await exists(manifest)) {
            const { name: themeName, author, description, version, license, main } = tryRequireOrX(manifest, {});

            if (!themeName || !author || !main) {
                return Logger.err(`Failed to initialize theme ${name} - Missing property name/author or main in hykord_manifest.json`);
            }

            new Theme({
                name: themeName,
                author,
                description,
                version,
                license,
                onEnable: () => {
                    return join(this.location, name, manifest.includes('dist') ? 'dist' : '', main);
                }
            })
        } else {
            Logger.err(`Failed to initialize theme ${name} - can't find dist/index.js or hykord_manifest.json`);
        }
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
                await this.bdCompat.initializeTheme(this, themeDirectory.name);
                continue;
            };

            await this.initializeTheme(themeDirectory.name);
        }

        for (const theme of Array.from(this.themes.values())) {
            if (!theme.enabled) await this.loadTheme(theme);
            else Logger.warn(`Theme ${theme.name} is already enabled!`);
        }
    }

    public getTheme(name: string) {
        return this.themes.get(name);
    }

    public getAllThemes() {
        return Array.from(this.themes.values());
    }
}

interface ThemesManagerBDCompatMeta {
    name?: string;
    description?: string;
    author?: string;
    version?: string;
    license?: string;
};

export class ThemesManagerBDCompat {
    // FULLY GRABBED FROM BETTERDISCORD - dont want waste time lol
    get splitRegex() {
        return /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/;
    }

    get escapedAtRegex() {
        return /^\\@/;
    }

    parseNewMeta(fileContent): ThemesManagerBDCompatMeta {
        const block = fileContent.split("/**", 2)[1].split("*/", 1)[0];
        const out: ThemesManagerBDCompatMeta = {};
        let field = "";
        let accum = "";
        for (const line of block.split(this.splitRegex)) {
            if (line.length === 0) continue;
            if (line.charAt(0) === "@" && line.charAt(1) !== " ") {
                out[field] = accum.trim();
                const l = line.indexOf(" ");
                field = line.substring(1, l);
                accum = line.substring(l + 1);
            }
            else {
                accum += " " + line.replace("\\n", "\n").replace(this.escapedAtRegex, "@");
            }
        }
        out[field] = accum.trim();
        delete out[""];
        return out;
    }

    async initializeTheme(manager: ThemesManager, name: string) {
        const content = (await readFile(join(manager.location, name), {
            encoding: 'utf-8'
        })).toString();

        const data = this.parseNewMeta(content);
        if (!data.name) return;

        new Theme({
            name: data.name,
            author: data?.author,
            description: data?.description,
            version: data?.version,
            license: data?.license,
            onEnable: () => {
                return join(manager.location, name);
            }
        })
    }
}