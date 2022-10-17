import { Addon } from '@hykord/hooks';

export const $theme = <T extends ThemeInfo>(t: T) => {
    t.$toggleable = t.$toggleable ?? true;
    t.$internal = t.$internal ?? false;
    t.$cleanName = t.$cleanName ?? t.name.replace(/[^a-z0-9]/gi, '').toLowerCase();

    return t;
}

export interface ThemeInfo extends Addon {
    start(): string;
    cssId?: string;
}