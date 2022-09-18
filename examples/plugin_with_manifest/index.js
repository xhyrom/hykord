const { Plugin } = require("@hykord/structures");

// MUST EXPORT
module.exports = new Plugin({
	onEnable: async(plugin) => {
		plugin.logger.info("Plugin with manifest has been enabled!!");
	},
	onDisable: (plugin) => {
		plugin.logger.info("Plugin with manifest has been disabled!!");
	}
})
