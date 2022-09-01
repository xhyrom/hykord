import 'module-alias/register';
import { findByDisplayName, findAsync, React } from "@module/webpack";
import PluginCard from './PluginCard';

const FormTitle = findByDisplayName("FormTitle");

export default async() => {
    const FormSection = await findAsync(() => findByDisplayName("FormSection"));

    return () => {
        const plugins = window.hykord.plugins;

        return ( 
            <FormSection>
                <FormTitle tag="h1">Plugins</FormTitle>
                {plugins.getAllPlugins().map(plugin => (
                    <PluginCard pluginName={plugin.name} />
                ))}
            </FormSection>
        )
    }
}