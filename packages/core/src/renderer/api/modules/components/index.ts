import { findByDisplayName, findByProps, findAsync } from '@hykord/webpack';
import AsyncComponent from './AsyncComponent';

export * as inputs from './inputs';
export * as items from './items';
export * as other from './other';

export { ErrorBoundary } from './ErrorBoundary';

const recreateProps = (obj): string[] => {
    return Object.getOwnPropertyNames(obj).filter(
        p => ![
            'length','name', 'prototype', 'displayName', 'defaultProps'
        ].includes(p)
    );
}

/** OFFICIAL DISCORD COMPONENTS */

export const Button = AsyncComponent.from(findAsync(() => findByProps('BorderColors', 'Colors')));
export const Divider = AsyncComponent.from(findAsync(() => findByDisplayName('Divider')));
export const Card = AsyncComponent.from(findAsync(() => findByDisplayName('Card')));
export const Flex = AsyncComponent.from(findAsync(() => findByDisplayName('Flex')));
export const Header = AsyncComponent.from(findAsync(() => findByProps('Sizes', 'Tags')));
export const Markdown = AsyncComponent.from(findAsync(() => findByProps("parseBlock", "parseInline", "defaultOutput")));
export const SearchBar = AsyncComponent.from(findAsync(() => findByDisplayName('SearchBar')));
export const Clickable = AsyncComponent.from(findAsync(() => findByDisplayName('Clickable')));

/** Input related components */
export const TextInput = AsyncComponent.from(findAsync(() => findByDisplayName('TextInput')));
export const Switch = AsyncComponent.from(findAsync(() => findByDisplayName('Switch')));
export const SwitchItem = AsyncComponent.from(findAsync(() => findByDisplayName('SwitchItem')));
export const Slider =  AsyncComponent.from(findAsync(() => findByDisplayName('Slider')));

/** Form related components */
export const FormText = AsyncComponent.from(findAsync(() => findByDisplayName('FormText')));
export const FormLabel = AsyncComponent.from(findAsync(() => findByDisplayName('FormLabel')));
export const FormSection = AsyncComponent.from(findAsync(() => findByDisplayName('FormSection')));
export const FormTitle = AsyncComponent.from(findAsync(() => findByDisplayName('FormTitle')));
export const FormNotice = AsyncComponent.from(findAsync(() => findByDisplayName('FormNotice')));
export const FormItem = AsyncComponent.from(findAsync(() => findByDisplayName('FormItem')));
export const FormDivider = AsyncComponent.from(findAsync(() => findByDisplayName('FormDivider')));

// Re-export properties
findAsync(() => findByProps('BorderColors', 'Colors')).then(Button => {
    recreateProps(Button).forEach(p => exports.Button[p] = Button[p]);
})

findAsync(() => findByDisplayName('Card')).then(Card => {
    recreateProps(Card).forEach(p => exports.Card[p] = Card[p]);
})

findAsync(() => findByDisplayName('FormNotice')).then(FormNotice => {
    recreateProps(FormNotice).forEach(p => exports.FormNotice[p] = FormNotice[p]);
});

findAsync(() => findByDisplayName('Flex')).then(Flex => {
    recreateProps(Flex).forEach(p => exports.Flex[p] = Flex[p]);
});