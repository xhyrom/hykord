import fs from 'fs/promises';
import { join } from 'path';

export const exists = async(path: string) => {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

export const readAndIfNotExistsCreate = async(path: string, fallback: string): Promise<string> => {
    const exist = await exists(path);
    if (exist) return (await fs.readFile(path)).toString();
    
    await fs.writeFile(path, fallback);

    return fallback;
}

export const mkdirIfNotExists = async(base: string, ...paths) => {
    if (!(await exists(base))) await fs.mkdir(base);

    for (const path of paths) {
        if (!(await exists(join(base, path)))) await fs.mkdir(join(base, path));
    }
}

export default {
    ...fs,
    exists,
}