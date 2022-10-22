import { Patch } from '@hykord/webpack/types';

export * from 'spitroast';

export const webpackPatches: Patch[] = [];

export const patchCss = (content: string, id?: string) => {
    const style = Object.assign(
        document.createElement('style'),
        {
          className: `HYKORD_INJECTED_CSS${id ? `_${id}` : ''}`,
          textContent: content
        }
    );
    
    document.head.appendChild(style);
}

export const unpatchCss = (id: string) => {
  for (const css of Array.from(document.getElementsByClassName(`HYKORD_INJECTED_CSS${id ? `_${id}` : ''}`)))
    css.remove();
}

export const patchPlaintext = async(plugin: string, patches: Patch[]) => {
  for (const patch of patches) {
    patch.plugin = plugin;

    if (patch.condition) {
      if (await patch.condition()) webpackPatches.push(patch);
    } else webpackPatches.push(patch);
  }
}