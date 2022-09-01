import { findByDisplayName, findAsync, React } from "@module/webpack";
import Logger from "@module/logger";

const FormTitle = findByDisplayName("FormTitle");
const Link = findByDisplayName("Link");

export class ErrorBoundary extends React.Component {
    constructor (props) {
      super(props);
  
      this.state = {
        crashed: false,
        errorMessage: '',
        FormText: null,
        FormLabel: null,
      };
    }
  
    static getDerivedStateFromError(error) {
      return { crashed: true, errorMessage: error.message };
    }

    componentDidCatch(error, errorInfo) {
      Logger.err(error, errorInfo);
    }

    async componentDidMount() {
      const FormText = await findAsync(() => findByDisplayName('FormText')); 
      const FormLabel = await findAsync(() => findByDisplayName('FormLabel')); 
      this.setState({ FormText: FormText, FormLabel: FormLabel })
    }
  
    render () {
      return this.state.crashed
        ? (
          <>
            <FormTitle tag="h1">Huh, that's odd</FormTitle>
            {this.state.FormLabel ? <this.state.FormLabel>An error occurred while rendering panel.</this.state.FormLabel> : null}
            {this.state.FormText ? <this.state.FormText size={15}>{this.state.errorMessage}</this.state.FormText> : null}
          </>
        )
        : this.props.children;
    }
}