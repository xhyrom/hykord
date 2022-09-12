import { React } from "@hykord/webpack";
import { FormItem, Slider as OriginalSlider } from '..';

export class Slider extends React.Component {
    constructor (props) {
        super(props);

        this.title = props.title;
        this.note = props.note;
        this.required = props.required;
        
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
            <FormItem title={this.title} note={this.note} required={this.required}>
                <OriginalSlider {...{
                ...this.props
                }} />
            </FormItem>
        )
    }
}