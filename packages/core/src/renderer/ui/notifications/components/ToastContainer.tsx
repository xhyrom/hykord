import notifications from '@hykord/utilities/notifications';
import { React } from '@hykord/webpack';
import { HykordEvents } from '@main';
import { Toast } from './Toast';

export class ToastContainer extends React.Component {
  constructor (props) {
    super(props);

    this.state = { leaving: null };
    this._sendHandler = () => this.forceUpdate();
    this._closedHandler = (id: string) => {
      this.setState({ leaving: id });
      setTimeout(() => this.setState({ leaving: null }), 510);
    };
  }

  componentDidMount () {
    window.hykord.events.on(HykordEvents.TOAST_SEND, this._sendHandler);
    window.hykord.events.on(HykordEvents.TOAST_CLOSED, this._closedHandler);
  }

  componentWillUnmount () {
    window.hykord.events.off(HykordEvents.TOAST_SEND, this._sendHandler);
    window.hykord.events.off(HykordEvents.TOAST_CLOSED, this._closedHandler);
  }

  render () {
    const toast = Object.keys(notifications.toasts).pop();
    return <div className='hykord-toast-container'>
      {toast && <Toast
        leaving={this.state.leaving === toast} id={toast}
        {...notifications.toasts[toast]}
      />}
    </div>;
  }
}
