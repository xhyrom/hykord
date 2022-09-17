import { React, findByProps, findAsync } from '@hykord/webpack';
import { Clickable } from '@hykord/components';
import notifications from '@hykord/utilities/notifications';

let classesCache = null;

export class Notification extends React.Component {
  constructor () {
    super();

    this.state = classesCache || {
      types: {},
      button: '',
      dismiss: ''
    };
  }

  async componentDidMount () {
    if (!classesCache) {
      const classes = await findAsync(() => findByProps('colorPremiumTier1'));

      classesCache = {
        types: {
          blurple: classes.colorBrand,
          red: classes.colorDanger,
          orange: classes.colorWarning,
          blue: classes.colorInfo,
          dark: classes.colorDark,
          blurple_gradient: classes.colorPremiumTier1,
          spotify: classes.colorSpotify,
          purple: classes.colorStreamerMode,
          green: classes.colorSuccess
        },
        button: classes.button,
        dismiss: classes.closeButton,
        notice: classes.notice
      };

      this.setState(classesCache);
    }
  }

  render () {
    const { types, button, dismiss, notice } = this.state;

    return <div className={`hykord-notice ${notice} ${(types[this.props.color] || types.blurple)}`} id={this.props.id}>
      {this.props.message}
      <Clickable className={dismiss} onClick={() => this.handleClick(this.props.onClose)}/>
      {this.props.button && <button className={button} onClick={() => this.handleClick(this.props.button.onClick)}>
        {this.props.button.text}
      </button>}
    </div>;
  }

  handleClick (func) {
    notifications.closeNotification(this.props.id);
    if (func && typeof func === 'function') {
      func();
    }
  }
}