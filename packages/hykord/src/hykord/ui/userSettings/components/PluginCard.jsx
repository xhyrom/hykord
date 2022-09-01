import { React } from '@module/webpack';
import { BooleanItem } from '@module/components/items'
import { Card, Flex, Markdown, FormText, ErrorBoundary } from '@module/components';

export default class extends React.Component {
  constructor (props) {
    super(props);

    this.plugins = window.hykord.plugins;
    this.plugin = this.plugins.getPlugin(props.pluginName);
  }

  render() {
    return (
        <ErrorBoundary>
          <Card className="hykord-plugin-card">
            <Flex justify={Flex.Justify.BETWEEN} align={Flex.Align.CENTER}>
              <FormText tag="h5">
                <strong>{this.plugin.name}</strong>{this.plugin.author ? <> by <strong>{this.plugin.author || '-'}</strong></> : null }
              </FormText>

              <BooleanItem
                    toggle={() => this.plugins.togglePlugin(this.plugin)}
                    value={this.plugin.enabled}
                />
            </Flex>
            <Markdown>{this.plugin.description || 'Good days, bad days.'}</Markdown>
          </Card>
        </ErrorBoundary>
    )
  }
}