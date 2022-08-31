import * as filters from "./filters";

const batchFilter = (modules, filterList) => {
  const found = [];

  const checkModule = (mod) =>
    filterList.forEach(([filter, multi], i) => {
      if (multi && !found[i]) found[i] = [];

      if (filter(mod)) {
        if (multi) found[i].push(mod);
        // only find the first
        else if (!found[i]) found[i] = mod;
      }
    });

  for (const mid in modules) {
    const module = modules[mid].exports;
    if (!module || module === window) continue;

    if (module.default && module.__esModule) checkModule(module.default);

    checkModule(module);
  }

  return found;
};

// [filter, all]
const makeFakeWp = (filterList) => ({
  find: (f) => filterList.push([f, false]),
  findAll: (f) => filterList.push([f, true]),

  findByProps: (...p) => filterList.push([filters.byProps(p), false]),
  findByPropsAll: (...p) => filterList.push([filters.byProps(p), true]),

  findByPrototypes: (...p) => filterList.push([filters.byProtos(p), false]),
  findByPrototypesAll: (...p) => filterList.push([filters.byProtos(p), true]),

  findByNestedProps: (...p) =>
    filterList.push([filters.byNestedProps(p), false]),
  findByNestedPropsAll: (...p) =>
    filterList.push([filters.byNestedProps(p), true]),

  findByDisplayName: (n, d) =>
    filterList.push([filters.byDisplayName(n, d), false]),
  findByDisplayNameAll: (n, d) =>
    filterList.push([filters.byDisplayName(n, d), true]),

  findByDispNameDeep: (n) =>
    filterList.push([filters.byDispNameDeep(n), false]),
  findByDispNameDeepAll: (n) =>
    filterList.push([filters.byDispNameDeep(n), true]),

  findByKeyword: (...s) => filterList.push([filters.byKeyword(s), false]),
  findByKeywordAll: (...s) => filterList.push([filters.byKeyword(s), true]),
});

export default (mods) => (cb) => {
  const fList = [];
  const fakeWp = makeFakeWp(fList);

  cb(fakeWp);

  return batchFilter(mods, fList);
};
