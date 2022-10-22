import type { ModuleExports, WebpackChunk, WebpackChunkGlobal } from './types';
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
      const patches = Hykord.Patcher.webpackPatches;
  
      for (const id in modules) {
        let mod = modules[id];
        let code = mod.toString().replaceAll('\n', '');
        const originalMod = mod;
        const patchedBy = new Set();

        modules[id] = function (m, exports, require) {
          mod(m, exports, require);
  
          for (const [ filter, lazyModule ] of subscriptions) {
            const { callback, allowed, tries } = lazyModule;
            if (allowed !== -1 && tries >= allowed) {
              subscriptions.delete(filter);
              continue;
            };

            if (m.exports && filter(m.exports)) {
                callback(m.exports);
                lazyModule.tries++;
                continue;
            }
            if (typeof m.exports !== 'object') continue;

            if (m.exports?.default && filter(m.exports?.default as ModuleExports)) {
                callback(m.exports.default as ModuleExports);
                lazyModule.tries++;
                continue;
            }
      
            for (const key in m.exports) {
              const nested = m.exports[key] as ModuleExports;

              if (nested && filter(nested)) {
                callback(nested);
                lazyModule.tries++;
                continue;
              }
            }
          }
        };
        modules[id].toString = () => mod.toString();
        // @ts-expect-error just keep
        modules[id].original = originalMod;

        for (let i = 0; i < patches.length; i++) {
          const patch = patches[i];
          if (code.includes(patch.find)) {
            patchedBy.add(patch.plugin);

            // this is from Vencord, thanks - https://github.com/Vendicated/Vencord/blob/main/src/webpack/patchWebpack.ts
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore look into loaders/plugin.ts
            for (const replacement of patch.replacement) {
              const lastMod = mod;
              const lastCode = code;
              try {
                  const newCode = code.replace(replacement.match, replacement.replace);
                  if (newCode === code) {
                      //logger.warn(`Patch by ${patch.plugin} had no effect: ${replacement.match}`);
                      //logger.debug('Function Source:\n', code);
                  } else {
                      code = newCode;
                      mod = (0, eval)(`// Webpack Module ${id} - Patched by ${[...patchedBy].join(', ')}\n${newCode}\n//# sourceURL=WebpackModule${id}`);
                  }
              } catch (err) {
                  // TODO - More meaningful errors. This probably means moving away from string.replace
                  // in favour of manual matching. Then cut out the context and log some sort of
                  // diff
                  console.error('Failed to apply patch of', patch.plugin, err);
                  console.debug('Original Source\n', lastCode);
                  console.debug('Patched Source\n', code);
                  code = lastCode;
                  mod = lastMod;
                  patchedBy.delete(patch.plugin);
              }
            }
            
            if (!patch.all) patches.splice(i--, 1);
          }
        }
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