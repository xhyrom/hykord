import notifications from '@hykord/utilities/notifications';
import { React } from '@hykord/webpack';
import { HykordEvents } from '@main';
import { Notification } from './Notification';

export class NotificationContainer extends React.Component {
  constructor (props) {
    super(props);

    this._handler = () => this.forceUpdate();
  }

  componentDidMount () {
    window.hykord.events.on(HykordEvents.NOTIFICATION_SEND, this._handler);
    window.hykord.events.on(HykordEvents.NOTIFICATION_CLOSED, this._handler);
  }

  componentWillUnmount () {
    window.hykord.events.off(HykordEvents.NOTIFICATION_SEND, this._handler);
    window.hykord.events.off(HykordEvents.NOTIFICATION_CLOSED, this._handler);
  }

  render () {
    const aId = Object.keys(notifications.notifications).pop();
    return aId
      ? <Notification id={aId} {...notifications.notifications[aId]}/>
      : null;
  }
}
