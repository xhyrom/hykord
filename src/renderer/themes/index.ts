import { addTheme } from '../loaders/theme';

// Generated in scripts/build.ts
declare const $generated: string;
const content = $generated;

addTheme({
    name: 'internal',
    version: '0.0.0',
    author: 'Hykord',
    toggleable: false,
    start: () => content
});