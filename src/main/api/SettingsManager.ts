import { join } from 'path';
import { deepen, convertToMap, Logger } from '@common';
import { writeFile, readFile, access } from 'fs/promises';

const exists = async(path: string) => {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

const readAndIfNotExistsCreate = async(path: string, fallback: string): Promise<string> => {
    const exist = await exists(path);
    if (exist) return (await readFile(path)).toString();
    
    await writeFile(path, fallback);

    return fallback;
}

export type PossibleSettingValue = string | boolean | number | string[] | undefined | null;
export type KnownSettings = 'hykord.quickCss';

export class SettingsManager {
    private readonly location: string;
    private settings: Map<KnownSettings, PossibleSettingValue> = new Map();

    constructor(location: string) {
        Logger.debug('Constructing SettingsManager');

        this.location = join(location, 'settings.json');

        this.init();
    }

    private async init() {
        const config = await readAndIfNotExistsCreate(
            this.location,
            JSON.stringify({})
        )

        this.settings = convertToMap(JSON.parse(config));
    }

    public getSetting(name: KnownSettings, defaultValue?: PossibleSettingValue): PossibleSettingValue {
        return this.settings.get(name) || defaultValue;
    }

    public async save() {
        await writeFile(this.location, JSON.stringify(deepen(this.settings)));
    }
}

/*export default (location: string) => {
    // I know this is very bad but nevermind
    /*const settingsClass = new SettingsManager(location);
    const object = {};

    for (const name of Object.getOwnPropertyNames(Object.getPrototypeOf(settingsClass))) {
        if (name === 'constructor' || name === 'init' || name === 'convertToMap') continue;
        // @ts-expect-error - look above
        object[name] = settingsClass[name];
    }

    // @ts-expect-error - look above
    object.__proto__ = settingsClass.__proto__;

    return object as SettingsManager;*/
/*    return new SettingsManager(location);
}*/