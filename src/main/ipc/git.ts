import { HykordIpcEvents } from '@hypes';
import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const exec = promisify(execFile);

const sourceDirectory = join(__dirname, '..');
const git = async (...args: string[]) =>
  exec('git', args, { cwd: sourceDirectory });

ipcMain.handle(HykordIpcEvents.CHECK_FOR_UPDATES, async () => {
  await git('fetch');

  const commits = (
    await git('log', 'HEAD...origin/main', '--pretty=format:%an/%h/%s')
  ).stdout.trim();

  return commits
    ? commits.split('\n').map((l) => {
        const [author, hash, ...message] = l.split('/');
        return { author, hash, message: message.join('/') };
      })
    : [];
});

ipcMain.handle(HykordIpcEvents.DOWNLOAD_UPDATE, async () => {
  return (await git('pull')).stdout.includes('Fast-forward');
});

ipcMain.handle(HykordIpcEvents.GET_REPOSITORY, async () => {
  const stdout = (await git('remote', 'get-url', 'origin')).stdout.trim();

  return {
    name: stdout.replace('https://github.com/', '').replace(/\.git$/, ''),
    url: stdout.replace(/\.git$/, ''),
  };
});

ipcMain.handle(HykordIpcEvents.GET_LATEST_COMMIT_HASH, async () => {
  return (
    await git('log', '-n', '1', 'origin', '--pretty=format:%H')
  ).stdout.trim();
});
