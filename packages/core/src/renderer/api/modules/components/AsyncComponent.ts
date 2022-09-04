import { React } from '@hykord/webpack';

export default class AsyncComponent extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      Component: null
    };
  }

  async componentDidMount () {
    this.setState({
      Component: await this.props._provider()
    });
  }

  render () {
    const { Component } = this.state;
    if (Component) {
      return React.createElement(Component, Object.assign({}, this.props, this.props._pass));
    }
    return this.props._fallback || null;
  }

  static from (promise, fallback?: () => void) {
    return React.memo(
      (props) => React.createElement(AsyncComponent, {
        _provider: () => promise,
        _fallback: fallback,
        ...props
      })
    );
  }
};
