import { Plugin } from '@hykord/structures';
import BdApi from './structs/BdApi';

export default class extends Plugin {
    name = 'BD Compat';
    author = 'Hykord';
    version = '0.0.1';
    description = 'Allows you to use BetterDiscord plugins.';

    start(): void {
        console.log('Hello World!');
        window.BdApi = new BdApi();
    }
}