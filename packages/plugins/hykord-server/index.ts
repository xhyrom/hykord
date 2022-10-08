import { Plugin } from '@hykord/structures';

export default class extends Plugin {
    name = 'Hykord Server';
    author = 'Hykord';
    version = '0.0.1';
    description = 'Enable special private general chat in official Hykord discord server';

    start(): void {
        console.log('Hello World!');
    }
}