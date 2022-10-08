import fs from 'fs';
import path from 'path';
import Module from 'module';

// Allow import discord modules
// @ts-expect-error no typings
Module.globalPaths.push(
  path.resolve(process.env.DISCORD_APP_PATH, '..', 'app.asar', 'node_modules')
);

// @ts-expect-error no typings
Module._load = ((load) => (req, parent, isMain) => {
  if (req.includes('./') || req.includes('..'))
    return load(req, parent, isMain);
  // @ts-expect-error no typings
  const found = Module.globalPaths.find((m) =>
    fs.existsSync(path.resolve(m, req))
  );

  return found
    ? load(path.resolve(found, req), parent, isMain)
    : load(req, parent, isMain);
  // @ts-expect-error no typings
})(Module._load);

export * as electron from './electron';
export * as fs from './fs';
export * as path from './path';
export * as crypto from './crypto';
