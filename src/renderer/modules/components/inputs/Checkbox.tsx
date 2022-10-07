import { React } from '@hykord/webpack';
import { Checkbox as OriginalCheckbox } from '..';

interface Props {
    disabled?: boolean;
    checked: boolean;
    onChange: (value: boolean) => boolean | Promise<boolean>;
}

export class Checkbox extends React.Component<Props> {
    constructor (props: Props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    state = {
        checked: this.props.checked
    }
  
    async handleChange() {
        const checked = await this.props.onChange(!this.state.checked);

        this.setState({
            checked: checked
        });
    }
  
    render () {
        return (
            <OriginalCheckbox
                disabled={this.props.disabled}
                checked={this.state.checked}
                onChange={this.handleChange}
            />
        )
    }
}