import { addTheme } from '../loaders/theme';

// Generated in scripts/build.ts
declare const $generated: string;

addTheme({
    name: 'internal',
    version: '0.0.0',
    author: 'Hykord',
    toggleable: false,
    start: () => $generated
});