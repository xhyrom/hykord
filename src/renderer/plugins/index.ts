import { addPlugin } from '../loaders/plugin';

// Plugins:
import { Settings } from './settings';
import { Experiments } from './experiments';

addPlugin(new Settings());
addPlugin(new Experiments());

// TODO: auto generate with esbuild
