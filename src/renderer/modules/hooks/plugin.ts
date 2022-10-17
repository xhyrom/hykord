import { Addon } from '@hykord/hooks';
import { Patch } from '@hykord/webpack/types';

export const $plugin = <T extends PluginInfo>(p: T) => {
    p.$toggleable = p.$toggleable ?? true;
    p.$internal = p.$internal ?? false;
    p.$cleanName = p.$cleanName ?? p.name.replace(/[^a-z0-9]/gi, '').toLowerCase();

    return p;
}

export enum PluginSettingType {
    'Boolean',
    'Number',
    'String',
    'Color',
    'Select',
}

export interface PluginSetting {
    type: PluginSettingType;
    name: string;
    description: string;
    defaultValue: any;
}

export interface PluginInfo extends Addon {
    start?(): void;
    stop?(): void;

    patches?: Patch[];
    settings?: PluginSetting[];
    dependsOn?: string[];
}