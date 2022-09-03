import { React, findByDisplayName } from "@hykord/webpack";

export class Boolean extends React.Component {
    constructor (props) {
        super(props);

        this.toggle = props.toggle;
        this.postHandle = props.postHandle;
        this.note = props.note;
        this.value = props.value;
        this.label = props.label;
        
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
        const SwitchItem = findByDisplayName("SwitchItem");
        const FormItem = findByDisplayName("FormItem");

        return (
            <FormItem>
                <SwitchItem note={this.note} value={this.state.value} onChange={this.handleChange}>
                    {this.label}
                </SwitchItem>
            </FormItem>
        )
    }
}