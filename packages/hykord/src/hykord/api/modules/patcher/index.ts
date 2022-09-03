import { findAsync } from "@hykord/webpack";
//import { nameToId } from "@hykord/utilities";

export const findAndPatch = (moduleFinder, patchCallback) => {
  let cancelled = false;
  let unpatch;

  const [modPromise, webpackUnpatch] = findAsync(moduleFinder, false);

  modPromise.then((mod) => {
    if (!cancelled) unpatch = patchCallback(mod);
  });

  return () => {
    cancelled = true;
    webpackUnpatch?.();
    unpatch?.();
  };
};

export const injectCss = (css: string, id?: string) => {
  const style = Object.assign(
    document.createElement('style'),
    {
      className: `HYKORD_INJECTED_CSS${id ? `-${id.replaceAll(' ', '-')}` : ''}`,
      textContent: css,
    }
  );

  document.head.appendChild(style);

  return (newCss) => {
    if (!newCss) style.remove();
    else style.textContent = newCss;
  }
}

export const uninjectCssById = (id: string) => {
  for (const css of Array.from(document.getElementsByClassName(`HYKORD_INJECTED_CSS-${id.replaceAll(' ', '-')}`)))
    css.remove();
}

export const unpatchCss = () => {
  for (const css of Array.from(document.getElementsByClassName('HYKORD_INJECTED_CSS')))
    css.remove();
}

export { instead, before, after, unpatchAll } from "@dependency/spitroast";
