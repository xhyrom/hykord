import { ErrorBoundary } from '@hykord/components';
import { plugins } from '@loader/plugin';
import Addon from './Addon';

export default ErrorBoundary.wrap(() => {
  return (
    <Addon
      addons={plugins}
      type="plugin"
      placeholder="Search a plugin by name"
      title="Here you can see installed plugins"
    />
  );
});
