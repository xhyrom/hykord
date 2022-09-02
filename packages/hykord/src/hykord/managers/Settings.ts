import { readAndIfNotExistsCreate } from '@module/fs/promises';
import { writeFile } from 'fs/promises';

type stringOrBoolean = string | boolean;
export type HykordSettings =
    'discord.experiments' |
    'discord.allow_nsfw_and_bypass_age_requirement' |
    'hykord.enable_dev_experiment_mod';

export class SettingsManager {
    private location: string;
    private settings: Map<HykordSettings, boolean | string>;
    private modules: {
        webpack: typeof import('@module/webpack');
        patcher: typeof import('@module/patcher');
    };
    
    constructor() {
        this.location = null;
    }

    async init() {
        this.location = `${process.env.HOME || process.env.USERPROFILE}/.hykord/${window.GLOBAL_ENV.RELEASE_CHANNEL}/settings.json`;
        this.modules = {
            webpack: require('@module/webpack'),
            patcher: require('@module/patcher'),
        }

        const config = await readAndIfNotExistsCreate(
            this.location,
            JSON.stringify({})
        )

        this.settings = this.convertToMap(JSON.parse(config));
        for (const settingKey of Array.from(this.settings.keys())) {
            this.postHandle(settingKey, true);
        }

        return this;
    }

    public getSetting(name: HykordSettings, defaultValue?: stringOrBoolean): stringOrBoolean {
        return this.settings.get(name) || defaultValue;
    }

    public toggleSetting(name: HykordSettings): boolean {
        const old = this.getSetting(name);
        return this.setSetting(name, !old) as boolean;
    }

    public setSetting(name: HykordSettings, value: stringOrBoolean): stringOrBoolean {
        this.settings.set(name, value);

        writeFile(this.location, JSON.stringify(this.deepen(this.settings)));
        return value;
    }

    public getAllSettings(): Map<HykordSettings, stringOrBoolean> {
        return this.settings;
    }

    public postHandle(name: HykordSettings, first?: boolean): void {
        const value = this.getSetting(name, false);

        switch(name) {
            case 'discord.allow_nsfw_and_bypass_age_requirement': {
                const patch = () => {
                    this.modules.patcher.findAndPatch(
                        () => this.modules.webpack.findByProps('getUsers'),
                        (User) => this.modules.patcher.after("getCurrentUser", User, (_, user) => {
                            user.nsfwAllowed = value;
                            return user;
                        })
                    )
                }

                if (first) {
                    const method = () => {
                        patch();
                        this.modules.webpack.FluxDispatcher.unsubscribe('CONNECTION_OPEN', method);
                    };

                    this.modules.webpack.FluxDispatcher.subscribe('CONNECTION_OPEN', method);
                } else {
                    patch();
                }
                break;
            }
            case 'discord.experiments': {
                const patch = () => {
                    const usermod = this.modules.webpack.findByProps('getUsers')
                    const nodes = Object.values(this.modules.webpack.findByProps('_dispatcher')._dispatcher._actionHandlers._dependencyGraph.nodes);
    
                    try {
                        // @ts-expect-error It works
                        nodes.find(x => x.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({user: {flags: 1}});
                    // eslint-disable-next-line no-empty
                    } catch {}
    
                    const oldUser = usermod.getCurrentUser;
                    usermod.getCurrentUser = () => ({hasFlag: () => true});
                    // @ts-expect-error It works
                    nodes.find(x => x.name == "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]();
                    usermod.getCurrentUser = oldUser;
                }

                if (first && value) {
                    const method = () => {
                        patch();
                        this.modules.webpack.FluxDispatcher.unsubscribe('CONNECTION_OPEN', method);
                    };

                    this.modules.webpack.FluxDispatcher.subscribe('CONNECTION_OPEN', method);
                } else if (value) {
                    patch();
                }
                break;
            }
        }
    }

    private convertToMap(object: unknown, key?: string, map?: Map<HykordSettings, stringOrBoolean>) {
        map = map || new Map();
    
        for (const [name, v] of Object.entries(object)) {
            const value = v as string | boolean;

            if (typeof value !== 'object') map.set(key + name as HykordSettings, value);
            else this.convertToMap(value, `${key ? `${key}` : ''}${name}.`, map);
        }
    
        return map;
    }

    private deepen = (map: typeof this.settings) => {
        const object = Object.fromEntries(map);
        const result = {};
      
        for (const objectPath in object) {
          const parts = objectPath.split('.');
      
          let target = result;
          while (parts.length > 1) {
            const part = parts.shift();
            target = target[part] = target[part] || {};
          }
      
          target[parts[0]] = object[objectPath]
        }
      
        return result;
    }
}
