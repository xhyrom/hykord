import { React } from '@module/webpack';
import { BooleanItem } from '@module/components/items'
import { Card, Flex, Markdown, FormText, ErrorBoundary } from '@module/components';

export default class extends React.Component {
  constructor (props) {
    super(props);

    this.themes = window.hykord.themes;
    this.theme = this.themes.getTheme(props.themeName);
  }

  render() {
    return (
        <ErrorBoundary>
          <Card className="hykord-card">
            <Flex justify={Flex.Justify.BETWEEN} align={Flex.Align.CENTER}>
              <FormText tag="h5">
                <strong>{this.theme.name}</strong>{this.theme.author ? <> by <strong>{this.theme.author || '-'}</strong></> : null }
              </FormText>

              <BooleanItem
                    toggle={() => this.themes.toggleTheme(this.theme)}
                    disabled={this.theme.broken}
                    value={this.theme.enabled}
                />
            </Flex>
            <Markdown>{this.theme.description || 'Good days, bad days.'}</Markdown>
          </Card>
        </ErrorBoundary>
    )
  }
}