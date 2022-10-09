import { addTheme } from '../loaders/theme';

// Generated in scripts/build.ts
declare const $generated: string;

addTheme({
  name: 'Internal',
  version: '0.0.0',
  author: 'Hykord',
  $toggleable: false,
  $internal: true,
  start: () => $generated,
});
