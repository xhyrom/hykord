import { React } from "@module/webpack";
import { FormText, FormLabel, FormTitle, Divider, Button } from ".";
import Logger from "@module/logger";

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
          <>
            <FormTitle tag="h1">Huh, that's odd</FormTitle>
            <FormLabel>An error occurred while rendering panel.</FormLabel>
            <FormText size={15}>{this.state.errorMessage}</FormText>
            <Divider />
            <Button
              color={Button.Colors.RED}
              size={Button.Sizes.MEDIUM}
              look={Button.Looks.OUTLINED}
              onClick={() => this.setState({ ...this.state, crashed: false })}
            >
              Retry
            </Button>
          </>
        )
        : this.props.children;
    }
}