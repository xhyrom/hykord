const { Plugin } = require("powercord/entities");
const { askRestart } = require("./restart");

module.exports = class HykordLoader extends Plugin {
  async startPlugin() {
    global.__hykord__platform__loader = 'powercord';

    require(`${process.env.HOME || process.env.USERPROFILE}/.hykord/install/hykord/ipc/renderer`);
    const Hykord = require('${process.env.HOME || process.env.USERPROFILE}/.hykord/install/hykord/index');
    window.hykord = new Hykord.Hykord();
  }
  pluginWillUnload() {
    askRestart(this._load());
  }
};