import fsPromises from 'fs/promises';

export * from 'fs/promises';

// Custom functions:

export const getContentOrCreateIfNotExists = async (path: string) => {
    try {
        return await fsPromises.readFile(path, 'utf8');
    } catch (e) {
        await fsPromises.writeFile(path, '');
        return '';
    }
}