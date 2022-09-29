import { Theme } from '@hykord/structures';
import { quickCss } from '../utils';
const { getContentOrCreateIfNotExists } = window.require('fs/promises');
const { join } = window.require('path');

export const themes: Theme[] = [];

const load = async() => {
    // First, load quickCss
    quickCss.load(await getContentOrCreateIfNotExists(join(Hykord.directory, 'quickCss.css')));

    document.removeEventListener('DOMContentLoaded', load);
}

document.addEventListener('DOMContentLoaded', load);