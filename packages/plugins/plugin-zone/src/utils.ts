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
	version: string;
	path: string;
}

export const downloadPlugin = async(plugin: PartialPlugin, update: boolean) => {
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

	if (update) {
		await window.hykord.plugins.disablePlugin(window.hykord.plugins.getAllPlugins().find(p => p.name.toLowerCase() === nameToId(plugin.name) || p.name.toLowerCase() === plugin.name.toLowerCase()));
	}

	await window.hykord.plugins.initializePlugin(nameToId(plugin.name));
	
	// Update version
	const hykordPlugin = window.hykord.plugins.getPlugin(plugin.name) || window.hykord.plugins.getPlugin(nameToId(plugin.name));
	hykordPlugin.version = plugin.version;

	await window.hykord.plugins.loadPlugin(hykordPlugin || hykordPlugin);
	window.hykord.plugins.register(hykordPlugin);

	return true;
}

export const init = (plugin: Plugin) => {
	Logger = plugin.logger;
}