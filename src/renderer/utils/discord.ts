import { Common } from '@hykord/webpack';

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