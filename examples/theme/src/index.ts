import { Theme } from "@hykord/structures";
import { join } from "path";

// Something like manifest
new Theme({
	name: "example-theme",
	author: "Example Author",
	description: "Everyone loves example themes",
	version: "1.0.0",
	license: "MIT",
	onEnable: () => {
		return join(__dirname, "index.css");
	}
})
