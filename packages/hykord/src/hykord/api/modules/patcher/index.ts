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

export { instead, before, after, unpatchAll } from "@dependency/spitroast";
