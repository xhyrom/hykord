import { HykordIpcEvents } from '@hypes';
import { ipcMain } from 'electron';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const exec = promisify(execFile);

const sourceDirectory = join(__dirname, '..');
const git = async(...args: string[]) => exec('git', args, { cwd: sourceDirectory });

ipcMain.handle(HykordIpcEvents.CHECK_FOR_UPDATES, async(_) => {
    await git('fetch');

    const commits = (await git('log', 'HEAD...origin/main', '--pretty=format:%an/%h/%s')).stdout.trim();

    return commits ? commits.split('\n').map(l => {
        const [author, hash, ...message] = l.split('/');
        return { author, hash, message: message.join('/') };
    }) : [];
});
