import { React } from '@hykord/webpack/common';
import { CoreLogger as Logger } from '@common';
import { Card, Forms } from '.';

enum State {
  CRASHED,
  NO_ERROR,
}

export class ErrorBoundary extends React.Component {
  static wrap<T = any>(
    Component: React.ComponentType<T>,
  ): (props?: T) => React.ReactElement {
    return (props = {} as T) => (
      <ErrorBoundary>
        <Component {...(props as any)} />
      </ErrorBoundary>
    );
  }

  state = {
    state: State.NO_ERROR,
    message: '',
  };

  static getDerivedStateFromError(error: any) {
    return { state: State.CRASHED, message: error.message };
  }

  componentDidCatch(error: any, errorInfo: any) {
    Logger.err(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.state === State.NO_ERROR) return this.props.children;

    return (
      <Card
        style={{
          padding: '2em',
          backgroundColor: '#e7828430',
          borderColor: '#e78284',
          color: 'var(--text-normal)',
          overflow: 'hidden',
        }}
        body={
          <>
            <Forms.FormText
              style={{
                wordBreak: 'break-all',
              }}
            >
              <h1>Oh no!</h1>
              <p>An error occurred while rendering component.</p>
            </Forms.FormText>
            <br />
            <code>
              <Forms.FormText>{this.state.message}</Forms.FormText>
            </code>
          </>
        }
      />
    );
  }
}
