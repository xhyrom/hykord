import { Plugin } from "@hykord/structures";
import { registerSection, unregisterPluginSection } from "@hykord/utilties";
import Logger from "@hykord/logger";
import Test from "./components/Test";

new Plugin({
	name: "example-plugin",
	author: "Example Author",
	description: "This is example plugin",
	onEnable: async() => {
		Logger.info("Message from example plugin, ENABLED!!");
		registerSection("HYKORD_EXAMPLE_PLUGIN", "Example Plugin", await Test());
	},
	onDisable: () => {
		Logger.info("Message from example plugin, DISABLED!!");
		unregisterPluginSection("HYKORD_EXAMPLE_PLUGIN");
	}
})
