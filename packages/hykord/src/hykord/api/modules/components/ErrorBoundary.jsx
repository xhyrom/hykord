import { React } from '@hykord/webpack';
import { FormLabel, FormTitle, Button, FormDivider } from '.';
import Logger from '@hykord/logger';

export class ErrorBoundary extends React.Component {
    constructor (props) {
      super(props);
  
      this.state = {
        crashed: false,
        errorMessage: '',
        FormText: null,
        FormLabel: null,
        FormTitle: null,
        Divider: null,
        Button: null,
      };
    }
  
    static getDerivedStateFromError(error) {
      return { crashed: true, errorMessage: error.message };
    }

    componentDidCatch(error, errorInfo) {
      Logger.err(error, errorInfo);
    }
  
    render () {
      return this.state.crashed
        ? (
          <div class='hykord-errorboundary'>
            <FormTitle tag='h1'>Huh, that's odd</FormTitle>
            <FormLabel>An error occurred while rendering panel.</FormLabel>
            <code className='hykord-errorboundary-code'>{this.state.errorMessage}</code>
            <FormDivider className='hykord-form-divider' />
            <Button
              color={Button.Colors.RED}
              size={Button.Sizes.MEDIUM}
              look={Button.Looks.OUTLINED}
              onClick={() => this.setState({ ...this.state, crashed: false })}
            >
              Retry
            </Button>
          </div>
        )
        : this.props.children;
    }
}