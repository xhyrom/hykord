import '@dependency/module-alias/register';
import ui from './ui/init';
import { webFrame } from 'electron';
import Logger from '@hykord/logger';
import { mkdirIfNotExists } from '@hykord/fs/promises';
import { EventEmitter } from 'events';

export enum HykordEvents {
  NOTIFICATION_SEND = 'notification_send',
  NOTIFICATION_CLOSED = 'notification_closed',
  TOAST_SEND = 'tost_send',
  TOAST_CLOSED = 'toast_closed',
}

export class Hykord {
  public folder: string;
  public settings: import('./managers/Settings').SettingsManager;
  public plugins: import('./managers/Plugins').PluginsManager;
  public themes: import('./managers/Themes').ThemesManager;
  public events: EventEmitter = new EventEmitter();

  constructor() {
    this.folder = null;
    this.settings = null;
    this.plugins = null;
    this.themes = null;

    this.init();
  }

  private async init() {
    await this.waitForWebpack();

    this.folder = `${process.env.HOME || process.env.USERPROFILE}/.hykord`;
    await mkdirIfNotExists(this.folder, window.GLOBAL_ENV.RELEASE_CHANNEL); // Create main .hykord folder

    // Must initialize after webpack
    const { SettingsManager } = await import('./managers/Settings');
    const { PluginsManager } = await import('./managers/Plugins');
    const { ThemesManager } = await import('./managers/Themes');
    this.settings = new SettingsManager();
    this.plugins = new PluginsManager();
    this.themes = new ThemesManager();

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
