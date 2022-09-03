import { React } from "@hykord/webpack";
import { FormItem, TextInput } from '..';

export class Text extends React.Component {
    render () {
        return (
            <FormItem>
                <TextInput {...this.props} />
            </FormItem>
        )
    }
}