import { React } from '@hykord/webpack';
import { Switch } from '..';

interface Props {
    value: boolean;
    onChange: (value: boolean) => boolean;
    note: string;
    label: string;
}

export class Boolean extends React.Component<Props> {
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
            <Switch
                value={this.props.value}
                onChange={this.handleChange}
                note={this.props.note}
            >
                {this.props.label}
            </Switch>
        )
    }
}