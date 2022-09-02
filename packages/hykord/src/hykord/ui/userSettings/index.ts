import { initUserSettings, registerSection } from "@hykord/api/ui/userSettingsHykord"
import Options from "./components/Options"
import Plugins from "./components/Plugins";
import Test from "./components/Test";

export default async() => {
    registerSection("HYKORD_OPTIONS", "Options", await Options());
    registerSection("HYKORD_PLUGINS", "Plugins", await Plugins());
    if (window.hykord.settings.getSetting('hykord.enable_dev_experiment_mod', false))
        registerSection("HYKORD_DEV_EXPERIMENT_MOD_TEST", "Test", await Test());

    initUserSettings();
}