import { initUserSettings, registerSection } from "@api/ui/userSettingsHykord"
import Options from "./components/Options"
import Plugins from "./components/Plugins";
import Themes from "./components/Themes";
import Test from "./components/experiments/Test";

export default async() => {
    registerSection("HYKORD_OPTIONS", "Options", await Options());
    registerSection("HYKORD_PLUGINS", "Plugins", await Plugins());
    registerSection("HYKORD_THEMES", "Themes", await Themes());
    if (window.hykord.settings.getSetting('hykord.enable_dev_experiment_mod', false))
        registerSection("HYKORD_DEV_EXPERIMENT_MOD_TEST", "Test", await Test());

    initUserSettings();
}