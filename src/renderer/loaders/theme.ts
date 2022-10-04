import { Theme } from '@hykord/structures';
import { LoaderLogger as Logger } from '@common';
import { quickCss } from '../utils';
import { patchCss } from '@hykord/patcher';
const { join } = window.require<typeof import('path')>('path');
const { readdir, exists, mkdir, readAndIfNotExistsCreate } = window.require<typeof import('../../preload/polyfill/fs/promises')>('fs/promises');

export const themes: Theme[] = [];

export const loadQuickCss = async () => {
    quickCss.load(await readAndIfNotExistsCreate(join(Hykord.directory, 'quickCss.css')));
};

const load = async() => {
    // Load internal themes
    await import('../themes');

    // Load quickCss
    if (await HykordNative.getManagers().getSettings().get('hykord.quick-css')) await loadQuickCss();

    // Load external themes
    const directory = join(HykordNative.getDirectory(), 'themes');
    if (!(await exists(directory))) await mkdir(directory);

    for (const file of await readdir(directory)) {
        const themeExports = await import(join(directory, file));
        addTheme(themeExports.default ? new themeExports.default() : new themeExports());
    }

    for (const theme of themes) {
        Logger.info('Loading', theme.internal ? 'internal' : '' ,'theme', theme.name);
        patchCss(theme.start(), theme.cssId ?? theme.name);
        Logger.info('Theme', theme.name, 'has been loaded!');
    }

    document.removeEventListener('DOMContentLoaded', load);
}

export const init = () => {
    document.addEventListener('DOMContentLoaded', load);
}

export const addTheme = async(theme: Theme, internal: boolean = false) => {
    theme.internal = internal;
    themes.push(theme);
}