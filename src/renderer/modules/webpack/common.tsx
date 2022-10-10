// Look into @hykord/components for discord components

import type Other from 'discord-types/other';
import type StoreTypes from 'discord-types/stores';
import { Stores as StoreTypes2 } from '@common';
import { waitFor } from './webpack';

export let React: typeof import('react');
export let FluxDispatcher: Other.FluxDispatcher;
export const Stores = {} as {
    GuildStore: StoreTypes.GuildStore;
    SelectedGuildStore: StoreTypes2.SelectedGuildStore;
    UserStore: StoreTypes.UserStore;
    ChannelStore: StoreTypes.ChannelStore;
    SelectedChannelStore: StoreTypes.SelectedChannelStore;
}

waitFor('useState', m => React = m as any);
waitFor(['dispatch', 'subscribe', '_actionHandlers'], m => FluxDispatcher = m as any);

waitFor(['getCurrentUser', 'initialize'], m => Stores.UserStore = m as any);
waitFor('getSortedPrivateChannels', m => Stores.ChannelStore = m as any);
waitFor('getCurrentlySelectedChannelId', m => Stores.SelectedChannelStore = m as any);
waitFor('getGuildCount', m => Stores.GuildStore = m as any);
waitFor('getLastSelectedGuildId', m => Stores.SelectedGuildStore = m as any);