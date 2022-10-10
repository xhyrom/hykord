// Look into @hykord/components for discord components

import type Other from 'discord-types/other';
import type StoreTypes from 'discord-types/stores';
import { Stores as StoreTypes2 } from '@common';
import { waitForSync } from './webpack';

export let React: typeof import('react');
export let FluxDispatcher: Other.FluxDispatcher;
export const Stores = {} as {
  GuildStore: StoreTypes.GuildStore;
  SelectedGuildStore: StoreTypes2.SelectedGuildStore;
  UserStore: StoreTypes.UserStore;
  RelationshipStore: StoreTypes.RelationshipStore;
  InviteStore: StoreTypes2.InviteStore;
  ChannelStore: StoreTypes.ChannelStore;
  SelectedChannelStore: StoreTypes.SelectedChannelStore;
};

waitForSync('useState', (m) => (React = m as any));
waitForSync(
  ['dispatch', 'subscribe', '_actionHandlers'],
  (m) => (FluxDispatcher = m as any),
);

waitForSync(
  ['getCurrentUser', 'initialize'],
  (m) => (Stores.UserStore = m as any),
);
waitForSync(
  'getSortedPrivateChannels',
  (m) => (Stores.ChannelStore = m as any),
);
waitForSync(
  'getCurrentlySelectedChannelId',
  (m) => (Stores.SelectedChannelStore = m as any),
);
waitForSync('getGuildCount', (m) => (Stores.GuildStore = m as any));
waitForSync(
  'getLastSelectedGuildId',
  (m) => (Stores.SelectedGuildStore = m as any),
);
waitForSync('isBlocked', (m) => (Stores.RelationshipStore = m as any));
waitForSync('getInvites', (m) => (Stores.InviteStore = m as any));
