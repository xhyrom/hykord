import { Plugin } from '@hykord/structures';
import { waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { Logger as RealLogger } from '@common';
import { Message } from '@hykord/apis';

const Logger = new RealLogger('Message API');

export class MessageAPI extends Plugin {
    unpatchSendMessage: any;
    unpatchEditMessage: any;

    name = 'Message API';
    author = 'Hykord';
    version = '0.0.0';
    description = 'Allows to listen for messages';
    public start(): void {
        this.fullStart();
    }

    public async fullStart(): Promise<void> {
        const Messages: any = await this.getMessages();

        this.unpatchSendMessage = after('sendMessage', Messages, (args, res) => {
            const [ channelId, message, ...extra ] = args;
            Message.$handleSendMessage(channelId, message, extra);

            return res;
        });

        this.unpatchEditMessage = after('editMessage', Messages, (args, res) => {
            const [ channelId, messageId, message ] = args;
            Message.$handleEditMessage(channelId, messageId, message);

            return res;
        });

        Logger.info('Plugin successfully injected everything needed');
    }

    public stop(): void {
        this.unpatchSendMessage();
        this.unpatchEditMessage();
    }

    private async getMessages() {
        return new Promise((resolve) => {
            waitFor(Filters.byProps('sendMessage'), (s) => {
                resolve(s);
            });
        });
    }
}
