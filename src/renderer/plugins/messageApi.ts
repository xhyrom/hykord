import { $plugin, PluginSettingType } from '@hykord/hooks';
import { waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { Logger as RealLogger } from '@common';
import { Message } from '@hykord/apis';

const Logger = new RealLogger('Message API');

let unpatchSendMessage: () => void;
let unpatchEditMessage: () => void;
let unpatchReceiveMessage: () => void;
export default $plugin({
    name: 'Message API',
    author: 'Hykord',
    version: '0.0.0',
    description: 'Allows to listen for messages',
    settings: [
        {
            type: PluginSettingType.Boolean,
            name: 'Send',
            description: 'allow send',
            defaultValue: true,
        },
        {
            type: PluginSettingType.Boolean,
            name: 'Edit',
            description: 'allow edit',
            defaultValue: true,
        },
        {
            type: PluginSettingType.Boolean,
            name: 'Receive',
            description: 'allow receive',
            defaultValue: false,
        },
    ],
    $internal: true,
    async start(): Promise<void> {
        const Messages: any = await waitFor(Filters.byProps('sendMessage'));

        if (await Hykord.Settings.get('plugins.message_api.send', true)) {
            unpatchSendMessage = after('sendMessage', Messages, (args, res) => {
                const [ channelId, message, ...extra ] = args;
                Message.$handleSendMessage(channelId, message, extra);
    
                return res;
            });

            Logger.info('Send injected');
        }

        if (await Hykord.Settings.get('plugins.message_api.edit', true)) {
            unpatchEditMessage = after('editMessage', Messages, (args, res) => {
                const [ channelId, messageId, message ] = args;
                Message.$handleEditMessage(channelId, messageId, message);
    
                return res;
            });

            Logger.info('Edit injected');
        }

        if (await Hykord.Settings.get('plugins.message_api.receive', true)) {
            unpatchReceiveMessage = after('receiveMessage', Messages, (args, res) => {
                const [ channelId, message ] = args;
                Message.$handleReceiveMessage(channelId, message);

                return res;
            })

            Logger.info('Receive injected');
        }

        Logger.info('Plugin successfully injected everything needed');
    },

    stop(): void {
        unpatchSendMessage?.();
        unpatchEditMessage?.();
        unpatchReceiveMessage?.();
    }
});
