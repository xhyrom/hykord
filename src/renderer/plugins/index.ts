import { addPlugin } from '../loaders/plugin';

// Plugins:
import { Settings } from './settings';

addPlugin(new Settings(), true);

// TODO: auto generate with esbuild