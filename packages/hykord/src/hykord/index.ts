import '@dependency/module-alias/register';
import ui from './ui/init';
import { webFrame } from 'electron';
import Logger from '@hykord/logger';
import { SettingsManager } from './managers/Settings';
import { mkdirIfNotExists } from '@hykord/fs/promises';
import { PluginsManager } from './managers/Plugins';
import { ThemesManager } from './managers/Themes';

export class Hykord {
  folder: string;
  settings: SettingsManager;
  plugins: PluginsManager;
  themes: ThemesManager;

  constructor() {
    this.folder = null;
    this.settings = new SettingsManager();
    this.plugins = new PluginsManager();
    this.themes = new ThemesManager();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  private async init() {
    await this.waitForWebpack();

    this.folder = `${process.env.HOME || process.env.USERPROFILE}/.hykord`;
    await mkdirIfNotExists(this.folder, window.GLOBAL_ENV.RELEASE_CHANNEL); // Create main .hykord folder

    await this.settings.init(); // Init settings manager
    await this.plugins.init(); // Init & load plugins
    await this.themes.init(); // Init & load themes
    ui(); // Inject UI
  }

  private async waitForWebpack() {
    // Hackable way - need to wait for webpack fill
    await webFrame.executeJavaScript(
      `(function () { async function init() { while (!window.webpackChunkdiscord_app || !window._) { await new Promise((resolve) => setTimeout(resolve, 100)); } } return init() }())`,
    );
    Logger.info('Webpack has been filled.');
  }
}
