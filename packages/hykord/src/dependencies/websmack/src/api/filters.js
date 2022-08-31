// filters originating from cumcord
export const byProps = (props) => (m) => props.every((p) => m[p] !== undefined);

export const byProtos = (protos) => (m) => m.prototype && protos.every((p) => m.prototype[p] !== undefined)

export const byDisplayName =
  (name, defaultExp = true) =>
  (m) =>
    (defaultExp ? m.displayName : m.default?.displayName) === name;

export const byKeyword = (strs) => (m) =>
  strs.every((s) =>
    Object.keys(m).some((k) => k.toLowerCase().includes(s.toLowerCase()))
  );

export const byDispNameDeep = (name) => (m) => {
  const regex = new RegExp(`(${name}$)|((\\w+\\()+${name}\\))`);

  if (regex.test(m.displayName)) return true;

  // start unwrapping funky react stuff
  if (typeof m.$$typeof !== "symbol") return;

  // we don't care about react.context
  if (m.Consumer !== undefined) return;

  // memo -> m.type
  // forwardref -> m.render
  if (m.type || m.render) {
    while (typeof m.type === "object" || typeof m.render === "object")
      m = m.type ?? m.render;

    if (regex.test(m.type?.displayName)) return true;
    if (regex.test(m.render?.displayName)) return true;
  }
};

// util
const isKeyable = (m) => typeof m === "object" || typeof m === "function";

// filters originating from kaihax
export const byNestedProps = (props) => (m) =>
  isKeyable(m) &&
  Object.values(m).some(
    (v) => isKeyable(v) && props.some((p) => v?.[p] !== undefined)
  );

// this one is different to all the others, but it is what it is
export const allByCode = (modules, loaders) => (code) =>
  Object.entries(loaders)
    .filter(([, m]) => m.toString().match(code))
    .map(([id]) => modules[id]?.exports)
    .filter((m) => m);
