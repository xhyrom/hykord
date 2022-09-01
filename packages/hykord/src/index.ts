/** Start file of Hykord - patcher */

import 'module-alias/register';
import Module from 'module';
import electron from 'electron';
import path from 'path';
import BrowserWindow from './patch/BrowserWindow';
import CSP from './patch/csp';

// Restore classic discord
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const basePath = path.join(path.dirname(require.main!.filename), '..', 'app.asar');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(path.resolve(
  path.join(basePath, 'package.json')
));

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
require.main!.filename = path.join(basePath, packageJson.main);

import '@hykord/ipc';

// Inject window
BrowserWindow.patchBrowserWindow();

// Remove CSP
electron.app.once('ready', CSP.remove);

// Enable console on Discord Stable
let fakeAppSettings;
Object.defineProperty(global, 'appSettings', {
    get() {
        return fakeAppSettings;
    },
    set(value) {
        if (!value.hasOwnProperty('settings')) value.settings = {};

        value.settings.DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING = true;
        fakeAppSettings = value;
    },
});

// @ts-expect-error setAppPath is no in typings
electron.app.setAppPath(basePath);
electron.app.name = packageJson.name;

// @ts-expect-error _load is not in typings
Module._load(path.join(basePath, packageJson.main), null, true);
