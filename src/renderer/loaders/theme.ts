import { ThemeInfo } from '@hykord/hooks';
import { LoaderLogger as Logger } from '@common';
import { quickCss, getMetadata, BetterSet } from '@hykord/utils';
import { patchCss, unpatchCss } from '@hykord/patcher';

export const themes: BetterSet<ThemeInfo> = new BetterSet();
export const directory = HykordNative.getAddons().getThemes().directory;

export const loadQuickCss = async () => {
  quickCss.load(await HykordNative.getAddons().getThemes().getQuickCss());
};

const load = async () => {
  // Load internal themes
  await import('../themes');

  if (await Hykord.Settings.get('hykord.quick-css')) await loadQuickCss();

  for (const file of await HykordNative.getAddons().getThemes().list()) {
    try {
      const css = await HykordNative.getAddons().getThemes().get(file);
      // Parse metadata
      const metadata = getMetadata(css);

      addTheme({
        name: metadata.name,
        description: metadata.description,
        version: metadata.version,
        author: metadata.author,
        license: metadata.license,
        cssId: metadata.cssId,
        $toggleable: true,
        $fileName: file,
        start: () => css.toString(),
      });
    } catch (error: any) {
      Logger.err(`Failed to load theme ${file}: ${error.message}`);
    }
  }

  for (const theme of themes) {
    if (theme.$toggleable && !(await Hykord.Settings.get('hykord.enabled.themes', new Set())).has(theme.$cleanName!)) continue;

    enableTheme(theme);
  }

  document.removeEventListener('DOMContentLoaded', load);
};

export const init = () => {
  document.addEventListener('DOMContentLoaded', load);
};

export const addTheme = async (theme: ThemeInfo) => {
  theme.$cleanName = theme.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  themes.add(theme);

  // Put internal theme top
  themes.sort((a, b) => (a.$internal || b.$internal) ? Number(b.$internal) - Number(a.$internal) : a.name.localeCompare(b.name));
};

export const enableTheme = (theme: ThemeInfo) => {
  Logger.info('Loading theme', theme.name);

  theme!.$enabled = true;
  patchCss(theme.start(), theme.cssId ?? theme.name);

  Logger.info('Theme', theme.name, 'has been loaded!');
};

export const disableTheme = (theme: ThemeInfo) => {
  Logger.info('Unloading theme', theme.name);

  theme!.$enabled = false;
  unpatchCss(theme.cssId ?? theme.name);

  Logger.info('Theme', theme.name, 'has been unloaded!');
};

export const removeTheme = async (theme: ThemeInfo) => {
  themes.delete(theme);
};

export const toggleTheme = (theme: ThemeInfo) => {
  if (theme.$enabled) disableTheme(theme);
  else enableTheme(theme);
};