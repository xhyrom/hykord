import { addPlugin } from '../loaders/plugin';

// Plugins:
import { MessageAPI } from './messageApi';
import { SettingsAPI } from './settingsApi';
import { Settings } from './settings';
import { Experiments } from './experiments';
import { Snippets } from './snippets';

addPlugin(new SettingsAPI());
addPlugin(new MessageAPI());
addPlugin(new Settings());
addPlugin(new Experiments());
addPlugin(new Snippets());

// TODO: auto generate with esbuild
