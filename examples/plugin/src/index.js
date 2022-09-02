import { Plugin } from "structures";
import { registerSection, unregisterPluginSection } from "utilties";
import Logger from "logger";
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
