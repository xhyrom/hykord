import * as HykordPatcher from '@hykord/patcher';
import * as HykordStructures from '@hykord/structures';
import * as HykordWebpack from '@hykord/webpack';
import * as HykordComponents from '@hykord/components';
import * as HykordApis from '@hykord/apis';

/**
 * Creates require for plugins
 */

const createRequire = () => {
  return (mod: string) => {
    switch (mod) {
      case 'hykord':
        return Hykord;
      case '@hykord/patcher':
        return HykordPatcher;
      case '@hykord/structures':
        return HykordStructures;
      case '@hykord/webpack':
        return HykordWebpack;
      case '@hykord/components':
        return HykordComponents;
      case '@hykord/apis':
        return HykordApis;
      case 'path':
        return HykordNative.getPolyfillRemote().path;
      case 'electron':
        return HykordNative.getPolyfillRemote().electron;
      case 'fs':
        return HykordNative.getPolyfillRemote().fs;
      case 'fs/promises':
        return HykordNative.getPolyfillRemote().fs.promises;
      case 'crypto':
        return HykordNative.getPolyfillRemote().crypto;

      default:
        // Only works if hykord.unsafe-require setting is enabled
        return HykordNative.require(mod);
    }
  };
};

window.require = createRequire() as any;

export default window.require;
