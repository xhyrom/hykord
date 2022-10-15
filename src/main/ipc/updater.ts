import { HykordIpcEvents } from '@common';
import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import * as git from './updater/git';
import * as releases from './updater/releases';

const exec = promisify(execFile);

const sourceDirectory = join(__dirname, '..');
const isGitRepository = async() => {
  try {
    await exec('git', ['rev-parse', '--git-dir'], { cwd: sourceDirectory });
    return true;
  } catch {
    return false;
  }
};

ipcMain.handle(HykordIpcEvents.CHECK_FOR_UPDATES, async () => {
  return await isGitRepository() ? git.checkForUpdates() : releases.checkForUpdates();
});

ipcMain.handle(HykordIpcEvents.DOWNLOAD_UPDATE, async () => {
  return await isGitRepository() ? git.downloadUpdate() : releases.downloadUpdate();
});

ipcMain.handle(HykordIpcEvents.GET_REPOSITORY, async () => {
  return await isGitRepository() ? git.getRepository() : releases.getRepository();
});

ipcMain.handle(HykordIpcEvents.GET_LATEST_COMMIT_HASH, async () => {
  return await isGitRepository() ? git.getLatestCommitHash() : releases.getLatestCommitHash();
});
