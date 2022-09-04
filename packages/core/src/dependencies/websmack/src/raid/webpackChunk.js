export default (key) => {
  key ??= Object.keys(window).find((key) => key.startsWith("webpackChunk"));

  if (!window[key]) return;

  let wpRequire;

  window[key].push([
    [Symbol()],
    {},
    (e) => {
      wpRequire = e;
    },
  ]);

  window[key].pop();

  return [(
    wpRequire.c ??
    // wow thats jank lmao
    Object.fromEntries(
      Object.entries(wpRequire.m).map(([k]) => [
        k,
        { id: k, loaded: true, exports: wpRequire(k) },
      ])
    )
  ), wpRequire];
};
