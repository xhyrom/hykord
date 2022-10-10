const SettingsManager = HykordNative.getManagers().getSettings();

(async() => {
    if (await SettingsManager.get('hykord.disable-tracking')) {
        window.DiscordSentry.getCurrentHub().getClient().close();
        return;
    }
})();

export {};
