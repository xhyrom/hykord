import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { nameToId } from '@hykord/utilities';
import { Plugin } from '@hykord/structures'

let Logger = null;
export const BASE_URL = 'https://xhyrom-utils.github.io/hykord-plugins';

export interface PartialPlugin {
	name: string;
	description: string;
	author: string;
	path: string;
}

export const downloadPlugin = async(plugin: PartialPlugin) => {
    let index: any = await fetch(`${BASE_URL}/${plugin.path}/dist/index.js`);
    // @ts-expect-error missing hykord types, must create @xhyrom/hykord-types pkg
    const pluginDirectory = join(window.hykord.plugins.location, nameToId(plugin.name));

	if (!index.ok) {
		// TODO: add toast notifications
		Logger.err(`Failed to download plugin - `, index);
		return false;
	}

	console.log(index, `${BASE_URL}/${plugin.path}/dist/index.js`);
	index = await index.text();
	await mkdir(join(pluginDirectory, 'dist'), { recursive: true });
	await writeFile(join(pluginDirectory, 'dist', 'index.js'), index);

	Logger.info(`Plugin ${plugin.name} has been successfully installed!`);

	// @ts-expect-error same as above
	await window.hykord.plugins.initializePlugin(nameToId(plugin.name));
	// @ts-expect-error same as above
	await window.hykord.plugins.loadPlugin(window.hykord.plugins.getPlugin(plugin.name) || window.hykord.plugins.getPlugin(nameToId(plugin.name)));

	return true;
}

export const init = (plugin: Plugin) => {
	Logger = plugin.logger;
}