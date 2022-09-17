import { React, findAsync, findByProps, findByDisplayName } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { findInReactTree, forceUpdateElement, getOwnerInstance, waitFor } from '@hykord/utilities';
import { NotificationContainer } from './components/NotificationContainer';
import { ToastContainer } from './components/ToastContainer';

const pathNotifications = async() => {
    const { base } = await findAsync(() => findByProps("base", "container"));
    const instance = getOwnerInstance(await waitFor(`.${base.split(' ')[0]}`));

    after('type', instance.props.children[0], (_, res) => {
        const { children } = findInReactTree(res, ({ className }) => className === base);
        children.unshift(React.createElement(NotificationContainer));
        return res;
    });

    instance.forceUpdate();
}

const patchToasts = async() => {
    const { app } = await findAsync(() => findByProps('app', 'layers'));
    const Shakeable = await findAsync(() => findByDisplayName('Shakeable'));

    after('render', Shakeable.prototype, (_, res) => {
        if (!res.props.children.find(child => child.type && child.type.name === 'ToastContainer')) {
          res.props.children.push(React.createElement(ToastContainer));
        }
        return res;
    });

    forceUpdateElement(`.${app}`);
}

export default async() => {
    await pathNotifications();
    await patchToasts();
}