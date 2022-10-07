import { addPlugin } from '../loaders/plugin';

// Plugins:
import { Settings } from './settings';
import { Experiments } from './experiments';
import { IsStaff } from './is-staff';

addPlugin(new Settings());
addPlugin(new Experiments());
addPlugin(new IsStaff());

// TODO: auto generate with esbuild