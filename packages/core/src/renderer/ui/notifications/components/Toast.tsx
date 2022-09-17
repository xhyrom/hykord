// https://github.com/powercord-org/powercord/blob/v2/src/Powercord/plugins/pc-notices/components/Toast.jsx

import { findAsync, findByDisplayName, findByProps, React } from '@hykord/webpack';
import { Clickable, Button } from '@hykord/components';
import notifications from '@hykord/utilities/notifications';

const FontAwesome = (props) => {
    const styles = {
      regular: 'r',
      light: 'l',
      duotone: 'd',
      brands: 'b'
    };
  
    const style = Object.keys(styles).find(style => style === props.icon.split(' ')[0].match(/[a-z]+(?!.*-)/)[0]);
    const icon = `fa-${props.icon.replace(`-${style}`, '')} fa-fw`;
    const prefix = styles[style] ? `fa${styles[style]}` : 'fas';

    return <div className={`${prefix} ${icon} ${props.className}`.trim()} />;
};

export class Toast extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        Tooltip: null,
        Progress: null,
        timeout: null,
        progress: 100
    };
  }

  async componentDidMount () {
    this.setState({
        Tooltip: await findAsync(() => findByProps('TooltipContainer')),
        Progress: await findAsync(() => findByDisplayName('Progress'))
    });

    if (this.props.timeout && !isNaN(this.props.timeout)) {
      const timeout = setTimeout(() => notifications.closeToast(this.props.id), this.props.timeout);
      this.setState({ Tooltip: this.state.Tooltip, Progress: this.state.Progress, timeout });

      let timeLeft = this.props.timeout;

      setInterval(() => {
        timeLeft -= 1000;
        this.setState({ Tooltip: this.state.Tooltip, Progress: this.state.Progress, progress: (timeLeft / this.props.timeout) * 100 });
      }, 1e3);
    }
  }

  render () {
    return (
      <div
        id={this.props.id}
        className={[ 'hykord-toast', this.props.leaving ? 'leaving' : '', this.props.className ].filter(Boolean).join(' ')}
        data-toast-type={this.props.type || 'info'}
        style={this.props.style}
      >
        {this.props.header && this.renderHeader()}
        {this.props.content && this.renderContent()}
        {this.props.buttons && Array.isArray(this.props.buttons) && this.renderButtons()}
        {this.state.timeout && !this.props.hideProgressBar && this.renderProgress()}
      </div>
    );
  }

  renderHeader () {
    const faicons = {
      info: 'info-circle-regular',
      warning: 'exclamation-circle-regular',
      danger: 'times-circle-regular',
      success: 'check-circle-regular'
    };

    return <div className='header'>
      {this.props.icon !== false && this.state.Tooltip && (
        <this.state.Tooltip.TooltipContainer
          text={`${this.props.type
            ? this.props.type.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase())
            : 'Info'}: ${this.props.header}`}
          position='left'
        >
          <div className='icon' style={this.props.iconColor ? { color: this.props.iconColor } : {}}>
            {this.props.image
              ? <img
                src={this.props.image} alt=''
                className={[ this.props.imageClassName || null ].filter(Boolean).join(' ')}
              />
              : this.props.icon
                ? <FontAwesome icon={this.props.icon}/>
                : <FontAwesome icon={faicons[this.props.type] || 'info-circle-regular'}/>}
          </div>
        </this.state.Tooltip.TooltipContainer>
      )}
      <span>{this.props.header}</span>
      <Clickable
        className='dismiss'
        onClick={() => {
          clearTimeout(this.state.timeout);
          notifications.closeToast(this.props.id);
        }}
      >
        <div className='fal fa-times fa-fw'/>
      </Clickable>
    </div>;
  }

  renderContent () {
    return <div className='contents'>
      <div className='inner'>
        {this.props.content}
      </div>
    </div>;
  }

  renderButtons () {
    return <div className='buttons'>
      {this.props.buttons.map((button, i) => {
        const btnProps = {};
        [ 'size', 'look', 'color' ].forEach(prop => {
          if (button[prop]) {
            const value = button[prop].includes('-')
              ? button[prop]
              : Button[`${prop.charAt(0).toUpperCase() + prop.slice(1)}s`][button[prop].toUpperCase()];
            if (value) {
              btnProps[prop] = value;
            }
          }
        });

        // @ts-expect-error it works
        if (!btnProps.size) {
            // @ts-expect-error it works
            btnProps.size = Button.Sizes.SMALL;
        }

        return <Button
          key={i}
          {...btnProps}
          onClick={() => {
            if (button.onClick) {
              button.onClick();
            }

            clearTimeout(this.state.timeout);
            return notifications.closeToast(this.props.id);
          }}
        >
          {button.text}
        </Button>;
      })}
    </div>;
  }

  renderProgress () {
    return <>
        {this.state.Progress && (<this.state.Progress
        percent={this.state.progress}
        foregroundGradientColor={[ '#738ef5', '#b3aeff' ]}
        animate={true}
        />)};
    </>
  }
}