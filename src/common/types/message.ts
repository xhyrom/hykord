import type { APIMessage, APIEmoji } from 'discord-api-types/v10';

export interface Message {
    content: string;
    validNonShortcutEmojis: APIEmoji[];
}

export type SendListener = (channelId: string, message: Message, extra: any) => void;
export type EditListener = (channelId: string, messageId: string, message: Message) => void;
export type ReceiveListener = (channelId: string, message: APIMessage) => void;

export { APIMessage };