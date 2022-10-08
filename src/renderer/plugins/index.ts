import { addPlugin } from '../loaders/plugin';

// Plugins:
import { Settings } from './settings';
import { Experiments } from './experiments';
import { MessageAPI } from './messageApi';

addPlugin(new Settings());
addPlugin(new Experiments());
addPlugin(new MessageAPI());

// TODO: auto generate with esbuild
