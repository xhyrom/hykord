import { Theme } from "@hykord/structures";
import { join } from "path";

new Theme({
	name: "example-theme",
	author: "Example Author",
	description: "Everyone loves example themes",
	onEnable: () => {
		return join(__dirname, "index.css");
	}
})
