import { PluginInfo } from '@hykord/hooks';
import { Patch } from '@hykord/webpack/types';
import { LoaderLogger as Logger } from '@common';
import { BetterSet } from '@hykord/utils';
import { webpackPatches } from '@hykord/patcher';

export const plugins: BetterSet<PluginInfo> = new BetterSet();

const load = async () => {
  // Load internal plugins
  await import('../plugins');

  for (const file of await HykordNative.getAddons().getPlugins().list()) {
    try {
      const pl = (await import(`hykord://plugin/${file}`)).default;
      pl.$fileName = file;

      addPlugin(pl);
    } catch (error: any) {
      Logger.err(`Failed to load plugin ${file}: ${error.message}`);
    }
  }

  for (const plugin of plugins) {
    if (plugin.$toggleable && !(await Hykord.Settings.get('hykord.enabled.plugins', new Set())).has(plugin.$cleanName!)) continue;

    togglePlugin(plugin);
  }

  document.removeEventListener('DOMContentLoaded', load);
};

export const init = async () => {
  document.addEventListener('DOMContentLoaded', load);
};

export const addPlugin = async (plugin: PluginInfo) => {
  if (
    plugin.patches &&
    (await Hykord.Settings.get('hykord.enabled.plugins', new Set())).has(plugin.$cleanName!)
  ) {
    for (const patch of plugin.patches) {
      patch.plugin = plugin.name!;
      if (!Array.isArray(patch.replacement)) patch.replacement = [patch.replacement];
      
      if (patch.condition) {
        if (await patch.condition()) webpackPatches.push(patch);
      } else webpackPatches.push(patch);
    }
  }
  
  plugins.add(plugin);

  plugins.sort((a, b) => a.name.localeCompare(b.name));
};

export const enablePlugin = async (plugin: PluginInfo) => {
  Logger.info('Loading plugin', plugin.name);

  try {
    await plugin.start?.();
    plugin!.$enabled = true;

    Logger.info('Plugin', plugin.name, 'has been loaded!');
  } catch (error: any) {
    Logger.err(`Failed to start plugin ${plugin.name}: ${error.message}`);
  }
};

export const disablePlugin = async (plugin: PluginInfo) => {
  Logger.info('Disabling plugin', plugin.name);

  try {
    await plugin.stop?.();
    plugin!.$enabled = false;

    Logger.info('Plugin', plugin.name, 'has been disabled!');
  } catch (error: any) {
    Logger.err(`Failed to stop plugin ${plugin.name}: ${error.message}`);
  }
};

export const removePlugin = async (plugin: PluginInfo) => {
  plugins.delete(plugin);
};

export const togglePlugin = async (plugin: PluginInfo) => {
  if (plugin.$enabled) await disablePlugin(plugin);
  else await enablePlugin(plugin);
};
