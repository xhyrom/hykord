import { Theme } from '@hykord/structures';
import { LoaderLogger as Logger } from '@common';
import { quickCss, getMetadata } from '../utils';
import { patchCss, unpatchCss } from '@hykord/patcher';
import type { ITheme } from '@hykord/structures/Theme';
const { join } = window.require<typeof import('path')>('path');
const { readdir, exists, mkdir, readAndIfNotExistsCreate, readFile } =
  window.require<typeof import('../../preload/polyfill/fs/promises')>(
    'fs/promises'
  );

export const themes: ITheme[] = [];

export const loadQuickCss = async () => {
  quickCss.load(
    await readAndIfNotExistsCreate(join(Hykord.directory, 'quickCss.css'))
  );
};

const load = async () => {
  // Load internal themes
  await import('../themes');

  // Load quickCss
  if (await HykordNative.getManagers().getSettings().get('hykord.quick-css'))
    await loadQuickCss();

  // Load external themes
  const directory = join(HykordNative.getDirectory(), 'themes');
  if (!(await exists(directory))) await mkdir(directory);

  for (const file of await readdir(directory)) {
    if (file.endsWith('.css')) {
      try {
        const css = await readFile(join(directory, file), {
          encoding: 'utf-8',
        });
        const metadata = getMetadata(css);

        // Parse metadata
        addTheme({
          name: metadata.name,
          description: metadata.description,
          version: metadata.version,
          author: metadata.author,
          license: metadata.license,
          cssId: metadata.cssId,
          $toggleable: true,
          start: () => css.toString(),
        });
      } catch (error: any) {
        Logger.err(`Failed to load theme ${file}: ${error.message}`);
      }
    } else {
      try {
        const module = { filename: file, exports: {} as any };
        const fileContent = await readFile(join(directory, file), 'utf-8');
        
        const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', fileContent);
        fn(window.require, module, module.exports, module.filename, directory, fileContent);
  
        addTheme(new module.exports());
      } catch (error: any) {
        Logger.err(`Failed to load theme ${file}: ${error.message}`);
      }
    }
  }

  for (const theme of themes) {
    if (theme.$toggleable && !(await HykordNative.getManagers().getSettings().get('hykord.enabled.themes', new Set())).has(theme.$cleanName!)) continue;

    toggleTheme(theme);
  }

  document.removeEventListener('DOMContentLoaded', load);
};

export const init = () => {
  document.addEventListener('DOMContentLoaded', load);
};

export const addTheme = async (theme: Theme) => {
  theme.$cleanName = theme.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  themes.push(theme);
};

export const enableTheme = (theme: Theme) => {
  Logger.info('Loading theme', theme.name);

  theme!.$enabled = true;
  patchCss(theme.start(), theme.cssId ?? theme.name);

  Logger.info('Theme', theme.name, 'has been loaded!');
};

export const disableTheme = (theme: Theme) => {
  Logger.info('Unloading theme', theme.name);

  theme!.$enabled = false;
  unpatchCss(theme.cssId ?? theme.name);

  Logger.info('Theme', theme.name, 'has been unloaded!');
};

export const toggleTheme = (theme: Theme) => {
  if (theme.$enabled) disableTheme(theme);
  else enableTheme(theme);
};
