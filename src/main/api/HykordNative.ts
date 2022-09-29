import * as polyfill from '../polyfill';
import { join } from 'path';

export default {
    getDirectory: () => join(`${process.env.HOME || process.env.USERPROFILE}`, '.hykord'),
    getVersions: () => process.versions,
    getPolyfillRemote: () => polyfill,
}