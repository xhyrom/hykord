// Look into @hykord/components for discord components

import type Other from 'discord-types/other';
import { waitFor } from './webpack';

export let React: typeof import('react');
export let FluxDispatcher: Other.FluxDispatcher;

waitFor('useState', m => React = m as any);
waitFor(['dispatch', 'subscribe', '_actionHandlers'], m => {
    FluxDispatcher = m as any;
});
