import { readFile } from 'fs/promises';
import { injectCss, uninjectCssById } from '@module/patcher';

export const loadCss = async(id: string,file: string) => {
    const content = (await readFile(file, {
        encoding: 'utf-8'
    })).toString();

    injectCss(content, id);
}

export const unloadCss = async(id: string) => {
    uninjectCssById(id);
}