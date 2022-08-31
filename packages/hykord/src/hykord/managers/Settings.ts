import { readAndIfNotExistsCreate } from '@module/fs/promises';
import { writeFile } from 'fs/promises';

type HykordSettings =
    'discord.experiments' |
    'discord.allow_nsfw';

interface HykordSetting {
    type: 'bool' | 'string';
    value: boolean | string;
    description: string;
}

export class SettingsManager {
    private location: string;
    private settings: Map<HykordSettings, HykordSetting>;
    private modules: {
        patcher: any;
        webpack: any;
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
            JSON.stringify({
                discord: {
                    experiments: {
                        type: 'bool',
                        value: false,
                        description: 'Enable discord experiments',
                    },
                    allow_nsfw: {
                        type: 'bool',
                        value: false,
                        description: 'Allow nsfw channels (also bypass age requirement)',
                    },
                }
            })
        )

        this.settings = this.convertToMap(JSON.parse(config));
        for (const settingKey of Array.from(this.settings.keys())) {
            this.postHandle(settingKey, true);
        }

        return this;
    }

    public getSetting(name: HykordSettings): HykordSetting {
        return this.settings.get(name);
    }

    public getSettingValue(name: HykordSettings): string | boolean {
        return this.settings.get(name).value;
    }

    public toggleSetting(name: HykordSettings): boolean {
        const old = this.getSetting(name);
        return this.setSetting(name, !old.value, old.description, old.type) as boolean;
    }

    public setSetting(name: HykordSettings, value: string | boolean, description: string, type?: any): string | boolean {
        this.settings.set(name, {
            value,
            type: type || typeof value === 'boolean' ? 'bool' : 'string',
            description,
        });

        writeFile(this.location, JSON.stringify(this.deepen(this.settings)));
        return value;
    }

    public getAllSettings(): Map<HykordSettings, HykordSetting> {
        return this.settings;
    }

    public postHandle(name: HykordSettings, first?: boolean): void {
        const setting = this.getSetting(name);

        switch(name) {
            case 'discord.allow_nsfw': {
                const patch = () => {
                    this.modules.patcher.findAndPatch(
                        () => this.modules.webpack.findByProps('getUsers'),
                        (User) => this.modules.patcher.after("getCurrentUser", User, (_, user) => {
                            user.nsfwAllowed = setting.value;
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
                        // @ts-ignore-expect It works
                        nodes.find(x => x.name == "ExperimentStore").actionHandler["OVERLAY_INITIALIZE"]({user: {flags: 1}});
                    } catch {}
    
                    const oldUser = usermod.getCurrentUser;
                    usermod.getCurrentUser = () => ({hasFlag: () => true});
                    // @ts-ignore-expect It works
                    nodes.find(x => x.name == "DeveloperExperimentStore").actionHandler["CONNECTION_OPEN"]();
                    usermod.getCurrentUser = oldUser;
                }

                if (first && setting.value) {
                    const method = () => {
                        patch();
                        this.modules.webpack.FluxDispatcher.unsubscribe('CONNECTION_OPEN', method);
                    };

                    this.modules.webpack.FluxDispatcher.subscribe('CONNECTION_OPEN', method);
                } else if (setting.value) {
                    patch();
                }
                break;
            }
            default: {

            }
        }
    }

    private convertToMap(object: any, key?: string, map?: Map<HykordSettings, HykordSetting>) {
        map = map || new Map();
    
        for (const [name, v] of Object.entries(object)) {
            const value = v as HykordSetting;

            if (typeof value !== 'object') map.set(key + name as HykordSettings, value);
            else {
                if (value.type !== undefined && value.value !== undefined && value.description !== undefined) map.set(key + name as HykordSettings, value);
                else this.convertToMap(value, `${key ? `${key}` : ''}${name}.`, map);
            }
        }
    
        return map;
    }

    private deepen = (map: any) => {
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
