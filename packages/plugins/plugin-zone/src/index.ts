import { Plugin } from '@hykord/structures';
import { registerSection, unregisterSection } from '@hykord/utilities';
import { injectCss, uninjectCssById } from '@hykord/patcher';
import { init } from './utils';

import index from './components';

new Plugin({
	name: 'Plugin Zone',
	author: 'xHyroM',
	description: 'Place for verified hykord plugins',
	onEnable: async(plugin) => {
		init(plugin);
		registerSection('HYKORD_PLUGIN_PLUGIN_ZONE', 'Plugin Zone', await index());

		injectCss('.hykord-plugin-zone-cards{gap: 10px}', 'HYKORD_PLUGIN_PLUGIN_ZONE');
	},
	onDisable: () => {
		unregisterSection('HYKORD_PLUGIN_PLUGIN_ZONE');

		uninjectCssById('HYKORD_PLUGIN_PLUGIN_ZONE');
	}
})
