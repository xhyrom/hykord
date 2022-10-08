interface Emoji {
    require_colons: boolean;
    originalName: string;
    animated: boolean;
    guildId: string;
    name: string;
    url: string;
    id: string;
}

interface Message {
    content: string;
    validNonShortcutEmojis: Emoji[];
}

type SendListener = (channelId: string, message: Message, extra: any) => void;
type EditListener = (channelId: string, messageId: string, message: Message) => void;

const sendListeners = new Set<SendListener>();
const editListeners = new Set<EditListener>();

// Used by plugins/messageApi.ts
export const $handleSendMessage = (channelId: string, message: Message, extra: any) => {
    for (const listener of sendListeners) {
        listener(channelId, message, extra);
    }
};

export const $handleEditMessage = (channelId: string, messageId: string, message: Message) => {
    for (const listener of editListeners) {
        listener(channelId, messageId, message);
    }
};

export const addPreSendListener = (listener: SendListener) => {
    sendListeners.add(listener);
    return listener;
};

export const removePreSendListener = (listener: SendListener) => {
    sendListeners.delete(listener);
};

export const addPreEditListener = (listener: EditListener) => {
    editListeners.add(listener);
    return listener;
};

export const removePreEditListener = (listener: EditListener) => {
    editListeners.delete(listener);
};