import { Plugin } from "@hykord/structures";
import { registerSection, unregisterSection } from "@hykord/utilities";
import Test from "./components/Test";

new Plugin({
	name: "example-plugin",
	author: "Example Author",
	description: "This is example plugin",
	onEnable: async(plugin) => {
		plugin.logger.info("Message from example plugin, ENABLED!!");
		registerSection("HYKORD_EXAMPLE_PLUGIN", "Example Plugin", await Test());
	},
	onDisable: (plugin) => {
		plugin.logger.info("Message from example plugin, DISABLED!!");
		unregisterSection("HYKORD_EXAMPLE_PLUGIN");
	}
})
