import { contextBridge, webFrame } from "electron";
import { readFileSync } from "fs";
import { join } from "path";
import HykordNative from "./api/HykordNative";
import { PreloadLogger as Logger } from "@common";

// Add HykordNative
Logger.info("Exposing HykordNative");
contextBridge.exposeInMainWorld("HykordNative", HykordNative);

// TODO: keep it????
// Add Hykord modules
//require('module').globalPaths.push(join(__dirname, 'modules'));
// ELECTRON 17:
/**
 *   const nodeModulePaths = Module._nodeModulePaths
  Module._nodeModulePaths = (from) =>
    nodeModulePaths(from).concat([PATH_APP_NODE_MODULES])
 */

Logger.info("Executing renderer");
webFrame.executeJavaScript(
  readFileSync(join(__dirname, "renderer.js"), "utf-8")
);

const preload = process.env.ORIGINAL_DISCORD_PRELOAD_FOR_HYKORD;
if (preload) {
  Logger.info("Loading original preload");
  require(preload);
}
