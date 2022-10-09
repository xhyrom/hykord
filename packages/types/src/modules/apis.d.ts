declare module '@hykord/apis' {
    import type { APIMessage, APIEmoji } from 'discord-api-types/v10';

    namespace Message {
        export interface Message {
            content: string;
            validNonShortcutEmojis: APIEmoji[];
        }
        export type SendListener = (channelId: string, message: Message, extra: any) => void;
        export type EditListener = (channelId: string, messageId: string, message: Message) => void;
        export type ReceiveListener = (channelId: string, message: APIMessage) => void;
        export { APIMessage };

        export const $handleSendMessage: (channelId: string, message: Message, extra: any) => void;
        export const $handleEditMessage: (channelId: string, messageId: string, message: Message) => void;
        export const $handleReceiveMessage: (channelId: string, message: APIMessage) => void;
        export const addPreSendListener: (listener: SendListener) => SendListener;
        export const removePreSendListener: (listener: SendListener) => void;
        export const addPreEditListener: (listener: EditListener) => EditListener;
        export const removePreEditListener: (listener: EditListener) => void;
        export const addPreReceiveListener: (listener: ReceiveListener) => ReceiveListener;
        export const removePreReceiveListener: (listener: ReceiveListener) => void;
    }

    namespace Settings {
        export let sections: {
            priority: number;
            section: string;
            label: string;
            element: any;
        }[];
        export const registerSection: (id: string, name: string, component: any, priority?: number) => () => void;
        export const unregisterSection: (id: string) => void;        
    }
}