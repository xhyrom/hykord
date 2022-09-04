import { Plugin } from "@hykord/structures";
import { registerSection, unregisterSection } from "@hykord/utilities";
import index from "./components";

new Plugin({
	name: "plugin-zone",
	author: "xHyroM",
	description: "Place of verified hykord plugins",
	onEnable: async() => {
		registerSection("HYKORD_PLUGIN_PLUGIN_ZONE", "Plugin Zone", await index());
	},
	onDisable: () => {
		unregisterSection("HYKORD_PLUGIN_PLUGIN_ZONE");
	}
})
