import Logger from "@module/logger";

export default () => {
    Logger.info("UI injected");

    const userSettings = require("./userSettings/index").default;
    userSettings();
}