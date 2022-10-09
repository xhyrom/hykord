import { React } from '@hykord/webpack/common';
import { Switch as OriginalSwitch } from '..';

interface Props {
  disabled?: boolean;
  value: boolean;
  onChange: (value: boolean) => boolean | Promise<boolean>;
  note: string;
  label: string;
}

export class Switch extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    value: this.props.value,
  };

  async handleChange() {
    const value = await this.props.onChange(!this.state.value);

    this.setState({
      value: value,
    });
  }

  render() {
    return (
      <OriginalSwitch
        disabled={this.props.disabled}
        value={this.state.value}
        onChange={this.handleChange}
        note={this.props.note}
      >
        {this.props.label}
      </OriginalSwitch>
    );
  }
}
