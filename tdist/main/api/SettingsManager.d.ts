import { KnownSettings } from '@common';
export declare type PossibleSettingValue = string | boolean | number | string[] | Set<string> | undefined | null;
export declare class SettingsManager {
    private readonly location;
    private settings;
    constructor(location: string);
    getSetting(name: KnownSettings, defaultValue?: PossibleSettingValue): PossibleSettingValue;
    setSetting(name: KnownSettings, value: PossibleSettingValue): Map<KnownSettings, PossibleSettingValue>;
    deleteSetting(name: KnownSettings): void;
    addToSetting(name: KnownSettings, value: PossibleSettingValue): Map<KnownSettings, PossibleSettingValue>;
    removeFromSetting(name: KnownSettings, value: PossibleSettingValue): Map<KnownSettings, PossibleSettingValue>;
    save(): Promise<void>;
}
declare const _default: SettingsManager;
export default _default;
