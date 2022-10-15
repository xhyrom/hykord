import fetch from 'node-fetch';
import { createWriteStream } from 'fs';
import { join } from 'path';

export const checkForUpdates = async() => {
    const commits = await fetch(`https://api.github.com/repos/xHyroM/hykord/compare/${await getLatestCommitHash()}...main`);
    
    if (!commits.ok) return [];

    const body: any = await commits.json();

    return body
        ? body.commits.map((c: any) => {
            return { author: c.commit.committer.name, hash: c.sha.slice(0, 7), message: c.commit.message };
        })
        : [];
}

export const downloadUpdate = async() => {
    const latestRelease = await fetch('https://api.github.com/repos/xHyroM/hykord/releases/latest');
    const body: any = await latestRelease.json();

    for (const asset of body.assets) {
        const name = asset.name;
        const url = asset.browser_download_url;

        const request = await fetch(url);
        const fileStream = createWriteStream(join(__dirname, name));

        await new Promise((resolve) => {
            request.body.pipe(fileStream);
            fileStream.on('finish', resolve);
            console.log('jou jou');
        })
        console.log('finišed');
    }

}

export const getRepository = async() => {
    return {
      name: 'xHyroM/hykord',
      url: 'https://github.com/xHyroM/hykord',
    };
}

export const getLatestCommitHash = async() => {
    return $HYKORD_GIT_HASH;
}