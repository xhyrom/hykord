import * as HykordExample from '@hykord/example';
import * as HykordPatcher from '@hykord/patcher';
import * as HykordStructures from '@hykord/structures';

/**
 * Creates require for plugins
 */

const createRequire = (path: string) => {
    return (mod: string) => {
        switch (mod) {
            case 'hykord': return Hykord
            case '@hykord/example': return HykordExample
            case '@hykord/patcher': return HykordPatcher
            case '@hykord/structures': return HykordStructures
            case 'path': return HykordNative.getPolyfillRemote().path
            case 'electron': return HykordNative.getPolyfillRemote().electron
            case 'fs': return HykordNative.getPolyfillRemote().fs
            case 'fs/promises': return HykordNative.getPolyfillRemote().fs.promises

            default:
                //return Module._load(mod, path, createRequire);
        }
    }
}

window.require = createRequire('.') as any;

export default window.require;