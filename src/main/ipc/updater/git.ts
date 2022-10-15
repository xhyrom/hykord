import { execFile } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execFile);

const git = async (...args: string[]) =>
  exec('git', args, { cwd: __dirname });

export const checkForUpdates = async() => {
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
}

export const downloadUpdate = async() => {
    return (await git('pull')).stdout.includes('Fast-forward');
}

export const getRepository = async() => {
    const stdout = (await git('remote', 'get-url', 'origin')).stdout.trim();

    return {
      name: stdout.replace('https://github.com/', '').replace(/\.git$/, ''),
      url: stdout.replace(/\.git$/, ''),
    };
}

export const getLatestCommitHash = async() => {
    return (
        await git('log', '-n', '1', 'origin', '--pretty=format:%H')
    ).stdout.trim();
}