import Logger from '@hykord/logger';
import { HykordEvents } from '@main';

interface Notification {
    message: string;
    button: {
        text: string;
        onClick: () => void;
    }
    color: 'blurple' | 'red' | 'orange' | 'blue' | 'dark' | 'blurple_gradient' | 'spotify' | 'purple' | 'green';
    onClose: () => void;
    onClick: () => void;
}

class Notifications {
    notifications: Notification[];
    constructor() {
        this.notifications = [];
    }

    sendNotification(id: string, props) {
        if (this.notifications[id]) return Logger.err(`Notification with id ${id} already exists`);

        this.notifications[id] = props;
        window.hykord.events.emit(HykordEvents.NOTIFICATION_SEND);
    }

    closeNotification(id: string) {
        if (!this.notifications[id]) return;

        delete this.notifications[id];
        window.hykord.events.emit(HykordEvents.NOTIFICATION_CLOSED);
    }
}

export default new Notifications();