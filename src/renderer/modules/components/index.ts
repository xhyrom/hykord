// @ts-nocheck - too many issuess

import type Components from 'discord-types/components';
import { Filters, waitFor } from '@hykord/webpack';

export const Forms = {} as {
    FormTitle: Components.FormTitle;
    FormSection: any;
    FormDivider: any;
    FormText: Components.FormText;
}

export let Card: Components.Card;
export let Button: any;
export let Switch: any;
export let Tooltip: Components.Tooltip;

// Custom components:
export const Inputs = {} as {
    Switch: typeof import('./inputs/Switch').Switch;
}

export let Flex: typeof import('./Flex').Flex;
export let ErrorBoundary: typeof import('./ErrorBoundary').ErrorBoundary;

waitFor('useState', () => {
    ErrorBoundary = require('./ErrorBoundary').ErrorBoundary;
    Inputs.Switch = require('./inputs/Switch').Switch;
    Flex = require('./Flex').Flex;
});

waitFor(m => m.Tags && Filters.byCode('errorSeparator')(m), m => Forms.FormTitle = m);
waitFor(m => m.Tags && Filters.byCode('titleClassName', 'sectionTitle')(m), m => Forms.FormSection = m);
waitFor(m => m.Types?.INPUT_PLACEHOLDER, m => Forms.FormText = m);

waitFor(m => {
    if (typeof m !== 'function') return false;
    
    const s = m?.toString?.();
    if (!s) return false;
    return s.length < 200 && s.includes('divider')
}, m => Forms.FormDivider = m);

waitFor(['Hovers', 'Looks', 'Sizes'], m => Button = m);
waitFor(Filters.byCode('helpdeskArticleId'), m => Switch = m);
waitFor(['Positions', 'Colors'], m => Tooltip = m);
waitFor(m => m.Types?.PRIMARY === 'cardPrimary', m => Card = m);