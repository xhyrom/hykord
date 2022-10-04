import { React } from '@hykord/webpack';
import { Switch as OriginalSwitch } from '..';

interface Props {
    value: boolean;
    onChange: (value: boolean) => boolean | Promise<boolean>;
    note: string;
    label: string;
}

export class Switch extends React.Component<Props> {
    constructor (props: Props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    state = {
        value: this.props.value
    }
  
    async handleChange() {
        const value = await this.props.onChange(!this.props.value);

        this.setState({
            value: value
        });
    }
  
    render () {
        return (
            <OriginalSwitch
                value={this.state.value}
                onChange={this.handleChange}
                note={this.props.note}
            >
                {this.props.label}
            </OriginalSwitch>
        )
    }
}