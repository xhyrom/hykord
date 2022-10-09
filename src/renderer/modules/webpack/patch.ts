import { ModuleExports, WebpackChunk, WebpackChunkGlobal } from '../@common';
import { _initWebpack } from './webpack';

let webpackChunk: WebpackChunkGlobal | undefined;

Object.defineProperty(window, 'webpackChunkdiscord_app', {
  get: () => webpackChunk,
  set: (v) => {
    if (v?.push !== Array.prototype.push) {
        _initWebpack(v);
        patchPush();

        // @ts-expect-error no types
        delete window['webpackChunkdiscord_app'];
        window['webpackChunkdiscord_app'] = v;   
    }
    webpackChunk = v;
  },
  configurable: true
});

function patchPush () {
    function handlePush (chunk: WebpackChunk) {
      const modules = chunk[1];
      const { subscriptions } = Hykord.Webpack;
  
      for (const id in modules) {
        const mod = modules[id];
        modules[id] = function (m, exports, require) {
          mod(m, exports, require);
  
          for (const [ filter, callback ] of subscriptions) {
            if (m.exports && filter(m.exports)) {
                callback(m.exports);
                continue;
            }
            if (typeof m.exports !== 'object') continue;

            if (m.exports?.default && filter(m.exports?.default as ModuleExports)) {
                callback(m.exports.default as ModuleExports);
                continue;
            }
      
            for (const key in m.exports) {
              const nested = m.exports[key] as ModuleExports;

              if (nested && filter(nested)) {
                callback(nested);
                continue;
              }
            }
          }
        };
      }

      return handlePush.original.call(webpackChunk, chunk);
    }
  
    handlePush.original = window['webpackChunkdiscord_app'].push;
    Object.defineProperty(window['webpackChunkdiscord_app'], 'push', {
        get: () => handlePush,
        set: (v) => (handlePush.original = v),
        configurable: true
    });
}