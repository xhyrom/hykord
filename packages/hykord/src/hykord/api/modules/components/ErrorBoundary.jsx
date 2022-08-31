import { React } from "@module/webpack";

export class ErrorBoundary extends React.Component {
    constructor (props) {
      super(props);
  
      this.state = {
        crashed: false
      };
    }
  
    static getDerivedStateFromError() {
        return { crashed: true };
    }
  
    render () {
      return this.state.crashed
        ? (
          <>
            <h2>Huh, that's odd</h2>
            <div>An error occurred while rendering settings panel.</div>
          </>
        )
        : this.props.children;
    }
}