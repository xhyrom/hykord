import { patchCss, unpatchCss } from '@hykord/patcher';

export const load = (quickCss: string) => {
  patchCss(quickCss, 'QUICK_CSS');
};

export const unload = () => unpatchCss('QUICK_CSS');
