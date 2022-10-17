import { addPlugin } from '../loaders/plugin';

// Plugins:
import MessageAPI from './messageApi';
import SettingsAPI from './settingsApi';
import CommandsAPI from './commandsApi';
import Settings from './settings';
import Experiments from './experiments';

addPlugin(SettingsAPI);
addPlugin(MessageAPI);
addPlugin(CommandsAPI);
addPlugin(Settings);
addPlugin(Experiments);

// TODO: auto generate with esbuild
