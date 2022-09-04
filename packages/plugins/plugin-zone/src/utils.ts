import { join } from 'path';

export const BASE_URL = 'https://xhyrom-utils.github.io/hykord-plugins';

export interface PartialPlugin {
	name: string;
	description: string;
	author: string;
	path: string;
}

export const downloadPlugin = async(plugin: PartialPlugin) => {
    const index = await fetch(`${plugin.path}/dist/index.js`);
    // @ts-expect-error
    const pluginDirectory = join(window.hykord.plugins.location, '')
}