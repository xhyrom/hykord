import { ErrorBoundary } from '@hykord/components';
import { themes } from '@loader/theme';
import Addon from './addon/Addon';

export default ErrorBoundary.wrap(() => {
  return (
    <Addon
      addons={themes}
      type="theme"
      placeholder="Search a theme by name"
      title="Here you can see installed theme"
    />
  );
});
