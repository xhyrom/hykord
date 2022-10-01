import { Theme } from '@hykord/structures';

export class Form extends Theme {
    name = 'form';
    author = 'Hykord';
    version = '0.0.0';
    cssId = 'FORM';
    showInSettings = false;
    start(): string {
        return '.hykord-form-divider{margin-top:10px;margin-bottom:10px}';
    }
}