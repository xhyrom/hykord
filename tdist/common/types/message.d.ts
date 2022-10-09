import type { APIMessage, APIEmoji } from 'discord-api-types/v10';
export interface Message {
    content: string;
    validNonShortcutEmojis: APIEmoji[];
}
export declare type SendListener = (channelId: string, message: Message, extra: any) => void;
export declare type EditListener = (channelId: string, messageId: string, message: Message) => void;
export declare type ReceiveListener = (channelId: string, message: APIMessage) => void;
export { APIMessage };
