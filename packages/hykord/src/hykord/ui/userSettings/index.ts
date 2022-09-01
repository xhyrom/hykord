import { injectCss } from "@hykord/api/modules/patcher";
import { initUserSettings, registerSection } from "@hykord/api/ui/userSettingsHykord"
import Options from "./components/Options"
import Plugins from "./components/Plugins";
import Test from "./components/Test";

export default async() => {
    injectCss('.hykord-plugin-card{padding: 16px;margin-bottom: 10px;}.hykord-form-divider{margin-top:10px;margin-bottom:10px}'); // Simple CSS - Add padding for plugin card & margin for divider

    registerSection("HYKORD_OPTIONS", "Options", await Options());
    registerSection("HYKORD_PLUGINS", "Plugins", await Plugins());
    if (window.hykord.settings.getSetting('hykord.enable_dev_experiment_mod', false)) registerSection("HYKORD_DEV_EXPERIMENT_MOD_TEST", "Test", await Test());

    initUserSettings();
}