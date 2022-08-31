import { React, findByDisplayName } from "@module/webpack";

export class Boolean extends React.Component {
    constructor (props) {
        super(props);

        this.settings = window.hykord.settings;
        this.settingName = props.settingName;
        this.setting = props.setting;
        this.label = props.label;
        
        this.state = {
            value: this.setting.value
        }

        this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange() {
        const value = this.settings.toggleSetting(this.settingName);

        this.setState({
            value: value
        });

        this.settings.postHandle(this.settingName);
    }
  
    render () {
        const SwitchItem = findByDisplayName("SwitchItem");
        const FormItem = findByDisplayName("FormItem");

        return (
            <FormItem>
                <SwitchItem note={this.setting.description} value={this.state.value} onChange={this.handleChange}>
                    {this.label}
                </SwitchItem>
            </FormItem>
        )
    }
}