import { React, findAsync, findByProps } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { findInReactTree, getOwnerInstance, waitFor } from '@hykord/utilities';
import { NotificationsContainer } from './components/NotificationsContainer';

export default async() => {
    const { base } = await findAsync(() => findByProps("base", "container"));
    const instance = getOwnerInstance(await waitFor(`.${base.split(' ')[0]}`));

    after('type', instance.props.children[0], (_, res) => {
        const { children } = findInReactTree(res, ({ className }) => className === base);
        children.unshift(React.createElement(NotificationsContainer));
        return res;
    });

    instance.forceUpdate();
}