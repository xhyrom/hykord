import { findByDisplayName, React } from '@module/webpack';

const FormText = findByDisplayName("FormText");

export default (props) => {
    /**
     * @type {import('@module/structures').Plugin}
     */
    const plugin = window.hykord.plugins.getPlugin(props.pluginName);

    return (
        <FormText>
            {plugin.name}
        </FormText>
    )
}