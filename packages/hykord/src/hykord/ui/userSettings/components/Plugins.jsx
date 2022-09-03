import { React } from "@hykord/webpack";
import PluginCard from './cards/PluginCard';
import { FormTitle, FormSection, ErrorBoundary, FormLabel } from '@hykord/components';

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