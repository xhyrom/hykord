const llc = "__LOADABLE_LOADED_CHUNKS__";

export default (key) => {
  key ??= Object.keys(window).find((key) => key.includes("Jsonp"));
  key ??= window[llc] && llc;

  if (!window[key]) return;

  const wjp =
    typeof window[key] === "function"
      ? window[key]
      : (...args) => window[key].push(args);

  let wpRequire;
  wjp(
    [Symbol()],
    {
      get: (_m, _, wpRq) => (wpRequire = wpRq),
    },
    [["get"]]
  );

  delete wpRequire.m.get;
  delete wpRequire.c.get;
  return [wpRequire.c, wpRequire];
};
