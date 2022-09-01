import { initUserSettings, registerSection } from "@hykord/api/ui/userSettingsHykord"
import Options from "./components/Options"
import Plugins from "./components/Plugins";

export default async() => {
    registerSection("HYKORD_OPTIONS", "Options", await Options());
    registerSection("HYKORD_PLUGINS", "Plugins", await Plugins());

    initUserSettings();
}