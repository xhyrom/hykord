import { Plugin } from '@hykord/structures';
import { findByDisplayName } from '@hykord/webpack';
import { findAndPatch, after } from '@hykord/patcher';
import { registerSection, unregisterSection } from '@hykord/utilities';
import Settings from './Settings';

new Plugin({
	name: 'Custom Volume Range',
	author: 'xHyroM',
	description: 'Allows you to set custom volume range over 200%',
	version: '0.1.0',
	onEnable: async(plugin) => {
		registerSection('HYKORD_PLUGIN_CUSTOM_VOLUME_RANGE', 'Custom Volume Range', await Settings());

		plugin.__unpatch__custom__volume__range = findAndPatch(
			() => findByDisplayName("Slider"),
			(Slider) => after("render", Slider.prototype, function(_, slider) {
				if (this.props) {
					const maxVolume = 400;
	
					this.props.maxValue = maxVolume;
					this.state.value = this.state.initialValueProp;
					this.state.max = maxVolume;
					this.state.range = this.state.max;
				}
		
				return slider;
			})
		)
	},
	onDisable: (plugin) => {
		unregisterSection('HYKORD_PLUGIN_CUSTOM_VOLUME_RANGE');

		plugin.__unpatch__custom__volume__range?.();
	}
})
