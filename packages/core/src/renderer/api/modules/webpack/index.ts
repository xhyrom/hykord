import WebsMack from "@dependency/websmack";
/*const wpChunk = websmack.webpackChunk("webpackChunkdiscord_app");
export const modules = websmack.webpackChunk("webpackChunkdiscord_app")[1].c;

export const getModule = (module) => {
    for (const modId in modules) {
      const mod = modules[modId];
  
      if (mod?.exports === module) return mod;
      if (mod?.exports?.__esModule && mod?.exports?.default === module) return mod?.exports;
    }
};

export { default as findAsync } from "./findAsync";

export const {
    find,
    findAll,
    findByCode,
    findByCodeAll,
    findByDisplayName,
    findByDisplayNameAll,
    findByDispNameDeep,
    findByDispNameDeepAll,
    findByKeyword,
    findByKeywordAll,
    findByNestedProps,
    findByNestedPropsAll,
    findByProps,
    findByPropsAll,
    findByPrototypes,
    findByPrototypesAll,
    batchFind,
} = websmack.createApi([undefined, modules, wpChunk]);

export const React = findByProps("createElement");
export const Flux = findByProps("connectStores");
export const FluxDispatcher = findByProps("_currentDispatchActionType");
*/

export const findByDisplayName = WebsMack.getByDisplayName;
export const findByProps = WebsMack.getByProps;
export { default as findAsync } from "./findAsync";

export const React = WebsMack.getByProps("createElement", "cloneElement");
export const Flux = WebsMack.getByProps("connectStores");
export const FluxDispatcher = WebsMack.getByProps("_currentDispatchActionType");

export default WebsMack;