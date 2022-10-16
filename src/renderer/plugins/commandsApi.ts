import { Plugin } from '@hykord/structures';
import { Logger as RealLogger } from '@common';

const Logger = new RealLogger('Commands API');

export class CommandsAPI extends Plugin {
    name = 'Commands API';
    author = 'Hykord';
    version = '0.0.0';
    description = 'Allows to create custom commands';
    patches = [
        {
            find: '"giphy","tenor"',
            replacement: [
                {
                    match: /(?<=\w=)(\w)(\.filter\(.{0,30}giphy)/,
                    replace: 'Hykord.Apis.Commands._init($1)$2',
                }
            ]
        }
    ]
    $internal = true;

    public start(): void {
        Logger.info('Plugin successfully injected everything needed');
    }
}
