import { React } from "@hykord/webpack";
import { FormItem, Switch } from '..';

export class BooleanItem extends React.Component {
    constructor (props) {
        super(props);

        this.toggle = props.toggle;
        this.postHandle = props.postHandle;
        this.value = props.value;
        this.disabled = props.disabled;
        
        this.state = {
            value: this.value
        }

        this.handleChange = this.handleChange.bind(this);
    }
  
    async handleChange() {
        const value = await this.toggle();

        this.setState({
            value: value
        });

        this.postHandle?.();
    }
  
    render () {
        return (
            <FormItem>
                <Switch
                    disabled={this.disabled}
                    checked={this.state.value}
                    onChange={this.handleChange}
                />
            </FormItem>
        )
    }
}