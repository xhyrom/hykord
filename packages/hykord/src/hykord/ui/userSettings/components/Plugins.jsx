import 'module-alias/register';
import { React } from "@module/webpack";
import PluginCard from './PluginCard';
import { FormTitle, FormSection, ErrorBoundary, FormLabel } from '@module/components';

export default async() => {
    const plugins = window.hykord.plugins;

    return () => {
        return (
            <ErrorBoundary>
                <FormSection>
                    <FormTitle tag="h1">Plugins</FormTitle>
                    <FormLabel>Here you can see installed plugins</FormLabel>
                    {plugins.getAllPlugins().map(plugin => (
                        <PluginCard pluginName={plugin.name} />
                    ))}
                </FormSection>
            </ErrorBoundary>
        )
    }
}