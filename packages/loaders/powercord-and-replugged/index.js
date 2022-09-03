const { Plugin } = require("powercord/entities");
const { askRestart } = require("./restart");

module.exports = class HykordLoader extends Plugin {
  async startPlugin() {
    global.__hykord__platform__loader = 'powercord';

    require('/home/hyro/workspace/xHyroM/MultiLanguage/Projects/hykord/packages/hykord/dist/hykord/ipc/renderer');
    const Hykord = require('/home/hyro/workspace/xHyroM/MultiLanguage/Projects/hykord/packages/hykord/dist/hykord/index');
    window.hykord = new Hykord.Hykord();
  }
  pluginWillUnload() {
    askRestart(this._load());
  }
};