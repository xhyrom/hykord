import { Plugin } from '@hykord/structures';
import { LoaderLogger as Logger } from '@common';
const { join } = window.require<typeof import('path')>('path');
const { readdir, exists, mkdir } = window.require<typeof import('../../preload/polyfill/fs/promises')>('fs/promises');

export const plugins: Plugin[] = [];

export const load = async() => {
    // Load internal plugins
    await import('../plugins');

    // Load external plugins
    const directory = join(HykordNative.getDirectory(), 'plugins');
    if (!(await exists(directory))) await mkdir(directory);

    for (const file of await readdir(directory)) {
        try {
            const pluginExports = await import(join(directory, file));
            addPlugin(pluginExports.default ? new pluginExports.default() : new pluginExports());
        } catch(error: any) {
            Logger.err(`Failed to load plugin ${file}: ${error.message}`);
        }
    }

    for (const plugin of plugins) {
        Logger.info('Loading plugin', plugin.name);
        plugin.start();
        Logger.info('Plugin', plugin.name, 'has been loaded!');
    }

    document.removeEventListener('DOMContentLoaded', load);
}

export const init = async() => {
    document.addEventListener('DOMContentLoaded', load);
}

export const addPlugin = async(plugin: Plugin) => {
    plugins.push(plugin);
}