import * as plugins from './plugin';
import * as themes from './theme';

export {
    plugins as Plugins,
    themes as Themes,
};

plugins.init();
themes.init();