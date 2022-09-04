import { React } from "@hykord/webpack";
import { TextInput } from '..';

export class Search extends React.Component {
    render () {
        return (
            <div className="hykord-textinput-container" style={this.props.containerStyle || {}}>
                <div className="hykord-textinput-inner" style={this.props.innerStyle || {}}>
                    <TextInput
                        className="hykord-textinput-input"
                        {...this.props}
                    />
                </div>
            </div>
        )
    }
}