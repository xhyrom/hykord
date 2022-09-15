import { React } from '@hykord/webpack';
import { nameToId } from '@hykord/utilities';
import { Card, Flex, Markdown, FormText, ErrorBoundary, Button } from '@hykord/components';
import { downloadPlugin, PartialPlugin } from '../../utils';
import { compare } from 'semver';

export default class extends React.Component {
    plugins: any;
    plugin: PartialPlugin;
    constructor (props) {
        super(props);

        // @ts-expect-error Missing types
        this.plugins = window.hykord.plugins;
        this.plugin = props.pluginData;

        this.checkIfPluginIsInstalled = this.checkIfPluginIsInstalled.bind(this);
        this.checkIfPluginIsLatest = this.checkIfPluginIsLatest.bind(this);

        // @ts-expect-error 
        this.state = {
            type: this.checkIfPluginIsInstalled(this.plugin.name) ? this.checkIfPluginIsLatest(this.plugin.name, this.plugin.version) ? 'Running' : 'Update' : 'Install plugin',
            disabled: this.checkIfPluginIsInstalled(this.plugin.name) ? this.checkIfPluginIsLatest(this.plugin.name, this.plugin.version) ? true : false : false,
        };

        this.handleClick = this.handleClick.bind(this);

    }

    async handleClick() {
        if (!this.checkIfPluginIsInstalled(this.plugin.name) || !this.checkIfPluginIsLatest(this.plugin.name, this.plugin.version)) {
            // @ts-expect-error react
            this.setState({
                disabled: true,
                // @ts-expect-error react
                ...this.state
            })

            const downloaded = await downloadPlugin(this.plugin, !this.checkIfPluginIsLatest(this.plugin.name, this.plugin.version));

            // @ts-expect-error react
            this.setState({
                type: downloaded ? 'Running' : 'Install plugin',
                disabled: downloaded,
            })
        }
    }

    checkIfPluginIsInstalled(name: string) {
        // @ts-expect-error Missing types
        return window.hykord.plugins.getAllPlugins().some(p => p.name.toLowerCase() === nameToId(name) || p.name.toLowerCase() === name.toLowerCase());
    }

    checkIfPluginIsLatest(name: string, version: string) {
        return compare(window.hykord.plugins.getPlugin(this.plugin.name)?.version || '0.0.1', version) !== -1
    }

    render() {
        return (
            <ErrorBoundary>
                <Card className="hykord-card">
                    <Flex justify={Flex.Justify.START} align={Flex.Align.CENTER}>
                        <FormText tag="h5">
                            <strong>{this.plugin.name}</strong>{this.plugin.author ? <> by <strong>{this.plugin.author || '-'}</strong></> : null }
                        </FormText>

                        <Flex justify={Flex.Justify.END}>
                            <Button
                                color={Button.Colors.BRAND_NEW}
                                size={Button.Sizes.TINY}
                                look={Button.Looks.OUTLINED}
                                // @ts-expect-error react
                                disabled={this.state.disabled}
                                onClick={this.handleClick}
                            >
                                {
                                // @ts-expect-error react
                                this.state.type}
                            </Button>
                        </Flex>
                    </Flex>
                    <br />
                    <Markdown>{this.plugin.description || ''}</Markdown>
                </Card>
            </ErrorBoundary>
        )
    }
}