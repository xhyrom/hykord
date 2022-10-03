// Look into @hykord/components for discord components

import { waitFor } from './webpack';

export let React: typeof import('react');

waitFor('useState', (m) => React = m as any);