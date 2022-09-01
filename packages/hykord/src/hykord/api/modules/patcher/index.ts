import { findAsync } from "@module/webpack";

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

export const injectCss = (css: string) => {
  const style = Object.assign(
    document.createElement('style'),
    {
      className: 'HYKORD_INJECTED_CSS',
      textContent: css,
    }
  );

  document.head.appendChild(style);

  return (newCss) => {
    if (!newCss) style.remove();
    else style.textContent = newCss;
  }
}

export const unpatchCss = () => {
  for (const css of Array.from(document.getElementsByClassName('HYKORD_INJECTED_CSS')))
    css.remove();
}

export { instead, before, after, unpatchAll } from "@dependency/spitroast";
