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

interface Toast {
    header?: string;
    content?: string;
    buttons?: {
        size?: string;
        look?: string;
        color?: string;
        text: string;
    }[];
    timeout?: number;
    className?: string;
    hideProgressBar?: boolean;
    icon?: boolean;
}

class Notifications {
    notifications: Notification[];
    toasts: Toast[];

    constructor() {
        this.notifications = [];
        this.toasts = [];
    }

    sendNotification(id: string, props: Notification) {
        if (this.notifications[id]) return Logger.err(`Notification with id ${id} already exists`);

        this.notifications[id] = props;
        window.hykord.events.emit(HykordEvents.NOTIFICATION_SEND, id);
    }

    closeNotification(id: string) {
        if (!this.notifications[id]) return;

        delete this.notifications[id];
        window.hykord.events.emit(HykordEvents.NOTIFICATION_CLOSED, id);
    }

    sendToast(id: string, props: Toast) {
        if (this.toasts[id]) return Logger.err(`Toast with id ${id} already exists`);

        this.toasts[id] = props;
        window.hykord.events.emit(HykordEvents.TOAST_SEND, id);
    }

    closeToast(id: string) {
        const toast = this.toasts[id];
        if (!toast) return;

        toast.callback?.();

        window.hykord.events.emit(HykordEvents.TOAST_CLOSED, id);
        setTimeout(() => delete this.toasts[id], 500);
    }
}

export default new Notifications();