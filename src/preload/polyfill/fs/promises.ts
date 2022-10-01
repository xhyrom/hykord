import fsPromises from 'fs/promises';
import originalPath from 'path';

export * from 'fs/promises';

// Custom functions:

export const exists = async(path: string) => {
    try {
        await fsPromises.access(path);
        return true;
    } catch {
        return false;
    }
}

export const readAndIfNotExistsCreate = async(path: string, fallback: string = ''): Promise<string> => {
    const exist = await exists(path);
    if (exist) return (await fsPromises.readFile(path)).toString();
    
    await fsPromises.writeFile(path, fallback);

    return fallback;
}

export const mkdirIfNotExists = async(base: string, ...paths: string[]) => {
    if (!(await exists(base))) await fsPromises.mkdir(base);

    for (const path of paths) {
        if (!(await exists(originalPath.join(base, path)))) await fsPromises.mkdir(originalPath.join(base, path));
    }
}