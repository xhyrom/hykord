export default Hykord.Hooks.$plugin({
    name: 'No Devtools Warning',
    author: 'xHyroM',
    version: '0.1.0',
    description: 'Removes the devtools warning.',
    restartRequired: true,

    start: () => {
        window?.DiscordNative?.window?.setDevtoolsCallbacks(null, null);
    }
});