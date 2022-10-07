import { Theme } from '@hykord/structures';
import { LoaderLogger as Logger } from '@common';
import { quickCss } from '../utils';
import { patchCss } from '@hykord/patcher';
import type { ITheme } from '@hykord/structures/Theme';
const { join } = window.require<typeof import('path')>('path');
const { readdir, exists, mkdir, readAndIfNotExistsCreate, readFile } = window.require<typeof import('../../preload/polyfill/fs/promises')>('fs/promises');

export const themes: ITheme[] = [];

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
        if (file.endsWith('.css')) {
            try {
                const css = await readFile(join(directory, file));

                // Parse metadata
                addTheme({
                    name: file,
                    version: '1.0.0',
                    author: 'Hykord',
                    start: () => css.toString(),
                })
            } catch(error: any) {
                Logger.err(`Failed to load theme ${file}: ${error.message}`);
            }
        }
            
        try {
            const themeExports = await import(join(directory, file));
            addTheme(themeExports.default ? new themeExports.default() : new themeExports());
        } catch(error: any) {
            Logger.err(`Failed to load theme ${file}: ${error.message}`);
        }
    }

    for (const theme of themes) {
        Logger.info('Loading theme', theme.name);
        patchCss(theme.start(), theme.cssId ?? theme.name);
        Logger.info('Theme', theme.name, 'has been loaded!');
    }

    document.removeEventListener('DOMContentLoaded', load);
}

export const init = () => {
    document.addEventListener('DOMContentLoaded', load);
}

export const addTheme = async(theme: Theme) => {
    themes.push(theme);
}