import { Common, Filters, waitForSync } from '@hykord/webpack';
import { Message } from 'discord-types/general';
import { lazyWebpack, mergeDefaults } from '.';

/** Guild specific  */

export const getCurrentGuildId = () => {
    return Common.Stores.SelectedGuildStore.getGuildId();
};

export const getCurrentGuild = () => {
    return Common.Stores.GuildStore.getGuild(getCurrentGuildId());
};

export const getGuildCount = () => {
    return Common.Stores.GuildStore.getGuildCount();
}

export const getGuilds = () => {
    return Common.Stores.GuildStore.getGuilds();
}

/** Channel specific */

export const getChannel = (id: string) => {
    return Common.Stores.ChannelStore.getChannel(id);
};

export const getCurrentChannelId = () => {
    return Common.Stores.SelectedChannelStore.getChannelId();
};

export const getCurrentChannel = () => {
    return getChannel(getCurrentChannelId());
};

/** User specific  */
export const getUser = (id: string) => {
    return Common.Stores.UserStore.getUser(id);
};

export const getUsers = () => {
    return Common.Stores.UserStore.getUsers();
}

export const getCurrentUser = () => {
    return Common.Stores.UserStore.getCurrentUser();
};

/** Message specific */
const createBotMessage = lazyWebpack(Filters.byCode('username:"Clyde"'));
const MessageSender = lazyWebpack(Filters.byProps('receiveMessage'));

export const sendBotMessage = (channelId: string, message: Partial<Message>): Message => {
    const botMessage = createBotMessage({ channelId, content: '', embeds: [] });

    MessageSender.receiveMessage(channelId, mergeDefaults(message, botMessage));

    return message as Message;
}

/** Snowflake specific */
let SnowflakeUtils: any;
waitForSync('fromTimestamp', m => SnowflakeUtils = m);

export const generateSnowflake = (date = Date.now()) => {
    return SnowflakeUtils.fromTimestamp(date);
}