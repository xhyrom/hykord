import { Plugin } from '@hykord/structures';
import { findByCode, waitFor } from '@hykord/webpack';
import { after } from '@hykord/patcher';

export default class extends Plugin {
    name = 'Show Spam Messages';
    author = 'Hykord';
    version = '0.0.1';
    description = 'Show messages marked as "likely spammers".';

    async start(): Promise<void> {
        const isSpam = await waitFor(findByCode('isSpam'));

        // @ts-expect-error it works
        after('hasFlag', isSpam.prototype, (args, res) => {
            if (res === 1 << 20) return false;
            return res;
        })
    }
}