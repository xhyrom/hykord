import { React } from '@hykord/webpack';
import PluginCard from './cards/PluginCard';
import { shell } from 'electron';
import { FormTitle, FormSection, ErrorBoundary, FormLabel, Button, FormDivider, Flex } from '@hykord/components';
import { Search } from '@hykord/components/other';
import { Plugin } from '@hykord/structures';
import { nameToId } from '@hykord/utilities';

export default async() => {
    const plugins = window.hykord.plugins;

    return () => {
        const [input, setInput] = React.useState('');

        const allPlugins: Plugin[] = input === ''
            ? plugins.getAllPlugins()
            : plugins.getAllPlugins().filter(plugin => plugin.name.includes(input));

        return (
            <ErrorBoundary>
                <FormSection>
                    <FormTitle tag='h1'>Plugins</FormTitle>
                    <FormLabel>Here you can see installed plugins</FormLabel>
                    <Flex justify={Flex.Justify.CENTER} align={Flex.Align.CENTER} wrap={Flex.Wrap.NOWRAP}>
                        <Search
                            containerStyle={{ marginRight: "20px" }}
                            placeholder='Search plugin by name'
                            type='text'
                            value={input}
                            onChange={setInput}
                        />
                        <Button
                            color={Button.Colors.BRAND_NEW}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.FILLED}
                            onClick={() => shell.openPath(plugins.location)}
                        >
                            Open Plugins Folder
                        </Button>
                        <Button
                            color={Button.Colors.PRIMARY}
                            size={Button.Sizes.MEDIUM}
                            look={Button.Looks.FILLED}
                            onClick={() => window.hykord.plugins.loadPlugins()}
                        >
                            Reload
                        </Button>
                    </Flex>
                    <FormDivider className='hykord-form-divider' />
                    {allPlugins.map(plugin => (
                        <PluginCard key={nameToId(plugin.name)} pluginName={plugin.name} />
                    ))}
                </FormSection>
            </ErrorBoundary>
        )
    }
}