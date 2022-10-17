(async() => {
    if (await Hykord.Settings.get('hykord.disable-tracking')) {
        window.DiscordSentry.getCurrentHub().getClient().close();
        return;
    }
})();

export {};
