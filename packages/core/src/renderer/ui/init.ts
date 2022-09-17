import Logger from '@hykord/logger';

export default () => {
    Logger.info('Injecting UI Styles');
    require('./styles/index').default();

    Logger.info('Injecting UI');

    const userSettings = require('./userSettings/index').default;
    userSettings();

    const notifications = require('./notifications/index').default;
    notifications();
}