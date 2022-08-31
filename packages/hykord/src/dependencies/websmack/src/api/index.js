import * as filters from "./filters";
import batch from "./batch";

const filter =
  (modules, single = true) =>
  (filterFunc) => {
    const found = [];

    for (const mid in modules) {
      const module = modules[mid].exports;
      if (!module || module === window) continue;

      if (module.default && module.__esModule && filterFunc(module.default)) {
        if (single) return module.default;
        found.push(module.default);
      }

      if (filterFunc(module)) {
        if (single) return module;
        found.push(module);
      }
    }

    if (!single) return found;
  };

export default ([, modules, wpR]) => {
  const find = filter(modules);
  const findAll = filter(modules, false);

  const findByCodeAll = wpR
    ? filters.allByCode(modules, wpR.m)
    : () => {
        throw new Error("findByCode does not work with this bundler");
      };

  return {
    batchFind: batch(modules),

    find,
    findAll,

    findByProps: (...p) => find(filters.byProps(p)),
    findByPropsAll: (...p) => findAll(filters.byProps(p)),

    findByPrototypes: (...p) => find(filters.byProtos(p)),
    findByPrototypesAll: (...p) => findAll(filters.byProtos(p)),

    findByNestedProps: (...p) => find(filters.byNestedProps(p)),
    findByNestedPropsAll: (...p) => findAll(filters.byNestedProps(p)),

    findByDisplayName: (d, p) => find(filters.byDisplayName(d, p)),
    findByDisplayNameAll: (d, p) => findAll(filters.byDisplayName(d, p)),

    findByDispNameDeep: (d) => find(filters.byDispNameDeep(d)),
    findByDispNameDeepAll: (d) => findAll(filters.byDispNameDeep(d)),

    findByKeyword: (...k) => find(filters.byKeyword(k)),
    findByKeywordAll: (...k) => findAll(filters.byKeyword(k)),

    findByCodeAll,
    findByCode: (c) => findByCodeAll(c)[0],
  };
};

export const batchFind = ([, modules]) => batch(modules)