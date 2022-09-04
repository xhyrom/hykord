import { Plugin } from '@hykord/structures';
import { registerSection, unregisterSection } from '@hykord/utilities';
import { injectCss, uninjectCssById } from '@hykord/patcher';

import index from './components';

new Plugin({
	name: 'plugin-zone',
	author: 'xHyroM',
	description: 'Place of verified hykord plugins',
	onEnable: async() => {
		registerSection('HYKORD_PLUGIN_PLUGIN_ZONE', 'Plugin Zone', await index());

		injectCss('.hykord-plugin-zone-cards{gap: 10px}', 'HYKORD_PLUGIN_PLUGIN_ZONE');
	},
	onDisable: () => {
		unregisterSection('HYKORD_PLUGIN_PLUGIN_ZONE');

		uninjectCssById('HYKORD_PLUGIN_PLUGIN_ZONE');
	}
})
