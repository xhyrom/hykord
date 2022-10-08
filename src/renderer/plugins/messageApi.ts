import { Plugin } from '@hykord/structures';
import { waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { Logger as RealLogger } from '@common';
import { Message } from '@hykord/apis';

const Logger = new RealLogger('Message API');

export class MessageAPI extends Plugin {
    unpatchSendMessage: any;
    unpatchEditMessage: any;
    unpatchReceiveMessage: any;

    name = 'Message API';
    author = 'Hykord';
    version = '0.0.0';
    description = 'Allows to listen for messages';
    settings = [
        {
            type: 'boolean',
            name: 'Send',
            description: 'allow send',
            defaultValue: true,
        },
        {
            type: 'boolean',
            name: 'Edit',
            description: 'allow edit',
            defaultValue: true,
        },
        {
            type: 'boolean',
            name: 'Receive',
            description: 'allow receive',
            defaultValue: false,
        },
    ]
    public start(): void {
        this.fullStart();
    }

    public async fullStart(): Promise<void> {
        const Messages: any = await this.getMessages();

        if (await this.getSetting('Send', true)) {
            this.unpatchSendMessage = after('sendMessage', Messages, (args, res) => {
                const [ channelId, message, ...extra ] = args;
                Message.$handleSendMessage(channelId, message, extra);
    
                return res;
            });

            Logger.info('Send injected');
        }

        if (await this.getSetting('Edit', true)) {
            this.unpatchEditMessage = after('editMessage', Messages, (args, res) => {
                const [ channelId, messageId, message ] = args;
                Message.$handleEditMessage(channelId, messageId, message);
    
                return res;
            });

            Logger.info('Edit injected');
        }

        if (await this.getSetting('Receive', false)) {
            this.unpatchReceiveMessage = after('receiveMessage', Messages, (args, res) => {
                const [ channelId, message ] = args;
                Message.$handleReceiveMessage(channelId, message);

                return res;
            })

            Logger.info('Receive injected');
        }

        Logger.info('Plugin successfully injected everything needed');
    }

    public stop(): void {
        this.unpatchSendMessage?.();
        this.unpatchEditMessage?.();
        this.unpatchReceiveMessage?.();
    }

    private async getMessages() {
        return new Promise((resolve) => {
            waitFor(Filters.byProps('sendMessage'), (s) => {
                resolve(s);
            });
        });
    }
}
