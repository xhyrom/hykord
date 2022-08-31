import { initUserSettings, registerSection } from "@hykord/api/ui/userSettings"
import Options from "./components/Options"

export default async() => {
    registerSection("HYKORD_OPTIONS", "Options", await Options());

    initUserSettings();
}